// src/App.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import GameHistory from "./GameHistory";
import "./App.css";
// Укажите адрес вашего контракта и ABI
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

    useEffect(() => {
        async function connectWallet() {
            if (window.ethereum) {
                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const newSigner = newProvider.getSigner();
                setProvider(newProvider);
                setSigner(newSigner);

                const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);
                setContract(newContract);
            } else {
                alert("MetaMask не найден");
            }
        }
        connectWallet();
    }, []);

    const play = async () => {
        if (!choice) {
            alert("Выберите камень, ножницы или бумагу!");
            return;
        }

        try {
            const tx = await contract.play(choice);
            await tx.wait();
            alert("Ваш ход отправлен!");
            fetchHistory();
        } catch (error) {
            console.error("Ошибка в отправке хода:", error);
        }
    };

    const fetchHistory = async () => {
        try {
            const games = await contract.getHistory();
            setHistory(games);
        } catch (error) {
            console.error("Ошибка получения истории:", error);
        }
    };

    return (
        <div className="App">
            <h1>Камень-ножницы-бумага</h1>
            <div className="choices">
                <button onClick={() => setChoice("rock")}>Камень</button>
                <button onClick={() => setChoice("paper")}>Бумага</button>
                <button onClick={() => setChoice("scissors")}>Ножницы</button>
            </div>
            <button onClick={play}>Играть</button>
            <h2>История игр</h2>
            <GameHistory history={history} />
        </div>
    );
}

export default App;
