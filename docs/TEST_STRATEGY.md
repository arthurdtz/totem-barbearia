# Test Strategy — Bravos Barbearia

> **Status:** Proposed. This document describes the testing strategy planned for the project. Test layers must be marked as implemented in the root README only after they exist, run successfully, and can be inspected in the repository.

## 1. Purpose

Bravos Barbearia is a full-stack application that generates hairstyle and beard previews from a user photo. This document defines how the project will validate both the deterministic behavior of the application and the non-deterministic behavior of the generative-AI integration.

The strategy is designed around one central distinction:

> **Application behavior can be automatically asserted. AI image quality cannot be guaranteed by an automated assertion alone; it requires controlled inputs, clear acceptance criteria, and documented evaluation evidence.**

The objective is not to claim that an image model is perfect. The objective is to prove that the application validates inputs, protects the provider integration, communicates failures correctly, and evaluates generated outputs in a consistent and transparent way.

## 2. Scope

| Area | Included | Primary validation method |
| --- | --- | --- |
| API input validation | Required photo, supported file type, malformed style data, invalid request body | Automated API tests |
| AI-provider integration | Request construction, success response normalization, error mapping, key protection | Automated tests with mocked provider |
| Rate limiting | Limit response, retry feedback, request threshold behavior | Automated API integration tests |
| Frontend behavior | Empty state, upload errors, loading state, error feedback, favorites | Component and end-to-end tests |
| Main user journey | Upload/capture, style selection, request generation, result comparison, favorites | End-to-end tests |
| AI output behavior | Identity preservation, requested style adherence, hair/beard-only scope, image usability | Controlled manual evaluation rubric |
| Privacy in test data | Consent and sanitization of test photos and artifacts | Fixture review and repository checks |

The following items are outside the initial scope: performance/load testing at scale, visual regression across all devices, security penetration testing, and fully automated biometric identity verification. They can be introduced later after the core suite is stable.

## 3. Quality Risks

| Risk ID | Risk | Impact on the user or product | Mitigation |
| --- | --- | --- | --- |
| R-01 | A request without a valid image reaches the AI provider. | Wasted quota, avoidable provider calls, unclear user experience. | Validate payload and image metadata before the provider call. |
| R-02 | Unsupported files are processed as images. | Errors, unpredictable processing, possible security exposure. | Restrict allowed MIME types and validate the file server-side. |
| R-03 | Provider failures are returned as generic errors. | The user cannot tell whether to retry, correct input, or stop. | Map provider errors to stable internal error codes and messages. |
| R-04 | Rate limiting is absent or incorrectly configured. | Quota abuse or legitimate users being blocked incorrectly. | Test behavior below, at, and above the configured threshold. |
| R-05 | A prompt does not contain the required guardrails. | Higher chance of unintended edits outside hair and beard. | Test the prompt-builder contract independently. |
| R-06 | A generation materially alters facial identity or unrelated features. | The core product expectation is not met. | Evaluate controlled cases against a documented visual rubric. |
| R-07 | A change breaks the main UI journey. | Users cannot upload, request a preview, view a result, or save a favorite. | Add component and end-to-end regression coverage. |
| R-08 | Personal photos or API keys are committed to the repository. | Privacy and security incident. | Use approved fixtures, `.gitignore`, and a pre-commit review checklist. |

## 4. Test Levels and Responsibilities

The project should follow a practical test pyramid: many fast tests for deterministic logic, fewer integration tests for API behavior, and a small number of end-to-end tests for critical user journeys. AI visual evaluation is tracked separately because it is inherently probabilistic.

| Layer | Suggested tooling | Purpose | External Gemini calls? |
| --- | --- | --- | --- |
| Unit tests | Vitest or Jest | Validators, prompt-builder, error mapper, response formatter | No |
| API integration tests | Supertest with a mocked AI client | HTTP contract, status codes, rate-limit logic, error mapping | No |
| Component tests | React Testing Library + Vitest | Input state, errors, loading behavior, result rendering, favorites UI | No |
| End-to-end tests | Playwright | High-value browser flows using a predictable mocked endpoint | No |
| AI evaluation | Versioned case manifest + reviewer rubric | Validate generated-image behavior and record evidence | Controlled manual runs only |

All automated tests should mock the AI provider. This keeps the suite repeatable, fast, free of generation costs, and independent from temporary provider limits. Real AI generation should be reserved for a small evaluation set, not executed automatically on every pull request.

## 5. Proposed Test Structure

```text
project-root/
├── src/
├── server.js
├── docs/
│   ├── TEST_STRATEGY.md
│   └── screenshots/
├── tests/
│   ├── api/
│   │   ├── validation.test.js
│   │   ├── error-mapping.test.js
│   │   ├── rate-limit.test.js
│   │   └── gemini-contract.test.js
│   ├── ui/
│   │   ├── upload-form.test.jsx
│   │   ├── generation-state.test.jsx
│   │   └── favorites.test.jsx
│   ├── e2e/
│   │   └── hairstyle-flow.spec.js
│   ├── fixtures/
│   │   ├── valid-image.jpg
│   │   ├── unsupported-file.txt
│   │   └── provider-responses.js
│   └── ai-evaluation/
│       ├── cases.json
│       ├── rubric.md
│       └── results/
└── .github/
    └── workflows/
        └── tests.yml
```

The exact folders can be adapted to the current codebase. The key rule is separation: fixtures and provider mocks must not be mixed with production code, and user photos must not be committed as public test data without explicit permission.

## 6. Automated API Test Cases

The initial automated suite should focus on API behavior because it directly demonstrates validation, negative testing, contract testing, error analysis, and mocking skills.

| ID | Scenario | Setup and action | Expected result |
| --- | --- | --- | --- |
| API-001 | Missing photo | Send a generation request without an image. | `400` response with a stable validation code; AI client is not called. |
| API-002 | Unsupported file type | Send an unsupported MIME type or non-image fixture. | `400` response with a clear error; AI client is not called. |
| API-003 | Malformed style data | Send missing or invalid style fields. | `400` response with validation details; AI client is not called. |
| API-004 | Valid request | Mock a successful provider response and submit a valid payload. | API calls the provider adapter with the expected contract and returns normalized result data. |
| API-005 | Temporary provider limit | Mock a rate-limit response from the provider. | Stable mapped response, retry-oriented message, no false success. |
| API-006 | Provider quota unavailable | Mock a quota-exhausted provider response. | Stable non-retryable response and actionable message. |
| API-007 | Unexpected provider error | Mock timeout, network failure, or unknown provider error. | Controlled `5xx` response without stack trace, key, or internal detail. |
| API-008 | Rate-limit threshold | Send requests up to and beyond the test-specific limit. | Requests under limit proceed; next request returns defined rate-limit behavior. |

### Design for testability

The Gemini call should live behind a small provider adapter, for example `services/geminiClient.js`. API routes should call this adapter rather than invoke the SDK directly. In tests, replace the adapter with a mock that returns known responses or errors.

This design makes it possible to verify the application's behavior without depending on a live API key, model availability, cost, or unpredictable generation result.

## 7. Frontend and End-to-End Coverage

The frontend suite should prove that the user receives clear feedback at every relevant state. It should test behavior, not implementation details such as internal component state.

| ID | Scenario | Expected behavior |
| --- | --- | --- |
| UI-001 | User attempts to continue without a photo. | The interface prevents progression and shows a clear validation message. |
| UI-002 | User uploads an unsupported file. | The interface communicates that the file is invalid and does not show a false loading state. |
| UI-003 | Generation request is pending. | Loading state is visible and duplicate submission is prevented. |
| UI-004 | API returns temporary provider limit. | The interface presents a retry-oriented message. |
| UI-005 | API returns unavailable quota. | The interface explains that the request cannot be completed and avoids suggesting endless retries. |
| UI-006 | Successful generation result. | Result appears with before/after comparison controls. |
| UI-007 | Favorite action. | The selected result is saved and remains available according to the application's persistence behavior. |
| E2E-001 | Main happy path. | A user can upload an approved fixture, choose a style, receive a mocked result, view the comparison, and save a favorite. |
| E2E-002 | Main validation failure path. | A user who sends an invalid upload receives feedback and cannot submit an invalid generation request. |

## 8. AI Validation Strategy

### 8.1 What can be automated

The **prompt-builder contract** is deterministic code. Unit tests should verify that the prompt constructed by the application contains the required guardrails, including:

- instructions to preserve facial structure, eye color, skin tone, and expression;
- instructions to modify only hair and/or beard;
- the style description selected by the user;
- constraints that discourage unrelated changes to background, clothing, and face.

These tests demonstrate that the correct instructions are sent to the model. They do not prove that every model output will comply perfectly.

### 8.2 What must be evaluated with a rubric

AI-generated images should be evaluated with controlled cases and a consistent rubric. Create a case manifest in `tests/ai-evaluation/cases.json`; each case requires a stable ID, permitted source image, chosen style, model identifier, run date, output path, and reviewer decision.

Example case format:

```json
{
  "id": "AI-VAL-001",
  "input": "tests/fixtures/consented-front-view-01.jpg",
  "style": "textured crop with short beard",
  "model": "<model-id-used-by-the-project>",
  "runDate": "YYYY-MM-DD",
  "result": "tests/ai-evaluation/results/AI-VAL-001-run-01.png",
  "decision": "Pass"
}
```

### 8.3 Visual acceptance rubric

| Criterion | Pass definition | Evidence to retain |
| --- | --- | --- |
| Identity preservation | The source and generated face remain recognizably the same person; no material change to facial structure, eye color, skin tone, or expression. | Side-by-side comparison and short reviewer note. |
| Scope control | Visible changes are limited to hair and/or beard; there is no material unintended alteration to face, clothing, or background. | Side-by-side comparison and note. |
| Style adherence | The generated hair or beard materially reflects the selected style description. | Selected style, screenshot, and reviewer note. |
| Image usability | Hair region is visible enough to evaluate; no severe artifact makes the preview unusable. | Screenshot and issue reference if failed. |
| Privacy and consent | The image is approved for testing and does not expose personal information in the repository. | Fixture provenance record. |

Use one of three decisions for each result:

| Decision | Meaning | Required action |
| --- | --- | --- |
| Pass | The case meets all relevant acceptance criteria. | Record the evidence and keep the case in the evaluation history. |
| Needs review | The result is ambiguous or has a minor issue. | Record the concern and decide whether prompt or UX refinement is needed. |
| Fail | The result violates an important criterion or is unusable. | Open an issue or document the failure; do not select only better outputs as evidence. |

### 8.4 Sampling approach

Run selected high-value cases three times with the same input and style. Record each outcome instead of keeping only the best generation. This is a concise way to demonstrate awareness of model variability.

For a portfolio project, six to ten well-documented cases are more valuable than a large, undocumented collection of outputs.

## 9. Test Data, Privacy, and Security

Do not commit a real user's photo to the repository without clear, documented consent. Prefer synthetic images, licensed images, or images supplied by contributors specifically for test use. Do not include identifying names, addresses, or API keys in fixtures, screenshots, or evaluation records.

The following files should remain excluded from Git:

```gitignore
.env
db.json
*.log
```

If `db.json` is necessary for development, publish a sanitized `db.example.json` containing only non-sensitive placeholder records.

## 10. Reporting and README Status

The root README intentionally marks every test layer as `Planned`. Change a status only when the work is present and reproducible.

| README status | Use only when | Evidence expected |
| --- | --- | --- |
| Planned | The approach is documented but no runnable tests or evaluation evidence exists. | This strategy document and roadmap. |
| Manual validation documented | Controlled AI cases were evaluated with the rubric and results were recorded. | Case manifest, screenshots allowed for publication, and reviewer decisions. |
| Implemented | Automated tests exist and can run locally. | Test files, dependencies, and a documented command such as `npm test`. |
| CI enabled | The automated suite runs in a repository workflow. | Workflow file and a visible successful run. |

Never label tests as implemented based solely on a plan or a manual click-through. The credibility of the portfolio comes from matching each README claim to inspectable code, command, or evidence.

## 11. Implementation Roadmap

| Step | Deliverable | Portfolio value |
| --- | --- | --- |
| 1 | Extract validation functions and AI provider adapter from route handlers. | Demonstrates testability-oriented design. |
| 2 | Implement API-001 through API-007 using a mocked provider. | Demonstrates negative testing, contracts, mocking, and error analysis. |
| 3 | Add prompt-builder contract tests. | Demonstrates realistic QA treatment of AI integrations. |
| 4 | Add one Playwright happy path and one validation-failure flow. | Demonstrates end-to-end coverage of the user journey. |
| 5 | Create six controlled AI evaluation cases and record rubric results. | Demonstrates evidence-based validation of non-deterministic output. |
| 6 | Add GitHub Actions for deterministic tests. | Demonstrates CI readiness and regression protection. |

## 12. Definition of Done for the First QA-Focused Release

The first QA-focused release is complete when the automated API suite covers the principal validation and provider-error paths, the AI provider is mocked in automated tests, at least one end-to-end flow is runnable, and the project contains controlled evidence of AI-output validation. Every quality claim in the root README must be supported by an inspectable file, command, test result, or documented evaluation.

## References

[1]: https://vitest.dev/guide/ "Vitest documentation"
[2]: https://github.com/ladjs/supertest "Supertest repository"
[3]: https://testing-library.com/docs/react-testing-library/intro/ "React Testing Library documentation"
[4]: https://playwright.dev/docs/intro/ "Playwright documentation"