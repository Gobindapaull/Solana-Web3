    const requiredBalance = await connection.getMinimumBalanceForRentExemption(0);
    console.log(`Required rent exemption balance: ${requiredBalance / LAMPORTS_PER_SOL} lamports`);
