import { SystemProgram } from '@solana/web3.js';

const SYSTEM_PROGRAM_ID = SystemProgram.programId;
console.log(SYSTEM_PROGRAM_ID.toBase58())
