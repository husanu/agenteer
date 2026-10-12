# Sync Pi models

Keep Pi's `models.json` in sync with the model aliases exposed by an OpenAI-compatible server such as llama-swap.

Run `/models-sync` when your server gains models. It adds only model IDs Pi does not already know about, so your existing context limits, vision settings, reasoning settings, sampling parameters, names, and other tuning stay intact.

## Use once

You do not need to install anything permanently. Run:

```bash
pi -e npm:pi-models-sync-extension
```

Then run this inside Pi:

```text
/models-sync
```

If `models.json` has several providers, Pi shows a picker. To target one directly:

```text
/models-sync llama-swap
```

`-e` loads the extension for that Pi process only. It does not install the package or change your Pi settings.

## Install it permanently (optional)

```bash
pi install npm:pi-models-sync-extension
```

Start Pi normally afterwards and use `/models-sync` whenever needed.

## Set up your provider

The provider must already be configured in Pi's `models.json` with a `baseUrl` and `api`. For example, `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "llama-swap": {
      "baseUrl": "http://192.168.1.222:1080/v1",
      "api": "openai-completions",
      "apiKey": "local",
      "models": []
    }
  }
}
```

Your server must expose an OpenAI-style model endpoint at `<baseUrl>/models`, returning a response like:

```json
{
  "data": [
    { "id": "qwen3.6", "name": "Qwen3.6-27B" }
  ]
}
```

If the server needs authentication, configure its API key and headers normally in `models.json`. The extension uses those credentials for the catalog request and never displays them.

## What happens when you sync

1. Choose a provider, if necessary.
2. Pi fetches its model catalog.
3. Pi shows model IDs it can add and asks for confirmation.
4. Confirm to add them to that provider's `models` list.

The extension never removes models, never overwrites existing model entries, and makes no change if the request fails, the server response is invalid, or you cancel. New models contain only the server's `id` and optional display `name`; add model-specific limits and capabilities yourself afterwards.

New models are available in `/model` immediately after a successful sync.

## Troubleshooting

- **Provider is not listed:** add it under `providers` in Pi's `models.json` first.
- **Provider has no `baseUrl` or `api`:** add an OpenAI-compatible base URL (normally ending in `/v1`) and an API such as `openai-completions`.
- **Request fails or response is invalid:** confirm that `curl <baseUrl>/models` returns an object with a `data` array.
- **A model needs vision, reasoning, or custom limits:** edit that model's entry in `models.json` after it is added; later syncs preserve those fields.
