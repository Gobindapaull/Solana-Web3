"use client";

import dynamic from "next/dynamic";
import React from "react";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const Home = () => {
  return (
      <WalletMultiButtonDynamic />
  );
};

export default Home;
