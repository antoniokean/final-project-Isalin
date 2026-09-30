const TYPE_TAG = {
  coda: " (coda)",
  literal: "",
  vowel: "",
  syllable: "",
};

export default function BreakdownView({ breakdown }) {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="breakdown">
      <p className="breakdown-title">Syllable breakdown</p>
      {breakdown.map((word, idx) => (
        <div className="breakdown-word" key={idx}>
          <div className="breakdown-word-label">"{word.word}"</div>
          <div className="chip-row">
            {word.syllables.map((s, i) => (
              <span className="chip" key={i}>
                {s.text}
                {TYPE_TAG[s.type]}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
