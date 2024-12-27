import { clusterApiUrl, Connection, VersionedBlockResponse, GetVersionedBlockConfig } from "@solana/web3.js";
import chalk from "chalk";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const main = async () => {
    try {
        // slot
        const slot = await connection.getSlot();
        const x = chalk.blue(slot);
        console.log(`slot : ${x}`);

        // block time
        const blockTime = await connection.getBlockTime(slot);
        const y = chalk.yellow(blockTime);
        console.log(`block time : ${y}`);

        // block
        const block: VersionedBlockResponse | null = await connection.getBlock(slot, {
            maxSupportedTransactionVersion: 0
        });

        // console.log(`block : ${block}`);
        console.dir(block, { depth: null });

        // slot leader
        const slotLeader = await connection.getSlotLeader();
        const p = chalk.green(slotLeader);
        console.log(`slot leader : ${p}`);
    } catch (error) {
        console.log(error);
    }
}

main();
