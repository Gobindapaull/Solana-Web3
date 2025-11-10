require("dotenv").config();

const image = async () => {

  const uri = process.env.URL;

  // Fetch the off-chain JSON (hosted on Arweave/IPFS/Pinata)
  const response = await fetch(uri);
  const json = await response.json();

  console.log("🧠 Off-chain metadata loaded:");
  console.log("Name:", json.name);
  console.log("Symbol:", json.symbol);
  console.log("Image URL:", json.image);
  console.log("Description:", json.description);
};

image();
