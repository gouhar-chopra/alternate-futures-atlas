# Alternate Futures Atlas

Build ELSEWHERE — Explore the Life That Could Have Been. Create a complete, responsive, cinematic web application that lets users explore plausible alternate futures based on important past decisions, using transparent AI-generated scenarios, interactive fictional financial and social dashboards, and a reflective conclusion. Follow the full master prompt in my conversation, including the editorial cream/burgundy/mint visual system, black-and-white walking-character scroll transition, working navigation and forms, transparent AI simulation, data visualizations, responsive layouts, accessibility, privacy, error handling, and truthful labeling of all hypothetical data.



I have attached the images for UI and UX reference. Do refer to them.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/255dead1-1b47-4bb7-9278-5b125e6358b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### AI scenarios and server credentials

ELSEWHERE already uses Lovable AI Gateway, not a separate external provider key.
`src/lib/simulate.functions.ts` validates input with `DecisionInputSchema`, reads
`LOVABLE_API_KEY` inside its server handler, and uses the AI SDK's OpenAI Responses
interface at `https://ai.gateway.lovable.dev/v1/responses` with
`openai/gpt-6-astra`. It consumes the streamed result on the server, validates it
with `parseScenarioText`, and returns the existing `SimulateResult` shape.
There are no automatic retries or alternate-provider fallbacks.

The managed key is configured in the Lovable project and was verified through a
real preview form submission. This project has no Lovable Cloud database or auth
connection; its existing TanStack server runtime handles generation. Scenarios
and drafts remain in this browser's storage, as before.

A GitHub clone does **not** inherit hosted secrets. For local live generation,
the managed credential must be supplied securely to the server process as
`LOVABLE_API_KEY` by an authorized environment/secret manager before starting
`npm run dev`. Its availability on your own machine has not been verified.
If you cannot securely provision that managed credential locally, use live
generation in the Lovable preview; local demo browsing still works. Do not invent
a key, use an external-provider key in its place, or copy a credential into code.
Never prefix it with `VITE_`, send it to the browser, print it, or commit it.
Published runtime access must be verified separately after publishing; this
project has not been published.
