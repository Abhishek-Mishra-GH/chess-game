import React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import copy from "copy-to-clipboard";
import socket from "./socket";

function Game({ players, room, orientation, cleanup }) {
  const [over, setOver] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  let chess = useMemo(() => new Chess(), [over]);
  const [fen, setFen] = useState(chess.fen());
  const [selectedSquare, setSelectedSquare] = useState(null);

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        setFen(chess.fen());

        console.log("over: ", chess.isGameOver(), "checkmate: ", chess.isCheckmate());

        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(`Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`);
          } else if (chess.isDraw()) {
            setOver("Draw");
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        return null;
      }
    },
    [chess]
  );

  function onDrop(initialSquare, finalSquare) {
    if (chess.turn() !== orientation[0]) return false;

    if (players.length < 2) {
      alert("Wait for opponent to join the game!");
      return false;
    }

    const moveData = {
      from: initialSquare,
      to: finalSquare,
      color: chess.turn(),
      promotion: "q",
    };

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    socket.emit("move", {
      move: moveData,
      room,
    });

    return true;
  }

  useEffect(() => {
    socket.on("move", (move) => {
      console.log(move);
      makeAMove(move);
    });
  }, [makeAMove, socket]);

  const handleSquareSelection = (square) => {

    if (selectedSquare) {
      onDrop(selectedSquare, square);
      const prevSelectedElement = document.querySelector(`[data-square=${selectedSquare}]`)
      prevSelectedElement.style.boxShadow = "";
      setSelectedSquare(null);
      return;
    }

    setSelectedSquare(square)
    const selectedElement = document.querySelector(`[data-square=${square}]`);
    selectedElement.style.boxShadow = "inset 2px 2px 5px black, inset -2px -2px 5px black";
  };

  return (
    <>
      <main className="main-container">
        <div
          className="t1 flex"
          style={{
            gap: "6px",
          }}
        >
          <h2 style={{ color: "darkblue" }}>Players: </h2>
          <h4 style={{ color: "darkgreen" }}> {players[0]?.username} </h4>
          <span style={{ color: "darkred" }}>vs. </span>
          <h4 style={{ color: "darkorange" }}> {players[1]?.username} </h4>
        </div>
        <div className="board">
          <DndProvider
            backend={TouchBackend}
            options={{ enableMouseEvents: true }}
          >
            <Chessboard
              position={fen}
              boardOrientation={orientation}
              onPieceDrop={onDrop}
              onSquareClick={handleSquareSelection}
            />
          </DndProvider>
          <CustomDialog
            open={Boolean(over)}
            title={over}
            contentText={over}
            handleContinue={() => setOver("")}
          />
        </div>
        <div className="t2 flex flex-col justify-center align-center">
          <div>
            <span
              style={{
                color: "blue",
              }}
            >
              RoomID :
            </span>
            {" " + room}
          </div>
          <button
            style={{
              padding: "5px 10px",
              fontSize: "16px",
            }}
            className="btn btn-outlined"
            onClick={() => {
              copy(room);
              setCopiedRoomId(true);
            }}
          >
            Copy Room ID
          </button>
          {copiedRoomId && (
            <span
              style={{
                color: "darkblue",
                fontSize: "11px",
              }}
            >
              copied!
            </span>
          )}
        </div>
      </main>
    </>
  );
}

export default Game;
