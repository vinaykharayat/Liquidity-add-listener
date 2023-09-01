require('dotenv').config();
const ethers = require("ethers");
const timestamp = require('unix-timestamp');
timestamp.round = true;
const pairAbi = require("./artifacts/pairAbi.json");
const routerAbi = require("./artifacts/router.json");
const myTokenAbi = require("./artifacts/myToken.json");

const pairAddress = "0xd0b966d297Be4647f8fA84fA7BCa6efcBd665190";
const myTokenAddress = "0x289541f355Eb0775f6301145e45743289bf06b4F";
const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const buyerAddress = "0x31b2eeC73618445625D0Cc8e94Fd50Cda1F3E8B4";
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);

// for example if top-level await is not an option
const myToken = new ethers.Contract(myTokenAddress, myTokenAbi, provider);
const pair = new ethers.Contract(pairAddress, pairAbi, provider);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const uniswapRouter = new ethers.Contract(uniswapRouterAddress, routerAbi, signer);

const listen = async () => {
    console.log("Listener added");
    await pair.on("Mint", async (sender, amount0, amount1) => {
        console.log("Mint", "|", "Address", sender, "|", "Amount", amount0);
        console.log("First buy");
        await swapTokens();
        console.log("Second buy");
        await swapTokens();
    });
}

const swapTokens = async () => {
    try {
        const options = {
            value: 100000000000,
            gasLimit: 1000000
        }
        const tx = await uniswapRouter.swapExactETHForTokens(
            0,
            [wethAddress, myTokenAddress],
            buyerAddress,
            timestamp.now("60s"),
            options
        );
        console.log("Tansaction:", tx);
    } catch(e) {
        console.log(e)
    }
}

// swapTokens()

listen();