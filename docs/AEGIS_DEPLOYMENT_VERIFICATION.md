# Aegis — Deployment Verification

The dedicated Vercel project `aegis` was created from the private `sagar-grv/aegis` repository. Its production deployment reached `READY` status, and the production alias returned HTTP 200 with Aegis title, description, compiled application assets, and the expected browser interface shell.

The first deployment served only the static interface and returned 404 for public tRPC paths. The project was adapted with an explicit Vercel API catch-all, an Express/tRPC bundle, and an `/api/:path*` rewrite. The final production endpoint returned a valid JSON batch response from `aegis.live,aegis.preview`, including current Bengaluru coordinate data, weather, wind gusts, rain probability, PM2.5, US AQI, and a 75%-coverage Aegis assessment. This confirms that the Vercel public Live Decision Desk and the deliberate evidence-loss hard mode operate against live data.

The codebase also contains authenticated field reports, decision receipts, object storage, and server-side visual extraction. Those protected features require equivalent OAuth, database, object-storage, and server-side model credentials in Vercel before they should be represented as externally operational. The managed project runtime already supplies those credentials; no secret value was copied to the external deployment.
