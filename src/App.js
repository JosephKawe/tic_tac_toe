import { useState } from 'react';
import "./App.css"

import xImage from './assets/x.png';
import ellipseImage from './assets/ellipse.png';
import Logo from './assets/logo.png';
import Happy_Anya from './assets/happy_anya.gif';
import Confused_Anya from './assets/confused_anya.gif';

function Square({ value, onSquareClick }) {
  return (
    <button className="buttonSquare" onClick={onSquareClick}>
      <img className="buttonImageSquare" src={value} alt={value} />
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? xImage : ellipseImage;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const status = winner ? `Vencedor: ${winner}` : `Próximo jogador: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div key={row} className="rowContainer">
          {[0, 1, 2].map((col) => (
            <Square
              key={col}
              value={squares[row * 3 + col]}
              onSquareClick={() => handleClick(row * 3 + col)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.slice(1).map((_, move) => (
    <li key={move} className="infoItem">
      <p>Está no movimento {move + 1}</p>
    </li>
  ));

  const winner = calculateWinner(currentSquares);

  const Render = ({winner}) => {
    return(
      <>
        <div style={{ display: winner ? 'flex' : 'none', zIndex: winner ? 2 : 0 }} className='showWinner'>
          <p>{winner === 'Empate' ? 'Empate!' : winner ? `${winner} Venceu!` : ''}</p>
          <img src={winner === 'Empate' ? Confused_Anya : Happy_Anya}/>
          <button onClick={() => {window.location.reload()}}>jogar novamente</button>
        </div>
      </>
    )
  }

  return (
    <body>
      <header>
        <img style={{ width: 80 }} src={Logo} alt="Logo" />
      </header>
      <Render winner={winner} />
      <div className={`game ${winner ? 'blur' : ''}`}>
        <div className="gameBoard">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="gameInfo">
          <ul>{moves}</ul>
        </div>
      </div>
      <footer>
        <p>© 2023 - Kohako. Todos os direitos reservados</p>
      </footer>
    </body>
  );
}

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

  let isBoardFull = squares.every((square) => square);
  if (isBoardFull) {
    return 'Empate';
  }

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a] === xImage ? 'X' : 'O'; // Correção para retornar 'X' ou 'O'
    }
  }
  return null;
}