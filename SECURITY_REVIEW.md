# Security Review

**Review date:** 2026-08-28  
**Scope:** Local repository and localhost production build  
**Deployment tested:** No production or third-party systems were probed

## Summary

No Critical or High severity issue remains in the reviewed code or installed dependency tree. The public portfolio has no authentication, database, uploads, payments, or AI integration. Its meaningful server-side surface is limited to the contact and newsletter endpoints.

| Severity | Open | Fixed during review |
| --- | ---: | ---: |
| Critical | 0 | 1 dependency-chain finding |
| High | 0 | 20 dependency-chain findings |
| Medium | 1 | 0 |
| Low | 1 | 3 hardening items |

## Open findings

### Medium: Rate limiting is instance-local

The contact and newsletter handlers use an in-memory limiter. It constrains repeated requests on one running instance but does not provide a global limit across Vercel instances or cold starts.

**Impact:** A distributed sender could consume Resend quota or create unwanted email volume.

**Current controls:** same-origin enforcement, strict schemas, request-size limits, honeypot fields, generic responses and per-instance throttling.

**Recommended follow-up:** Add Vercel Firewall rate limits or a durable limiter backed by a shared store before advertising the forms broadly.

### Low: CSP permits inline scripts and styles

The Content Security Policy retains `'unsafe-inline'` for compatibility with the current Next.js bootstrap and component-level dynamic styles.

**Impact:** CSP provides less protection against a future HTML injection defect than a nonce-based strict policy would.

**Recommended follow-up:** Move remaining inline style values to CSS variables or classes and adopt nonce-based script policies when the framework integration is stable.

## Fixed during review

- Removed the vulnerable Vercel CLI dependency from the application tree and switched deployment commands to on-demand `npx` execution.
- Removed `unsafe-eval` and unrestricted HTTPS image sources from CSP.
- Added control-character rejection for contact names.
- Bounded rate-limit map growth with stale-entry pruning.
- Preserved server-side escaping for generated email HTML.

## Verification evidence

The following local checks passed:

```text
npm run check-types
npm run lint
npm run build
npm audit
```

The 2026-08-28 production refresh repeated TypeScript, ESLint, production build, dependency audit, manual secret-pattern scanning, dangerous JavaScript-pattern scanning, and local API abuse checks. `npm audit` reported 0 vulnerabilities. Foreign-origin contact requests returned `403`, invalid contact and newsletter payloads returned `400`, and an oversized contact payload returned `413`.

The production build generated the public pages and 63 static work-detail routes. Manual browser checks covered desktop, 390 px and 320 px layouts, the Three.js canvas, GSAP reveals, theme switching, mobile navigation, catalog search, work details and the persistent audio player.

API checks confirmed `403` for foreign origins, `400` for invalid input, `413` for oversized bodies, `429` after the rate threshold and a controlled `503` when Resend is not configured.

## Coverage limitations

- GitHub secret scanning is disabled for this repository.
- `gitleaks`, `semgrep`, `trivy` and OWASP ZAP were not available locally.
- The local checkout is shallow, so full Git-history secret scanning was not performed.
- Resend delivery was not exercised because production credentials and a real recipient were intentionally not used.
- Backblaze B2 was checked only through public read URLs. No authenticated bucket operation was attempted.
