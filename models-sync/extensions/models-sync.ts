import { readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { basename, dirname, join } from "node:path";
import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";

type JsonObject = Record<string, unknown>;

type DiscoveredModel = {
	id: string;
	name?: string;
};

const agentDir = process.env.PI_CODING_AGENT_DIR || join(homedir(), ".pi", "agent");
const modelsPath = join(agentDir, "models.json");
const statusKey = "models-sync";

function isObject(value: unknown): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function providersFrom(config: JsonObject): JsonObject {
	if (!isObject(config.providers)) {
		throw new Error(`Expected a top-level \"providers\" object in ${modelsPath}.`);
	}
	return config.providers;
}

async function readConfig(): Promise<JsonObject> {
	let text: string;
	try {
		text = await readFile(modelsPath, "utf8");
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Could not read ${modelsPath}: ${detail}`);
	}

	try {
		const parsed: unknown = JSON.parse(text);
		if (!isObject(parsed)) throw new Error("the top level must be an object");
		providersFrom(parsed);
		return parsed;
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Could not parse ${modelsPath}: ${detail}`);
	}
}

function providerFrom(config: JsonObject, providerId: string): JsonObject {
	const provider = providersFrom(config)[providerId];
	if (!isObject(provider)) {
		throw new Error(`Provider \"${providerId}\" is not an object in ${modelsPath}.`);
	}
	return provider;
}

function modelEntries(provider: JsonObject, providerId: string): JsonObject[] {
	if (provider.models === undefined) return [];
	if (!Array.isArray(provider.models) || !provider.models.every(isObject)) {
		throw new Error(`Provider \"${providerId}\" has a non-array \"models\" value.`);
	}
	return provider.models;
}

function hasModelApi(providerId: string, provider: JsonObject, ctx: ExtensionCommandContext): boolean {
	if (typeof provider.api === "string" && provider.api.trim().length > 0) return true;
	if (modelEntries(provider, providerId).some((model) => typeof model.api === "string" && model.api.trim().length > 0)) {
		return true;
	}
	return ctx.modelRegistry.getProvider(providerId)?.getModels().some((model) => typeof model.api === "string") ?? false;
}

function existingModelIds(models: readonly JsonObject[]): Set<string> {
	const ids = new Set<string>();
	for (const model of models) {
		if (typeof model.id === "string" && model.id.length > 0) ids.add(model.id);
	}
	return ids;
}

function additionsFor(models: readonly JsonObject[], catalog: readonly DiscoveredModel[]): DiscoveredModel[] {
	const existing = existingModelIds(models);
	return catalog.filter((model) => !existing.has(model.id));
}

function catalogUrl(baseUrl: string): string {
	let url: URL;
	try {
		url = new URL(baseUrl);
	} catch {
		throw new Error(`Provider baseUrl is not a valid URL: ${baseUrl}`);
	}
	url.pathname = `${url.pathname.replace(/\/+$/, "")}/models`;
	url.search = "";
	url.hash = "";
	return url.toString();
}

function parseCatalog(payload: unknown): DiscoveredModel[] {
	if (!isObject(payload) || !Array.isArray(payload.data)) {
		throw new Error('The endpoint did not return an OpenAI-style { "data": [...] } model catalog.');
	}

	const models = new Map<string, DiscoveredModel>();
	for (const entry of payload.data) {
		if (!isObject(entry) || typeof entry.id !== "string" || entry.id.trim().length === 0) {
			throw new Error("The endpoint returned a model entry without a valid string id.");
		}
		if (models.has(entry.id)) continue;
		const name = typeof entry.name === "string" && entry.name.trim().length > 0 ? entry.name : undefined;
		models.set(entry.id, { id: entry.id, ...(name ? { name } : {}) });
	}
	return [...models.values()];
}

async function requestHeaders(ctx: ExtensionCommandContext, providerId: string): Promise<Headers> {
	let resolved;
	try {
		resolved = await ctx.modelRegistry.getProviderAuth(providerId);
	} catch {
		throw new Error(`Could not resolve credentials for provider \"${providerId}\". Check its Pi authentication settings.`);
	}

	const headers = new Headers({ Accept: "application/json" });
	for (const [name, value] of Object.entries(resolved?.auth.headers ?? {})) {
		if (typeof value === "string") headers.set(name, value);
	}
	if (resolved?.auth.apiKey && !headers.has("Authorization")) {
		headers.set("Authorization", `Bearer ${resolved.auth.apiKey}`);
	}
	return headers;
}

async function fetchCatalog(ctx: ExtensionCommandContext, providerId: string, baseUrl: string): Promise<DiscoveredModel[]> {
	const timeout = AbortSignal.timeout(15_000);
	const signal = ctx.signal ? AbortSignal.any([ctx.signal, timeout]) : timeout;
	const response = await fetch(catalogUrl(baseUrl), {
		headers: await requestHeaders(ctx, providerId),
		signal,
	});
	if (!response.ok) throw new Error(`Model catalog request failed with HTTP ${response.status}.`);

	let payload: unknown;
	try {
		payload = await response.json();
	} catch {
		throw new Error("Model catalog response was not valid JSON.");
	}
	return parseCatalog(payload);
}

function modelDefinition(model: DiscoveredModel): JsonObject {
	return model.name === undefined ? { id: model.id } : { id: model.id, name: model.name };
}

async function atomicWrite(path: string, content: string): Promise<void> {
	const temporaryPath = join(dirname(path), `.${basename(path)}.${process.pid}.${crypto.randomUUID()}.tmp`);
	let mode = 0o600;
	try {
		mode = (await stat(path)).mode & 0o777;
	} catch {
		// The source file was already read successfully; retain a restrictive fallback.
	}

	try {
		await writeFile(temporaryPath, content, { encoding: "utf8", mode });
		await rename(temporaryPath, path);
	} catch (error) {
		await rm(temporaryPath, { force: true }).catch(() => undefined);
		throw error;
	}
}

/** Re-read immediately before writing so external edits made during confirmation survive. */
async function addNewModels(providerId: string, catalog: readonly DiscoveredModel[]): Promise<DiscoveredModel[]> {
	const latest = await readConfig();
	const provider = providerFrom(latest, providerId);
	const models = modelEntries(provider, providerId);
	const additions = additionsFor(models, catalog);
	if (additions.length === 0) return [];

	provider.models = [...models, ...additions.map(modelDefinition)];
	await atomicWrite(modelsPath, `${JSON.stringify(latest, null, 2)}\n`);
	return additions;
}

async function chooseProvider(args: string, ctx: ExtensionCommandContext, config: JsonObject): Promise<string> {
	const tokens = args.trim() ? args.trim().split(/\s+/) : [];
	if (tokens.length > 1) throw new Error("Usage: /models-sync [provider-id]");

	const ids = Object.keys(providersFrom(config));
	if (ids.length === 0) throw new Error(`No providers are configured in ${modelsPath}.`);
	if (tokens.length === 1) {
		if (!ids.includes(tokens[0])) throw new Error(`Unknown provider \"${tokens[0]}\".`);
		return tokens[0];
	}
	if (ids.length === 1) return ids[0];
	if (!ctx.hasUI) throw new Error("Specify a provider ID when no interactive UI is available.");

	const selected = await ctx.ui.select("Sync models from provider", ids);
	if (!selected) throw new Error("Model sync cancelled.");
	return selected;
}

export default function (pi: ExtensionAPI) {
	pi.registerCommand("models-sync", {
		description: "Add new models from an OpenAI-compatible provider catalog",
		handler: async (args, ctx) => {
			const config = await readConfig();
			const providerId = await chooseProvider(args, ctx, config);
			const provider = providerFrom(config, providerId);
			if (typeof provider.baseUrl !== "string" || provider.baseUrl.trim().length === 0) {
				throw new Error(`Provider \"${providerId}\" has no baseUrl to fetch its model catalog.`);
			}
			if (!hasModelApi(providerId, provider, ctx)) {
				throw new Error(
					`Provider \"${providerId}\" has no api for the synced models. Set its \"api\" (for example, \"openai-completions\") before syncing.`,
				);
			}

			ctx.ui.setStatus(statusKey, `Fetching ${providerId} models…`);
			try {
				const catalog = await fetchCatalog(ctx, providerId, provider.baseUrl);
				const additions = additionsFor(modelEntries(provider, providerId), catalog);
				if (additions.length === 0) {
					ctx.ui.notify(`No new models found for ${providerId}.`, "info");
					return;
				}

				if (!ctx.hasUI) throw new Error("Model sync requires interactive confirmation before writing models.json.");
				const preview = additions.map((model) => `• ${model.id}${model.name ? ` — ${model.name}` : ""}`).join("\n");
				const confirmed = await ctx.ui.confirm(
					`Add ${additions.length} model${additions.length === 1 ? "" : "s"}?`,
					`Provider: ${providerId}\n\n${preview}`,
				);
				if (!confirmed) {
					ctx.ui.notify("Model sync cancelled; models.json was not changed.", "info");
					return;
				}

				const added = await addNewModels(providerId, catalog);
				if (added.length === 0) {
					ctx.ui.notify("No models were added; models.json changed while confirmation was open.", "info");
					return;
				}
				const refresh = await ctx.modelRegistry.refresh({ providers: [providerId], allowNetwork: false });
				if (refresh.aborted) throw new Error("Pi stopped reloading models after the sync.");
				const refreshError = refresh.errors.get(providerId);
				if (refreshError) {
					throw new Error(`Models were added, but Pi could not reload provider \"${providerId}\": ${refreshError.message}`);
				}
				ctx.ui.notify(`Added ${added.length} model${added.length === 1 ? "" : "s"} to ${providerId}.`, "info");
			} finally {
				ctx.ui.setStatus(statusKey, undefined);
			}
		},
	});
}
