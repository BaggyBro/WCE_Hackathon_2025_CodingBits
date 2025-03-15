
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying contract with the account: ${deployer.address}`);

    const CarbonCreditToken = await hre.ethers.getContractFactory("CarbonCreditToken");
    const cct = await CarbonCreditToken.deploy();  
    await cct.waitForDeployment(); 

    console.log(`CCT deployed at: ${await cct.getAddress()}`); 
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

