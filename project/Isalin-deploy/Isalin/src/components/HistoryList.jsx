import { useState } from "react";

export default function HistoryList({ history, onSelect, onClear }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? history : history.slice(0, 5);

  return (
    <div className="sidebar">
      <div className="sidebar-header-row">
        <h2 className="sidebar-title">Recent conversions</h2>
        {history.length > 0 && (
          <button className="clear-button" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <p className="sidebar-note">
        Saved to Postgres. Tap any
        entry to load it back into the converter.
      </p>

      {history.length === 0 ? (
        <div className="history-empty">
          No history yet — or the server is running without a database. Try
          converting something above.
        </div>
      ) : (
        <>
          <ul className="history-list">
            {visible.map((item) => {
              const isReverse = item.direction === "baybayin-to-latin";
              return (
                <li
                  className="history-item"
                  key={item.id}
                  onClick={() => onSelect(item)}
                >
                  <div className="history-item-top">
                    <span
                      className="history-input"
                      style={isReverse ? { fontFamily: "var(--font-baybayin)" } : {}}
                    >
                      {item.input_text}
                    </span>
                    <span
                      className="history-output"
                      style={isReverse ? { fontFamily: "var(--font-body)" } : {}}
                    >
                      {item.output_text}
                    </span>
                  </div>
                  <div className="history-direction">
                    {isReverse ? "Baybayin → Latin" : "Latin → Baybayin"}
                  </div>
                </li>
              );
            })}
          </ul>

          {history.length > 5 && (
            <button className="view-all-button" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Show less" : `View all (${history.length})`}
            </button>
          )}
        </>
      )}
    </div>
  );
}