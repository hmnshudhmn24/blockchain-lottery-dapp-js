const hre = require("hardhat");

async function main() {
    const Lottery = await hre.ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy(7 * 24 * 60 * 60); // 7 days duration

    await lottery.deployed();
    console.log("Lottery deployed to:", lottery.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
