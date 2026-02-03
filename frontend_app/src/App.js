import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

/**
 * Returns "X" or "O" if there is a winner, otherwise null.
 * @param {Array<("X"|"O"|null)>} squares
 * @returns {("X"|"O"|null)}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return v;
  }
  return null;
}

/**
 * Returns the winning line indices if a winner exists; otherwise null.
 * @param {Array<("X"|"O"|null)>} squares
 * @returns {number[] | null}
 */
function getWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return [a, b, c];
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[Array<("X"|"O"|null)>, Function]} */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const winningLine = useMemo(() => getWinningLine(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && squares.every((s) => s !== null),
    [winner, squares]
  );

  const currentPlayer = xIsNext ? PLAYER_X : PLAYER_O;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw game";
    return `Next player: ${currentPlayer}`;
  }, [winner, isDraw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Prevent moves after game end or overwriting occupied square */
    if (winner || squares[index]) return;

    const next = squares.slice();
    next[index] = currentPlayer;

    setSquares(next);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="ttt-shell">
        <header className="ttt-header">
          <div>
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">
              Local two-player game — take turns and get three in a row.
            </p>
          </div>

          <div className="ttt-badge" aria-label="Theme badge">
            Modern Light
          </div>
        </header>

        <section className="ttt-card" aria-label="Game board">
          <div className="ttt-status" role="status" aria-live="polite">
            <span className="ttt-status-label">{statusText}</span>
            {!winner && !isDraw && (
              <span className="ttt-turn-pill" aria-label="Current turn">
                {currentPlayer}
              </span>
            )}
          </div>

          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe grid">
            {squares.map((value, idx) => {
              const isWinning = winningLine ? winningLine.includes(idx) : false;
              const isDisabled = Boolean(winner || value);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-square",
                    value ? "is-filled" : "",
                    value === PLAYER_X ? "is-x" : "",
                    value === PLAYER_O ? "is-o" : "",
                    isWinning ? "is-winning" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `: ${value}` : ""}`}
                >
                  <span className="ttt-square-value" aria-hidden="true">
                    {value ?? ""}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-controls" aria-label="Game controls">
            <button
              type="button"
              className="ttt-btn ttt-btn-primary"
              onClick={handleRestart}
            >
              Restart
            </button>

            <div className="ttt-help" aria-label="Help text">
              Tip: You can’t place on an occupied square.
            </div>
          </div>
        </section>

        <footer className="ttt-footer">
          <span>
            Built with React •{" "}
            <span className="ttt-footer-muted">No backend required</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
