import React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";

function Game({ players, room, orientation, cleanup }) {
    const [over, setOver] = useState("");
    let chess = useMemo(() => new Chess(), [over]);
    const [fen, setFen] = useState(chess.fen());

    const makeAMove = useCallback((move) => {
        try {
            const result = chess.move(move);
            setFen(chess.fen());
            
            console.log("over: ", chess.isGameOver(), "checkmate: ", chess.isCheckmate());

            if(chess.isGameOver()) {
                if(chess.isCheckmate()) {
                    setOver(`Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`);
                } else if(chess.isDraw()) {
                    setOver("Draw");
                } else {
                    setOver("Game over");
                }
            }

            return result;
            
        } catch (e) {
            return null
        }
    }, [chess])

    function onDrop(initialSquare, finalSquare) {
        const moveData = {
            from: initialSquare,
            to: finalSquare,
            color: chess.turn(),
            promotion: 'q'
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        return true;
    }

    return (
        <div className="flex-center board-container">
            <div className="board">
                <DndProvider
                    backend={TouchBackend}
                    options={{ enableMouseEvents: true }}
                >
                    <Chessboard
                        position={fen}
                        onPieceDrop={onDrop}
                    />
                </DndProvider>
                <CustomDialog
                    open={Boolean(over)}
                    title={over}
                    contentText={over}
                    handleContinue={() => setOver("")}
                />
            </div>
        </div>
    );
}

export default Game;
