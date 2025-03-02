# Blockchain Lottery

A decentralized lottery system built on Ethereum using Solidity and React.

## Features
- Players enter the lottery by sending **0.1 ETH**.
- The contract picks a **random winner** and transfers the entire balance.
- The lottery **automatically resets** after a winner is chosen.
- Displays **last winner and winning amount**.
- Uses **Metamask** for transaction signing.

## Setup & Deployment

### Smart Contract Deployment
1. Install Hardhat and dependencies:
   ```bash
   npm install --save-dev hardhat
   ```
2. Deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js --network rinkeby
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the frontend:
   ```bash
   npm start
   ```
