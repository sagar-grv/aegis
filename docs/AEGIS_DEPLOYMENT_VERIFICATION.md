# Aegis — Deployment Verification

The dedicated Vercel project `aegis` was created from the private `sagar-grv/aegis` repository. Its production deployment reached `READY` status, and the production alias returned HTTP 200 with Aegis title, description, compiled application assets, and the expected browser interface shell.

The first deployment served only the static interface and returned 404 for public tRPC paths. The project was adapted with an explicit Vercel API catch-all, an Express/tRPC bundle, and an `/api/:path*` rewrite. The final production endpoint returned a valid JSON batch response from `aegis.live,aegis.preview`, including current Bengaluru coordinate data, weather, wind gusts, rain probability, PM2.5, US AQI, and a 75%-coverage Aegis assessment. This confirms that the Vercel public Live Decision Desk and the deliberate evidence-loss hard mode operate against live data.

The codebase exposes public field contributions and public human responses without sign-in. When database, object-storage, and server-side model services are configured, the managed full-stack runtime persists those explicitly unattributed records and supports constrained visual extraction. No managed-runtime secret was copied to the external Vercel deployment.

The latest production release is `READY` on commit `f4767d8`. A final public browser check resolved Bengaluru telemetry and a `PROCEED / LIVE MONITORING` assessment with 75% evidence coverage. The field-contribution and public-response controls were directly available without a sign-in state.

OAuth is no longer required for the public contribution or public-response flows. The design labels every such contribution as unattributed and preserves Aegis’s rule that public context cannot authorise an action or improve confidence.

After the anonymous-public access conversion, the local browser showed no sign-in control. **Add public field fact** opened the contribution modal directly, with field condition, optional measured gust, note, and optional-image controls. The modal explicitly states that contributions are unattributed and cannot restore Aegis confidence or authorise an action.

The browser also opened **Record public human response** without authentication. Its receipt modal labels the response unattributed, confirms that Aegis cannot execute the action, and presents only separate human response choices: defer, request a check, or acknowledge the recommendation.

After the first Vercel public-access release, the production interface displayed the sign-in-free controls but did not resolve its assessment card because the external project had no database credentials. The database-independent public-assessment fallback resolved this regression without replacing live environmental evidence with generated values.

The follow-up production deployment restored the live Bengaluru assessment to **Proceed with monitoring** at 75% coverage while retaining no sign-in control. Its public field-contribution modal opened directly and clearly disclosed that public contributions are unattributed, do not affect Aegis confidence or authorisation, and remain in the contributor’s browser session when Vercel has no persistence service.
