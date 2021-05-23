import {React, useState} from 'react';
import ReactDOM from 'react-dom';
import { unstable_concurrentAct } from 'react-dom/test-utils';
import './index.css';

function Square({onClick, value}) {
  return (
    <button
      className="square"
      onClick={onClick}>
        {value}
    </button>
  );
}

function Board({squares, handleClick}) {
  // It might be a good idea to destructure props or define at the beginning;
  // Is there a nicer way to make it clear what props Board takes?

  const renderSquare = (i) => {
    return (
      <Square
        value={squares[i]}
        onClick={() => handleClick(i)}
      />
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game(_) {

  const [state, setState] = useState({
    history: [
      {squares: Array(9).fill(null)}
    ],
    stepNumber: 0,
    xIsNext: true
  })

  const handleClick = (i) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    // Ignore click if the square is filled or the game is over
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = state.xIsNext ? 'X' : 'O';
    setState({
      history: history.concat([{squares:squares}]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  }

  const jumpTo = (step) => {
    setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  const history = state.history;
  const current = history[state.stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = history.map((_, move) => {
    const desc = move ?
      `Go to move # ${move}` :
      `Go to game start`;

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${state.xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          handleClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
