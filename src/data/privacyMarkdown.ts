/** Markdown counterpart of /privacy; keep policy facts aligned with that page. */
export const PRIVACY_MARKDOWN = `# Privacy — Synara

Private by default. Clear by design. Last updated July 15, 2026.

Synara runs on your machine and connects to your chosen providers. There is no Synara account or hosted server holding your work. Normal use does not send code or prompts to Synara. Feedback you explicitly write and submit is the exception, with the limited diagnostics below.

## Where your data lives

Chats, projects, settings, and history live in a local SQLite database on your device. The small server process powering the app runs locally, not as a hosted cloud service.

## Where your prompts and code go

Synara connects directly to the selected provider using your existing logins. That provider receives the prompts and code needed for the session under its own privacy terms. Synara does not proxy, copy, or store that traffic on its own servers.

## No account, no lock-in

No Synara signup or login is required. Remote access from another device is self-hosted over your own LAN or Tailscale network, protected by an authentication token you generate and control.

## Anonymous analytics — off by default

Optional anonymous, aggregate usage analytics use PostHog and only run after you opt in. If enabled, analytics receive:

- Event names, such as app launched or provider connected.
- An anonymous identifier: a random per-install ID or one-way hash of the provider account ID.
- OS, CPU architecture, and Synara version.
- Whether you use the desktop app or web/CLI client.

Analytics never receive prompts, messages, chat history, code, files, diffs, repository contents, API keys, tokens, provider credentials, your name, email, or an IP-based location profile. Events carry no person profile and are not tied to your identity.

Leave analytics disabled (the default), or enable with \`SYNARA_TELEMETRY_ENABLED=true\`. A Settings → Privacy toggle is planned.

## Feedback you choose to send

The Feedback Synara dialog sends only when you press Submit. It includes your text, app version, operating system, provider and model, runtime modes, and session/turn status. Automated diagnostics exclude chat messages, prompts, project paths, repository contents, session logs, and screenshots. The website and email provider deliver reports to the maintainer for support and product improvement, not an analytics profile.

## Open source

Synara uses the MIT license. [Read the source](https://github.com/Emanuele-web04/synara).

## About this website

The marketing site uses [Vercel Web Analytics](https://vercel.com/docs/analytics/privacy-policy) for anonymous aggregate visit counts: no cookies, cross-site tracking, or selling of data.

Questions: [contact the creator on X](https://x.com/emanueledpt).
`;
