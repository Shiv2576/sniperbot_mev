import Web3 from "web3";
import dotenv from "dotenv";
import { AbiItem } from "web3";
import ContractAbi from "./abi/contractABI.json";

dotenv.config();

const web3 =  new Web3('https://eth-sepolia.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY);

const contractABI: AbiItem[] = ContractAbi as AbiItem[];
const contractAddress = process.env.CONTRACT_ADDRESS;


const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getpendingTransactions(): Promise<void> {
    try {
        const block = await web3.eth.getBlock("pending", true);
        if (block && block.transactions) {
            console.log('Pending Transactions:', block.transactions);


            for (const tx of block.transactions) {
                console.log('Processing Transaction:', tx.hash );

                const result = await contract.me
            }

        }
    }


}
