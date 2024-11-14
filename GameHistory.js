// src/GameHistory.js
import React from "react";

function GameHistory({ history }) {
    return (
        <div>
            {history.length === 0 ? (
                <p>История игр пуста</p>
            ) : (
                <ul>
                    {history.map((game, index) => (
                        <li key={index}>
                            Игра {index + 1}: Игрок выбрал {game.choice}, результат: {game.result}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GameHistory;
