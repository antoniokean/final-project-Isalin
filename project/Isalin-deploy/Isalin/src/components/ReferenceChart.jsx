const CONSONANTS = [
  { letter: "b", glyph: "\u170A" },
  { letter: "k", glyph: "\u1703" },
  { letter: "d", glyph: "\u1707" },
  { letter: "g", glyph: "\u1704" },
  { letter: "h", glyph: "\u1711" },
  { letter: "l", glyph: "\u170E" },
  { letter: "m", glyph: "\u170B" },
  { letter: "n", glyph: "\u1708" },
  { letter: "ng", glyph: "\u1705" },
  { letter: "p", glyph: "\u1709" },
  { letter: "s", glyph: "\u1710" },
  { letter: "t", glyph: "\u1706" },
  { letter: "w", glyph: "\u170F" },
  { letter: "y", glyph: "\u170C" },
  { letter: "r", glyph: "\u170D" },
];

const KUDLIT_I = "\u1712";
const KUDLIT_U = "\u1713";
const VIRAMA = "\u1714";

// Standalone vowel glyphs — these don't follow the consonant+kudlit
// pattern, so they're keyed by row label instead of a suffix.
const STANDALONE_VOWEL_BY_ROW = {
  a: "\u1700",
  "e / i": "\u1701",
  "o / u": "\u1702",
};

const ROWS = [
  { label: "a", suffix: "", note: "base glyph, no mark" },
  { label: "e / i", suffix: KUDLIT_I, note: "kudlit above" },
  { label: "o / u", suffix: KUDLIT_U, note: "kudlit below" },
  { label: "consonant only", suffix: VIRAMA, note: "virama (vowel killed)" },
];

export default function ReferenceChart() {
  return (
    <div className="reference-chart">
      <p className="sidebar-note" style={{ marginBottom: 10 }}>
        Every consonant glyph carries an inherent "a" sound. A kudlit mark
        changes it to e/i or o/u; a virama strikes the vowel out entirely.
        The "vowel" column shows the standalone glyph used when a syllable
        has no consonant at all.
      </p>
      <div className="reference-table-wrap">
        <table className="reference-table">
          <thead>
            <tr>
              <th></th>
              <th>vowel</th>
              {CONSONANTS.map((c) => (
                <th key={c.letter}>{c.letter}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th className="row-label" title={row.note}>
                  {row.label}
                </th>
                <td className="reference-glyph">
                  {STANDALONE_VOWEL_BY_ROW[row.label] || "—"}
                </td>
                {CONSONANTS.map((c) => (
                  <td key={c.letter} className="reference-glyph">
                    {c.glyph + row.suffix}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
