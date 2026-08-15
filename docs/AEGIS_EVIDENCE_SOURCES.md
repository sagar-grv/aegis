# Aegis — Live Evidence Sources

## Environmental Evidence

Aegis retrieves current environmental evidence by coordinate from Open-Meteo’s documented forecast and air-quality APIs. The decision engine records source timestamps and displays a provider-specific provenance row instead of treating live data as a generic, interchangeable score.

| Evidence stream | Endpoint family | Aegis variables | Decision use |
|---|---|---|---|
| Weather | Open-Meteo Forecast API | Temperature, apparent temperature, precipitation, wind speed, wind gusts, weather code | Wind and surface-exposure assessment. |
| Rain | Open-Meteo Forecast API | Hourly precipitation probability | Near-term surface and electrical-exposure assessment. |
| Air quality | Open-Meteo Air Quality API | PM2.5, PM10, nitrogen dioxide, ozone, US AQI | Outdoor air-exposure assessment. |
| Field observation | Public contributor | Condition, observed wind, free-text note, optional bounded site photo, and neutral visual observation | Visible public context only; it is marked `unattributed` and cannot restore confidence or change the recommendation. |

Open-Meteo’s forecast documentation describes coordinate-based current and hourly responses, including wind and precipitation variables. Its air-quality documentation describes coordinate-based current air-quality responses, including PM2.5, PM10, nitrogen dioxide, ozone, and US AQI.[1] [2]

## Reliability Contract

Live public data is external evidence, not an instruction to take action. Aegis applies a deterministic confidence policy, shows missing or deliberately fault-injected source rows, and creates a refusal state when decisive weather evidence and trusted field observation are unavailable. Any member of the public can add only a genuine contribution; it is stored independently of the recommendation as `unattributed` context. An optional public photo is constrained to neutral, schema-validated scene context and cannot make or execute an operational decision. This keeps the product a human evidence desk rather than an autonomous control system.

## References

[1] [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)

[2] [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
