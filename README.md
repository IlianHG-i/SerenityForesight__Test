# AI Sensitive Data Inspector

## Getting Started

```
docker compose up --build
```

Once the containers are running, the backend API is available at `http://localhost:3000`. No local installation of Node.js, Python, or Presidio is required — everything runs inside Docker.

## Architecture

- **frontend**: not built yet.
- **backend** (Node.js/Express): validates requests, calls Presidio, and exposes the proprietary API. Organized in layers:
  - `routes` — declares each HTTP endpoint and its method, no logic.
  - `controllers` — receives the request, orchestrates validation and the service, builds the HTTP response.
  - `services` — business logic (risk level calculation, response transformation), independent from Express.
  - `Presidio adapter` — the only layer that talks to Presidio, isolating this external dependency.
  - `validators` — input validation utilities.
- **presidio-analyzer**: open-source PII detection service, reachable only through Docker's internal network (no host port exposed).

Communication flow: `User → React frontend → Node.js backend → Presidio Analyzer`.

## API Documentation

The backend API is documented directly in the source code using Swagger/OpenAPI annotations (in `src/routes/routes.js`), which generate the OpenAPI document — there is no separate handwritten API contract.

- Swagger UI: `http://localhost:3000/api-docs`
- Generated OpenAPI document (JSON): `http://localhost:3000/api-docs/openapi.json`
- A static export of this document is also included in the repository: `openapi.json`. It is regenerated automatically from the source-code annotations every time the backend starts (no manual step needed).

## Risk Level

The `riskLevel` field returned by `/api/v1/analyze` is computed from the types of entities detected by Presidio. Each entity type is classified into one of three sensitivity categories: `high`, `medium`, `low`.

**Entity classification**

This classification is **arbitrary**: the [full list of entities supported by Presidio](https://presidio.dataprivacystack.org/supported_entities/?h=list#list-of-supported-entities) was consulted to manually assign each type to a risk category, based on a judgment call about its sensitivity — the subject does not impose it, and another breakdown would be just as valid.

| Category | Entities |
|---|---|
| `high` | CREDIT_CARD, CRYPTO, IBAN_CODE, IP_ADDRESS, MAC_ADDRESS, LOCATION, PERSON, PHONE_NUMBER, EMAIL_ADDRESS, MEDICAL_LICENSE, US_BANK_NUMBER, US_DRIVER_LICENSE, US_ITIN, US_MBI, US_NPI, US_PASSPORT, US_SSN, UK_DRIVING_LICENCE, UK_NHS, UK_NINO, UK_PASSPORT, UK_VEHICLE_REGISTRATION, MEDICAL_FAMILY_HISTORY, MEDICAL_HISTORY |
| `medium` | NRP, UK_POSTCODE |
| `low` | DATE_TIME, URL, MEDICAL_DISEASE_DISORDER, MEDICAL_MEDICATION, MEDICAL_THERAPEUTIC_PROCEDURE, MEDICAL_CLINICAL_EVENT, MEDICAL_BIOLOGICAL_ATTRIBUTE, MEDICAL_BIOLOGICAL_STRUCTURE |

**`riskLevel` calculation rule** (in this order):
- `none`: no entity detected.
- `high`: at least 2 entities classified `high`.
- `medium`: exactly 1 `high` entity, or at least 2 `medium` entities.
- `low`: exactly 1 `medium` entity, or at least 1 `low` entity.
- `none`: otherwise (none of the above cases apply).

**Classification rationale**: financial/official identifiers (credit card, passport, national ID number, etc.) and directly identifying personal data (name, email, phone number, location) are classified as `high`, since they allow a person to be identified or compromised, alone or combined. Generic medical mentions (a disease, a medication, a procedure) are classified as `low`, since mentioning them reveals nothing about a specific person; on the other hand, a medical history explicitly attributed to an individual or a family (`MEDICAL_FAMILY_HISTORY`, `MEDICAL_HISTORY`) is classified as `high`, since this data becomes critical once tied to an identifiable person.

## Configuration

The backend is configured through environment variables (see `.env.example`):

| Variable | Description |
|---|---|
| `HEALTH_LINK` | Full URL of Presidio's `/health` endpoint |
| `ANALYZE_LINK` | Full URL of Presidio's `/analyze` endpoint |
