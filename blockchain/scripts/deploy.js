
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying contract with the account: ${deployer.address}`);

    const CarbonCreditToken = await hre.ethers.getContractFactory("CarbonCreditToken");
    const cct = await CarbonCreditToken.deploy();  
    await cct.waitForDeployment(); // ✅ Use waitForDeployment() instead of deployed()

    console.log(`CCT deployed at: ${await cct.getAddress()}`); // ✅ Use getAddress() instead of .target
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

