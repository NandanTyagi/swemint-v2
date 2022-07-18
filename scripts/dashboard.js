// import { appId, serverUrl } from "../.secret";
const serverUrl = "https://zjaux8t7jfje.usemoralis.com:2053/server";
const appId = "dsGPCxn9M5fRH1VVOysTr2Z5dtdLwxq4XOmMbkZH";
const contractAddress = "0x5ef7359319a186004277c613147ecfcda4ed8c90";
const chain = "rinkeby";

async function loginMetamask() {
  console.log("In Dashboard");
  // Rinkeby testnet server on Moralis
  Moralis.start({ serverUrl, appId });

  let currentUser = Moralis.User.current();

  if (!currentUser) {
    currentUser = await Moralis.Web3.authenticate();
  }

  const options = {
    address: contractAddress,
    chain: chain,
  };
  let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
  console.log("nfts", NFTs);
  let nftWithMetadata = await fetchNftMetadata(await NFTs.result);
  console.log("nfts metadata", nftWithMetadata);
  renderInventory(nftWithMetadata);
}

document.addEventListener("DOMContentLoaded", () => loginMetamask());

//Get metadata for one token. Ex: USDT token on ETH
function fetchNftMetadata(nfts) {
  let promises = [];
  for (let i = 0; i < nfts.length; i++) {
    let nft = nfts[i];
    let nftId = nft.token_id;
    // Call moralis cloud function
    promises.push(
      fetch(
        `${serverUrl}/functions/getNFT?_ApplicationId=${appId}&nftId=${nftId}`
      )
        .then((res) => res.json())
        .then((res) => JSON.parse(res.result))
        .then((res) => (nft.metadata = res))
        .then(() => {
          const options = { address: contractAddress, token_id: nftId, chain: chain}
          return Moralis.Web3API.token.getTokenIdOwners(options);
        })
        .then((res) => {
          // nft.owners = [];*********************************************
          
        })
    );
  }
  return Promise.all(promises);
}

function renderInventory(nfts) {
  const parent = document.getElementById("app");
  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    let htmlString = `
    <div class="card">
      <img src="${nft.metadata.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${nft.metadata.name}</h5>
        <p class="card-text">${nft.metadata.description}</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
    `;
    let col = document.createElement("div");
    col.classname = "col col-md-4";
    col.innerHTML = htmlString;
    parent.appendChild(col);
  }
}
