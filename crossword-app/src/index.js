import React, {useState, useEffect, useCallback} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = React.forwardRef(({label, onClick}, ref) => (
  <input onClick={onClick} placeholder={label} ref={ref} />
));

function rollover(n, low, high) {
  return n > high ? low :
         n < low ? high :
         n;
}

function clamp(n, low, high) {
  return Math.min(Math.max(n, low), high);
}

function Game(_) {

  const row_count = 5;
  const column_count = 5;

  const [state, setState] = useState({
    current_square: {row: 0, col: 0},
  });

  const squares = [];
  const refs = []; // TODO: useMemo
  for(let row = 0; row < row_count; row++) {
    const square_row = [];
    const ref_row = [];
    refs.push(ref_row);

    for(let col = 0; col < column_count; col++){
      const ref = React.createRef();
      ref_row.push(ref);
      square_row.push(<Square onClick={() => changeSquare(row, col)}label={`${row} ${col}`} ref={ref} key={`${row} ${col}`} />);
    }

    squares.push(<div id={`row-${row}`}>{square_row}</div>);
  }

  const changeSquare = useCallback(
    (row, col) => {
      // I think clamp is nicer than rollover in this case. If you're spamming right, you probably
      // aren't doing it to get to the next column.
      // row = rollover(row, 0, row_count-1);
      // col = rollover(col, 0, column_count-1);
      row = clamp(row, 0, row_count-1);
      col = clamp(col, 0, column_count-1);

      refs[row][col].current.focus();

      setState({...state, current_square: {row: row, col: col}});
    },
    [state, refs]
  );

  const onKeyDown = useCallback(
    ({key}) => {
      if (key === 'ArrowRight') {
        changeSquare(state.current_square.row, state.current_square.col+1);
      }
      else if (key === 'ArrowLeft') {
        changeSquare(state.current_square.row, state.current_square.col-1);
      }
      else if (key === 'ArrowUp') {
        changeSquare(state.current_square.row-1, state.current_square.col);
      }
      else if (key === 'ArrowDown') {
        changeSquare(state.current_square.row+1, state.current_square.col);
      }
    },
    [state, changeSquare]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
        document.removeEventListener('keydown', onKeyDown);
    }
  }, [onKeyDown]);

  // onKeyDown={onKeyDown} was here
  return (
    <div className="crossword">
      {squares}
    </div>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



