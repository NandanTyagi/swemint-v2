async function loginMetamask() {
  console.log("In Dashboard");
  // Rinkeby testnet server on Moralis
  const serverUrl = "https://zjaux8t7jfje.usemoralis.com:2053/server";
  const appId = "dsGPCxn9M5fRH1VVOysTr2Z5dtdLwxq4XOmMbkZH";
  Moralis.start({serverUrl, appId});

  let currentUser = Moralis.User.current();

  if (!currentUser) {
    currentUser = await Moralis.Web3.authenticate();
  }

  const options = {
    address: "0x5ef7359319a186004277c613147ecfcda4ed8c90",
    chain: "rinkeby",
  };
  let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
  console.log("nfts", NFTs);
}

document.addEventListener("DOMContentLoaded", () => loginMetamask());
