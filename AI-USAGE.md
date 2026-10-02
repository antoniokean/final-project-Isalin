# AI Usage

[← Back to README](README.md)

This project was built with AI assistance. This file is the record of it.

## 1. How I used AI

### 2026-09-05 - Configure frontend API base URL

* **Tool:** Claude
* **What I asked for:** Help configuring the frontend API base URL so the application could work both locally during development and after deployment.
* **What it gave back:** A configuration using `VITE_API_URL` to select the backend URL when deployed, while keeping `/api` as the default for local development. This allows Vite's proxy to forward local API requests to the backend at `localhost:3001`.
* **What I kept, what I changed, and why:** I kept the environment-variable approach because it allows the frontend to communicate with the deployed backend without changing the source code between environments. I retained `/api` as the fallback so local development would continue working with the existing Vite proxy.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/2e3a0836e2dd91249c384a554d7e6f6ba24ad3b6

### 2026-09-05 - Add CORS support

* **Tool:** Claude
* **What I asked for:** Help configuring CORS in the Express backend so the frontend could make API requests during local development and after deployment.
* **What it gave back:** A CORS configuration using an `allowedOrigins` array containing the local Vite development URL and the deployed frontend URL from the `FRONTEND_URL` environment variable.
* **What I kept, what I changed, and why:** I kept the allowed-origins approach because the backend needs to accept requests from both environments. I removed the unnecessary duplicate `app.use(cors())` after noticing that the application already had a more specific CORS configuration below it.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/5d4551c567aebd368ee2f1a28af9439a15698119

### 2026-09-05 - Refactor app.js structure

* **Tool:** Claude
* **What I asked for:** Help make the Express `app.js` file clearer and easier to maintain without changing its existing functionality.
* **What it gave back:** A restructuring of the Express setup so middleware, CORS configuration, API routes, and exported functions were organized more clearly.
* **What I kept, what I changed, and why:** I kept the clearer organization because it makes the backend easier to read and maintain. I checked that the existing conversion and history endpoints continued to work after the refactoring.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/2f3d21dd7d07408a5149c25eabc81c4ab7950e57

### 2026-09-05 - Simplify BASE URL configuration for API

* **Tool:** Claude
* **What I asked for:** Help simplify the frontend API base URL configuration while keeping it compatible with both local development and the deployed application.
* **What it gave back:** A simplified `BASE` configuration that uses `VITE_API_URL` when it is available and falls back to `/api` when it is not. The `/api` fallback allows Vite's proxy to continue forwarding requests to the local backend at `localhost:3001`.
* **What I kept, what I changed, and why:** I kept the simplified configuration because it avoids hardcoding different API URLs into the application. The fallback to `/api` also preserves the existing local development setup, while `VITE_API_URL` allows the deployed frontend to communicate with the deployed backend.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/78953b97f6f18b204c7b1f846add0b541b67c85d

### 2026-09-26 - Add standalone vowels to ReferenceChart component
* **Tool: Claude
* **What I asked for: Help add a standalone vowels section to the ReferenceChart component so the reference chart would show the vowels that can be used without a consonant.
* **What it gave back: The AI added a STANDALONE_VOWELS array containing the three standalone vowel options: a, e / i, and o / u. It also added a new section to the reference chart that displays these vowels separately from the consonants.
* **What I kept, what I changed, and why: I kept the standalone vowel section because it makes the reference chart easier to understand and clearly separates standalone vowels from consonant glyphs. The implementation uses an array and maps over it to display each vowel, which keeps the component organized and makes the list easy to update.
* **Commit: https://github.com/antoniokean/Isalin-deploy/commit/2c74f04b1d16dfd0e7c465815330a9c2135628f4

### 2026-09-26 - Refactor ReferenceChart to include standalone vowels
* **Tool: Claude
* **What I asked for: Help improve the ReferenceChart implementation so standalone vowels could be integrated into the main reference table instead of being displayed only as a separate section.
* **What it gave back: The AI changed the reference table to include a dedicated vowel column for the three standalone vowel options: a, e / i, and o / u. It added a STANDALONE_VOWEL_BY_ROW object that maps each vowel row to its corresponding standalone glyph. The table then displays the standalone vowel in this column while continuing to generate consonant glyphs using the existing vowel suffixes.
* **What I kept, what I changed, and why: I kept this approach because it makes the relationship between standalone vowels and consonant-based syllables clearer in one table. I also kept the existing consonant and kudlit logic because the new standalone vowel column only adds information and does not change how the consonant glyphs are generated. The explanatory text was also updated to clarify that the vowel column contains the standalone glyph used when a syllable has no consonant.
* **Commit: https://github.com/antoniokean/Isalin-deploy/commit/2f000a34f623786171a71dedde986c12af3aed20

## 2. Where the AI got it wrong

### Case 1 - Duplicate CORS middleware

* **What it gave me:** The AI-generated change included both `app.use(cors())` and `app.use(cors({ origin: allowedOrigins }))`.
* **What was wrong with it:** The first CORS middleware was unnecessary because the second middleware already configured CORS for the required origins. Keeping both made the configuration redundant.
* **What I did instead:** I removed the unnecessary `app.use(cors())` and kept the configured CORS middleware using the `allowedOrigins` array.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/5d4551c567aebd368ee2f1a28af9439a15698119

### Case 2 - Duplicate module exports

* **What it gave me:** The AI-generated change added the `module.exports` statement for `latinToBaybayin`, `baybayinToLatin`, and `syllabifyWord`, but the statement appeared twice.
* **What was wrong with it:** The same functions were being exported twice, which was unnecessary and made the code less clear.
* **What I did instead:** I removed the duplicate export statement and kept one `module.exports` statement containing the three conversion functions.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/5d4551c567aebd368ee2f1a28af9439a15698119

### Case 3 - Incorrect BASE URL simplification

* **What it gave me:** The AI suggested changing the `BASE` configuration to always use `"/api"`, replacing the environment-variable configuration.
* **What was wrong with it:** Using only `"/api"` would work with the local Vite proxy but would not allow the deployed frontend to directly use the deployed backend URL.
* **What I did instead:** I kept the `VITE_API_URL` option while retaining `"/api"` as the fallback. This allows the application to use the local proxy during development and the deployed backend when `VITE_API_URL` is configured.
* **Commit:** https://github.com/HAU-6APSI/student-6apsi-2215-antoniokean/commit/78953b97f6f18b204c7b1f846add0b541b67c85d

## 3. Who wrote what

### Written by me

* **File:** `app.js`
* **Commit:** No commit history available, since it was done locally and just upload via files
* **What it does and why it is built this way:** I worked on the Express backend that handles the application's API requests. The `/api/convert` endpoint receives the text and conversion direction, validates the submitted values, performs the appropriate Latin-to-Baybayin or Baybayin-to-Latin conversion, and saves the conversion to the history when enabled. I built it this way so the frontend can communicate with the conversion logic through a clear API while keeping the processing on the backend.

### The AI-written part I understand best

* **File:** `src/api.js`
* **Commit:** No commit history available, since it was done locally and just upload via files
* **What it does and why we kept it:** This file handles communication between the frontend and backend API. The `BASE` constant determines which API path the frontend uses. During local development, `/api` is used so Vite can proxy the request to the backend. When the application is deployed, `VITE_API_URL` can point the frontend to the deployed backend. We kept this approach because the same frontend code can work in both development and deployment without manually changing the API request URLs.
