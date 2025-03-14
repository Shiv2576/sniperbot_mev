import { expect } from "chai";
import { ethers } from "hardhat";
import { SniperBot, IUniswapV2Router, IERC20 } from "../typechain-types";
import { JsonRpcProvider,TransactionResponse } from "@ethersproject/providers";

describe("SniperBot - Sepolia Integration", function () {
  let sniperBot: SniperBot;
  let uniswapRouter: IUniswapV2Router;
  let token: IERC20;
  let owner: any;
  let provider: JsonRpcProvider;

  before(async function () {
    // Connect to Sepolia
    provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);

    // Get signers
    [owner] = await ethers.getSigners();

    // Deploy a mock Uniswap Router (or use the actual Sepolia Uniswap Router address)
    const UniswapRouterFactory = await ethers.getContractFactory("IUniswapV2Router");
    uniswapRouter = await UniswapRouterFactory.deploy();

    // Deploy a mock ERC-20 token
    const TokenFactory = await ethers.getContractFactory("IERC20");
    token = await TokenFactory.deploy("TestToken", "TTK");

    // Deploy the SniperBot contract
    const SniperBotFactory = await ethers.getContractFactory("SniperBot");
    sniperBot = await SniperBotFactory.deploy(uniswapRouter.address);
  });

  it("Should monitor Sepolia mempool and snipe tokens", async function () {
    // Watch the mempool for pending transactions
    provider.on("pending", async (txHash: string) => {
      const tx: TransactionResponse = await provider.getTransaction(txHash);

      // Check if the transaction is a Uniswap transaction
      if (tx && tx.to === uniswapRouter.address) {
        console.log("Detected Uniswap transaction:", txHash);

        // Define the swap parameters
        const amountOutMin = ethers.utils.parseEther("1"); // Minimum 1 token expected
        const path = [ethers.constants.AddressZero, token.address]; // ETH -> Token
        const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now

        // Execute the snipeToken function
        await sniperBot.connect(owner).snipeToken(amountOutMin, path, deadline, {
          value: ethers.utils.parseEther("1"), // Send 1 ETH
        });

        console.log("Sniped tokens successfully!");

        // Check if the contract received the tokens
        const contractTokenBalance = await token.balanceOf(sniperBot.address);
        expect(contractTokenBalance).to.be.gt(0);
      }
    });

    // Wait for a while to monitor the mempool
    await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds
  });
});