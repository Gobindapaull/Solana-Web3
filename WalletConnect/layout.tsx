import React from "react";
import AppWalletProvider from "./components/AppWalletProvider";

const rootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html>
      <body>
            <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
};

export default rootLayout;
