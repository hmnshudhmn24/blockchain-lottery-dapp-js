import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import LotteryABI from "./Lottery.json";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

function App() {
    const [players, setPlayers] = useState([]);
    const [lotteryInfo, setLotteryInfo] = useState({ endTime: 0, playerCount: 0, lastWinner: "", lastWinningAmount: 0 });
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        async function loadBlockchainData() {
            if (window.ethereum) {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = web3Provider.getSigner();
                const lotteryContract = new ethers.Contract(CONTRACT_ADDRESS, LotteryABI.abi, signer);
                setProvider(web3Provider);
                setContract(lotteryContract);
                fetchLotteryData(lotteryContract);
            }
        }
        loadBlockchainData();
    }, []);

    async function fetchLotteryData(contract) {
        const players = await contract.getPlayers();
        const [endTime, playerCount, lastWinner, lastWinningAmount] = await contract.getLotteryInfo();
        setPlayers(players);
        setLotteryInfo({ endTime, playerCount, lastWinner, lastWinningAmount });
    }

    async function enterLottery() {
        if (!contract) return;
        const tx = await contract.enter({ value: ethers.utils.parseEther("0.1") });
        await tx.wait();
        fetchLotteryData(contract);
    }

    async function pickWinner() {
        if (!contract) return;
        const tx = await contract.pickWinner();
        await tx.wait();
        fetchLotteryData(contract);
    }

    return (
        <div className="container mx-auto p-5 text-center">
            <h1 className="text-2xl font-bold mb-4">Blockchain Lottery</h1>
            <p>Lottery ends at: {new Date(lotteryInfo.endTime * 1000).toLocaleString()}</p>
            <p>Players: {lotteryInfo.playerCount}</p>
            <p>Last Winner: {lotteryInfo.lastWinner || "N/A"}</p>
            <p>Winning Amount: {ethers.utils.formatEther(lotteryInfo.lastWinningAmount.toString())} ETH</p>
            <button onClick={enterLottery} className="bg-blue-500 text-white p-2 rounded mt-2">Enter Lottery (0.1 ETH)</button>
            <button onClick={pickWinner} className="bg-green-500 text-white p-2 rounded mt-2 ml-2">Pick Winner</button>
            <ul className="mt-4">
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
