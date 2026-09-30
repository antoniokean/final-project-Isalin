import { useEffect, useRef, useState } from "react";
import { convert, fetchHistory, clearHistory } from "./api";
import BreakdownView from "./components/BreakdownView";
import HistoryList from "./components/HistoryList";
import ReferenceChart from "./components/ReferenceChart";
import PasswordGate from "./components/PasswordGate";

const PLACEHOLDER = {
  "latin-to-baybayin": "Type Filipino text, e.g. bahay, bangka, pilipinas...",
  "baybayin-to-latin": "Paste Baybayin glyphs here...",
};

export default function App() {
  const [direction, setDirection] = useState("latin-to-baybayin");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [breakdown, setBreakdown] = useState(null);
  const [status, setStatus] = useState({ text: "", error: false });
  const [history, setHistory] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const rows = await fetchHistory(15);
    setHistory(rows);
  }

  async function runConversion(text, dir, save = true) {
    if (!text.trim()) {
      setOutput("");
      setBreakdown(null);
      setStatus({ text: "", error: false });
      return;
    }
    try {
      setStatus({ text: "Converting…", error: false });
      const result = await convert(text, dir, save);
      setOutput(result.output);
      setBreakdown(result.breakdown);
      setStatus({ text: "", error: false });
      if (save) loadHistory();
    } catch (err) {
      setStatus({ text: err.message, error: true });
    }
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runConversion(value, direction, false), 350);
  }

  function handleInputBlur() {
    clearTimeout(debounceRef.current);
    if (input.trim()) runConversion(input, direction, true);
  }

  function handleSwap() {
    const nextDirection =
      direction === "latin-to-baybayin" ? "baybayin-to-latin" : "latin-to-baybayin";
    setDirection(nextDirection);
    const newInput = output;
    setInput(newInput);
    setOutput("");
    setBreakdown(null);
    if (newInput.trim()) runConversion(newInput, nextDirection, true);
  }

  function handleHistorySelect(item) {
    setDirection(item.direction);
    setInput(item.input_text);
    setOutput(item.output_text);
    setBreakdown(null);
    setStatus({ text: "", error: false });
  }

  async function handleClearHistory() {
    await clearHistory();
    setHistory([]);
  }

  async function handleCopy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setStatus({ text: "Copied to clipboard.", error: false });
    } catch {
      setStatus({ text: "Couldn't copy — select and copy manually.", error: true });
    }
  }

  const isLatinFirst = direction === "latin-to-baybayin";

  return (
    <PasswordGate>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1 className="app-title">
              Isalin <span className="glyphs">ᜁᜐᜎᜒᜈ᜔</span>
            </h1>
            <p className="app-subtitle">
              A transliterator system that reads syllables between the Latin
              alphabet and Baybayin writing system.
            </p>
          </div>
        </header>

        <div className="main-grid">
          <section className="converter">
            <div className="direction-row">
              <span className={`direction-label ${isLatinFirst ? "active" : ""}`}>
                A B C
              </span>
              <button
                className={`swap-button ${isLatinFirst ? "" : "flipped"}`}
                onClick={handleSwap}
                aria-label="Swap conversion direction"
                title="Swap direction"
              >
                ⇄
              </button>
              <span className={`direction-label ${!isLatinFirst ? "active" : ""}`}>
                ᜃ ᜄ ᜅ
              </span>
            </div>

            <label className="field-label" htmlFor="input-field">
              {isLatinFirst ? "Latin text" : "Baybayin text"}
            </label>
            <textarea
              id="input-field"
              className="text-area input"
              value={input}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder={PLACEHOLDER[direction]}
              style={isLatinFirst ? {} : { fontFamily: "var(--font-baybayin)", fontSize: "1.3rem" }}
            />

            <div className="converter-meta">
              <span className={`status-text ${status.error ? "error" : ""}`}>
                {status.text}
              </span>
            </div>

            <div className="output-block">
              <label className="field-label">
                {isLatinFirst ? "Baybayin output" : "Latin output"}
              </label>
              <textarea
                className="text-area output"
                value={output}
                readOnly
                placeholder="Output appears here"
                style={isLatinFirst ? {} : { fontFamily: "var(--font-body)", fontSize: "1.05rem" }}
              />
              <div className="converter-meta">
                <span></span>
                <button className="copy-button" onClick={handleCopy}>
                  Copy output
                </button>
              </div>
            </div>

            <BreakdownView breakdown={breakdown} />

            <p className="footnote">
              Quick glossary: <strong>vowel</strong> = the core sound of a
              syllable. <strong>Coda</strong> = a trailing consonant with no
              vowel after it. <strong>Virama</strong> = the mark that strikes
              out a glyph's vowel to write a coda. Baybayin also merges i/e
              and o/u into one vowel mark each.
            </p>
          </section>

          <div>
            <HistoryList history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
            <div className="sidebar" style={{ marginTop: 20 }}>
              <h2 className="sidebar-title">Alphabet reference</h2>
              <ReferenceChart />
            </div>
          </div>
        </div>
      </div>
    </PasswordGate>
  );
}
