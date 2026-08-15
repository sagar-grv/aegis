# Aegis — Validation Record

## Live Evidence Check

The public Aegis desk was verified against live coordinate-based environmental responses for Bengaluru. The resolved interface displayed current temperature, wind gusts, precipitation probability, US AQI, provider timezone, and a live-source provenance state. The underlying public procedure returned successfully in approximately three seconds and did not substitute unavailable values with generated data.

At the time of the check, the evidence engine returned a **Proceed with monitoring** state with 75% evidence coverage. The missing 25% represented the intentionally absent human field observation; this is displayed distinctly from live environmental sources.

## Integration Check

The self-cleaning integration probe verified all of the following against live sources and the database: a missing-weather fault produced **refusal**; a temporary field report persisted and could be retrieved; an assessment generated a human-review receipt; and cleanup removed the temporary user, field report, and receipt. A database verification confirmed that all three temporary-record counts were zero after the probe.

## Hard-Mode Browser Check

The public desk’s **Wind & weather** fault-injection control was activated against a resolved live-evidence state. The interface immediately marked fault injection as active and began a new real-source assessment without replacing the omitted source with a synthetic value. The resulting decision-state update is checked in the next browser validation step.

The resulting state was **Aegis refuses to decide** at 50% coverage and 40% confidence. The desk explicitly marked the weather stream as hidden, requested a fresh on-site wind-gust reading as the smallest missing fact, and did not produce an autonomous recommendation. This is the primary 30% evidence-loss demonstration.

## Post-Enhancement Public Check

After opening the field-report and human-receipt paths to the public, Bengaluru resolved to a **Proceed with monitoring** recommendation at 75% coverage, with real Open-Meteo weather and air-quality values rendered in the interface. The public view directly exposed both contribution modals and explicitly stated that the resulting records are unattributed and cannot restore confidence or authorise an action.
