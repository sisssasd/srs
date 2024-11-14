// src/App.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import GameHistory from "./GameHistory";
import "./App.css";

const CONTRACT_ADDRESS = '0x3b90B6030033F03Cc4cAebb8D3263c262318307D';
const ABI = [
    [
        {
            "inputs": [
                {
                    "internalType": "enum RockPaperScissors.Move",
                    "name": "_move",
                    "type": "uint8"
                }
            ],
            "name": "play",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getHistory",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "player",
                            "type": "address"
                        },
                        {
                            "internalType": "enum RockPaperScissors.Move",
                            "name": "move",
                            "type": "uint8"
                        }
                    ],
                    "internalType": "struct RockPaperScissors.Game[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "history",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "player",
                    "type": "address"
                },
                {
                    "internalType": "enum RockPaperScissors.Move",
                    "name": "move",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];
function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [choice, setChoice] = useState("");
    const [history, setHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function connectWallet() {
            if (window.ethereum) {
                try {
                    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                    await window.ethereum.request({ method: "eth_requestAccounts" });
                    const newSigner = newProvider.getSigner();
                    setProvider(newProvider);
                    setSigner(newSigner);
                    setIsConnected(true);

                    const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);
                    setContract(newContract);
                    console.log("Контракт успешно подключен");
                } catch (error) {
                    console.error("Ошибка подключения MetaMask:", error);
                }
            } else {
                alert("MetaMask не найден. Установите MetaMask и попробуйте снова.");
            }
        }
        connectWallet();
    }, []);

    const play = async () => {
        if (!choice) {
            alert("Выберите камень, ножницы или бумагу!");
            return;
        }
        if (!contract) {
            alert("Контракт не подключен.");
            return;
        }

        try {
            console.log(`Отправка хода: ${choice}`);
            // Предполагаем, что контракт сам генерирует ход компьютера
            const tx = await contract.play(choice);
            const receipt = await tx.wait();
            console.log("Транзакция подтверждена:", receipt);

            // Получаем результат из события
            const resultEvent = receipt.events.find(event => event.event === 'GameResult');
            if (resultEvent) {
                const { playerMove, computerMove, result } = resultEvent.args;
                alert(`Ваш выбор: ${playerMove}\nВыбор компьютера: ${computerMove}\nРезультат: ${result}`);
            } else {
                console.log("Событие GameResult не найдено");
            }

            fetchHistory(); // обновляем историю игр
        } catch (error) {
            console.error("Ошибка при отправке хода:", error);
            alert("Произошла ошибка при игре. Проверьте контракт и подключение.");
        }
    };

    const fetchHistory = async () => {
        if (!contract) {
            console.error("Контракт не инициализирован");
            return;
        }

        try {
            const games = await contract.getHistory();
            setHistory(games);
            console.log("История игр загружена");
        } catch (error) {
            console.error("Ошибка получения истории:", error);
        }
    };

    return (
        <div className="App">
            <h1>Камень-ножницы-бумага</h1>
            <p>Подключен: {isConnected ? "Да" : "Нет"}</p>
            <div className="choices">
                <button onClick={() => setChoice("rock")}>Камень</button>
                <button onClick={() => setChoice("paper")}>Бумага</button>
                <button onClick={() => setChoice("scissors")}>Ножницы</button>
            </div>
            <p>Ваш выбор: {choice}</p>
            <button onClick={play}>Играть</button>
            <h2>История игр</h2>
            <GameHistory history={history} />
        </div>
    );
}

export default App;
