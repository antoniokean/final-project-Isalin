/**
 * Baybayin <-> Latin Transliterator
 * -----------------------------------------------------------------------
 * Single-file Express app: mapping table, syllabifier, converter,
 * and API routes. Postgres history logging is OPTIONAL — if no
 * DATABASE_URL is set, the app still runs fine, it just skips
 * saving/reading history and /api/history returns an empty array.
 *
 * Run it:
 *   npm install express cors pg
 *   node --env-file=.env app.js
 *   (then POST to http://localhost:3001/api/convert)
 * -----------------------------------------------------------------------
 */

const express = require("express");
const cors = require("cors");

// ---------------------------------------------------------------------
// 1. MAPPING TABLE
// ---------------------------------------------------------------------
const BASE_GLYPH = {
  k: "\u1703", g: "\u1704", ng: "\u1705",
  t: "\u1706", d: "\u1707", n: "\u1708",
  p: "\u1709", b: "\u170A", m: "\u170B",
  y: "\u170C",
  r: "\u170D", // "Ra" — added to Unicode in v14.0 (2021)
  l: "\u170E", w: "\u170F",
  s: "\u1710", h: "\u1711",
};

const STANDALONE_VOWEL = {
  a: "\u1700",
  i: "\u1701", e: "\u1701",
  u: "\u1702", o: "\u1702",
};

const KUDLIT_UPPER = "\u1712";
const KUDLIT_LOWER = "\u1713";
const VIRAMA = "\u1714";

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const CONSONANTS = Object.keys(BASE_GLYPH).filter((c) => c !== "ng");

const GLYPH_TO_CONSONANT = {};
for (const [letter, glyph] of Object.entries(BASE_GLYPH)) {
  if (!GLYPH_TO_CONSONANT[glyph]) GLYPH_TO_CONSONANT[glyph] = letter;
}
const VOWEL_GLYPH_TO_LETTER = { "\u1700": "a", "\u1701": "i", "\u1702": "u" };

// ---------------------------------------------------------------------
// 1b. LOAN-LETTER SUBSTITUTION
// ---------------------------------------------------------------------
function applyLoanLetterSubstitutions(lowerWord) {
  let result = "";
  let i = 0;
  while (i < lowerWord.length) {
    const ch = lowerWord[i];
    const next = lowerWord[i + 1];

    if (ch === "c" && next === "h") {
      result += "ts";
      i += 2;
      continue;
    }
    if (ch === "c") {
      result += "e i y".includes(next) ? "s" : "k";
    } else if (ch === "q") {
      result += "k";
    } else if (ch === "v") {
      result += "b";
    } else if (ch === "z") {
      result += "s";
    } else if (ch === "f") {
      result += "p";
    } else if (ch === "j") {
      result += "dy";
    } else if (ch === "x") {
      result += "ks";
    } else {
      result += ch;
    }
    i += 1;
  }
  return result;
}

// ---------------------------------------------------------------------
// 2. SYLLABIFIER
// ---------------------------------------------------------------------
function tokenizeWord(word) {
  const tokens = [];
  let i = 0;
  const lower = applyLoanLetterSubstitutions(word.toLowerCase());
  while (i < lower.length) {
    if (lower.slice(i, i + 2) === "ng") {
      tokens.push("ng");
      i += 2;
    } else {
      tokens.push(lower[i]);
      i += 1;
    }
  }
  return tokens;
}

function syllabifyWord(word) {
  const tokens = tokenizeWord(word);
  const units = [];
  let i = 0;

  while (i < tokens.length) {
    const tok = tokens[i];

    if (VOWELS.has(tok)) {
      units.push({ type: "vowel", v: tok });
      i += 1;
      continue;
    }

    if (CONSONANTS.includes(tok) || tok === "ng") {
      const next = tokens[i + 1];
      if (next && VOWELS.has(next)) {
        units.push({ type: "syllable", c: tok, v: next });
        i += 2;
      } else {
        units.push({ type: "coda", c: tok });
        i += 1;
      }
      continue;
    }

    units.push({ type: "literal", ch: tok });
    i += 1;
  }

  return units;
}

// ---------------------------------------------------------------------
// 3. CONVERTERS
// ---------------------------------------------------------------------
function unitsToBaybayin(units) {
  return units
    .map((u) => {
      if (u.type === "vowel") return STANDALONE_VOWEL[u.v];
      if (u.type === "literal") return u.ch;
      if (u.type === "coda") {
        const glyph = BASE_GLYPH[u.c];
        if (!glyph) return "";
        return glyph + VIRAMA;
      }
      const glyph = BASE_GLYPH[u.c];
      if (!glyph) return "";
      if (u.v === "a") return glyph;
      if (u.v === "i" || u.v === "e") return glyph + KUDLIT_UPPER;
      return glyph + KUDLIT_LOWER;
    })
    .join("");
}

function latinToBaybayin(text) {
  const words = text.split(/(\s+)/);
  const breakdown = [];
  const output = words
    .map((word) => {
      if (/^\s*$/.test(word)) return word;
      const units = syllabifyWord(word);
      breakdown.push({
        word,
        syllables: units.map((u) => {
          if (u.type === "coda") return { type: "coda", text: u.c };
          if (u.type === "vowel") return { type: "vowel", text: u.v };
          if (u.type === "literal") return { type: "literal", text: u.ch };
          return { type: "syllable", text: `${u.c}${u.v}` };
        }),
      });
      return unitsToBaybayin(units);
    })
    .join("");

  return { output, breakdown };
}

function baybayinToLatin(text) {
  let result = "";
  const chars = Array.from(text);
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    if (VOWEL_GLYPH_TO_LETTER[ch]) {
      result += VOWEL_GLYPH_TO_LETTER[ch];
      i += 1;
      continue;
    }

    if (GLYPH_TO_CONSONANT[ch]) {
      const consonant = GLYPH_TO_CONSONANT[ch];
      const next = chars[i + 1];
      if (next === KUDLIT_UPPER) {
        result += consonant + "i";
        i += 2;
      } else if (next === KUDLIT_LOWER) {
        result += consonant + "u";
        i += 2;
      } else if (next === VIRAMA) {
        result += consonant;
        i += 2;
      } else {
        result += consonant + "a";
        i += 1;
      }
      continue;
    }

    result += ch;
    i += 1;
  }

  return { output: result };
}

// ---------------------------------------------------------------------
// 4. POSTGRES (history log)
// ---------------------------------------------------------------------
let pool = null;
if (process.env.DATABASE_URL) {
  try {
    const { Pool } = require("pg");
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log("Postgres configured — history endpoints active.");
  } catch (err) {
    console.warn("DATABASE_URL was set but 'pg' package failed to load. Run `npm install pg`.");
  }
} else {
  console.log("No DATABASE_URL set — running without history logging (this is fine).");
}

async function saveHistory(inputText, outputText, direction) {
  if (!pool) return null;
  try {
    const { rows } = await pool.query(
      `INSERT INTO conversions (input_text, output_text, direction)
       VALUES ($1, $2, $3) RETURNING id, created_at`,
      [inputText, outputText, direction]
    );
    return rows[0];
  } catch (err) {
    console.error("Failed to save history:", err.message);
    return null;
  }
}

async function getHistory(limit = 20) {
  if (!pool) return [];
  try {
    const { rows } = await pool.query(
      `SELECT id, input_text, output_text, direction, created_at
       FROM conversions ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return rows;
  } catch (err) {
    console.error("Failed to fetch history:", err.message);
    return [];
  }
}

async function clearHistory() {
  if (!pool) return false;
  try {
    await pool.query(`DELETE FROM conversions`);
    return true;
  } catch (err) {
    console.error("Failed to clear history:", err.message);
    return false;
  }
}

// ---------------------------------------------------------------------
// 5. EXPRESS APP
// ---------------------------------------------------------------------
const app = express();

// Allow requests from local dev (Vite) and your deployed frontend.
// Set FRONTEND_URL as an environment variable on your hosting platform
// once you have your real Vercel URL (e.g. https://isalin.vercel.app).
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Simple shared-password gate: every /api request must include the
// correct password in a header, or it's rejected. This covers every
// route uniformly, including DELETE /api/history. Set APP_PASSWORD
// as an environment variable to turn this on.
const APP_PASSWORD = process.env.APP_PASSWORD;

function requirePassword(req, res, next) {
  if (!APP_PASSWORD) {
    console.warn("APP_PASSWORD not set — API is running WITHOUT a password gate.");
    return next();
  }
  const provided = req.header("x-app-password");
  if (provided !== APP_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.use("/api", requirePassword);

app.post("/api/convert", async (req, res) => {
  const { text, direction, save } = req.body || {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Field 'text' is required." });
  }
  if (!["latin-to-baybayin", "baybayin-to-latin"].includes(direction)) {
    return res.status(400).json({
      error: "Field 'direction' must be 'latin-to-baybayin' or 'baybayin-to-latin'.",
    });
  }

  let result;
  if (direction === "latin-to-baybayin") {
    result = latinToBaybayin(text);
  } else {
    result = baybayinToLatin(text);
  }

  const shouldSave = save !== false;
  const saved = shouldSave ? await saveHistory(text, result.output, direction) : null;

  res.json({
    input: text,
    output: result.output,
    direction,
    breakdown: result.breakdown || null,
    historyId: saved ? saved.id : null,
  });
});

app.get("/api/history", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const rows = await getHistory(limit);
  res.json(rows);
});

app.delete("/api/history", async (req, res) => {
  const success = await clearHistory();
  if (!success) {
    return res.status(500).json({ error: "Failed to clear history — check server logs." });
  }
  res.json({ cleared: true });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: pool ? "connected" : "not configured" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Baybayin translator API running on http://localhost:${PORT}`);
});

module.exports = { latinToBaybayin, baybayinToLatin, syllabifyWord };
