import React, {useState, useEffect, useCallback} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const Square = React.forwardRef(({label}, ref) => (
  <input placeholder={label} ref={ref} />
));

function Game(_) {

  const [state, setState] = useState({
    current_square: 5
  });

  const squares = []
  const refs = []
  for(let i = 0; i < 10; i++) {
    const ref = React.createRef();
    refs.push(ref);
    squares.push(<Square label={i} ref={ref} key={i} />);
  }

  const changeSquare = useCallback(
    (direction) => {
      const new_square = state.current_square+direction;
      refs[new_square].current.focus();

      setState({...state, current_square: new_square});
    },
    [state, refs]
  );

  const onKeyDown = useCallback(
    ({key}) => {
      if (key === 'ArrowRight') {
        changeSquare(1);
      }
      else if (key === 'ArrowLeft') {
        changeSquare(-1);
      }
    },
    [changeSquare]
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
      <button onClick={() => changeSquare(-1)}>&lt;</button>
      <button onClick={() => changeSquare(1)}>&gt;</button>
    </div>
  );
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);



