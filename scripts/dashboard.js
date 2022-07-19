// import { appId, serverUrl } from "../.secret";
import { getAllOwners } from "../scripts/ratelimit";
const serverUrl = "https://zjaux8t7jfje.usemoralis.com:2053/server";
const appId = "dsGPCxn9M5fRH1VVOysTr2Z5dtdLwxq4XOmMbkZH";
const contractAddress = "0x7AEdebd30538116668e006a9572386F288647cCC";
const chain = "rinkeby";

async function loginMetamask() {
  console.log("In Dashboard");
  // Rinkeby testnet server on Moralis
  Moralis.start({ serverUrl, appId });

  let currentUser = Moralis.User.current();
  let currentAddress = currentUser.get("ethAddress");
  console.log("CurrentEth Address", currentAddress);

  if (!currentUser) {
    currentUser = await Moralis.Web3.authenticate();
  }

  const options = {
    address: contractAddress,
    chain: chain,
  };
  let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
  console.log("nfts", NFTs);

  let owners = await getAllOwners();
  console.log("Got token owners", owners);
  console.log("Current user", currentUser);
  

  let nftMetadata = await fetchNftMetadata(
    await NFTs.result,
    await owners,
    currentAddress
  );
  console.log("nfts metadata", nftMetadata);
  renderInventory(await NFTs);
}

document.addEventListener("DOMContentLoaded", () => loginMetamask());

//Get metadata for one token. Ex: USDT token on ETH
function fetchNftMetadata(nfts, owners, userAddress) {
  let promises = [];
  for (let i = 0; i < nfts.length; i++) {
    let nft = nfts[i];
    let nftId = nft.token_id;
    let owner = owners[i];
    // Call moralis cloud function
    promises.push(
      fetch(getcloudFunctionUrl(nftId))
        .then((res) => res.json())
        .then((res) => JSON.parse(res.result))
        .then((res) => (nft.metadata = res))
        .then((res) => {
          nft.owners = [];

          if (owner.token_id === nft.token_id) {
            nft.owners.push(owner.owner_of);
            console.log("Owner", owners[i]);
            console.log("NFTI", nft);
          }
          return res
        })
    );
  }
  return Promise.all(promises);
}

const getcloudFunctionUrl = (nftId) =>
  `${serverUrl}/functions/getNFT?_ApplicationId=${appId}&nftId=${nftId}`;


async function renderInventory(nfts) {
  const parent = document.getElementById("app");
  console.log('wwwwwwwwwwwwwwwwwwww',nfts)
  for (let i = 0; i < nfts.total; i++) {
    const nft = await nfts.result[i];
    console.log('QQQQQQQQQQQQQQQQQQQQQQQ',nft.metadata.attributes)
    
    let attr = nft.metadata.attributes
    console.log('aaaaaaaaaaaaaaaaaaaa',attr)
    let parsedAttr = Array.from(attr).join('').split(',')
    console.log('bbbbbbbbbbbbbbbbbb',parsedAttr)
    parsedAttr = [parsedAttr[0].replace('[', ''),...parsedAttr]
    parsedAttr1 = [parsedAttr[parsedAttr.length -1].replace(']', '')]
    parsedAttr.pop()
    parsedAttr.push(parsedAttr1[0])
    parsedAttr2 = parsedAttr.forEach(el => el.replace('"',''))
    // parsedAttr = parsedAttr[4]
    console.log('bbbbbbbbbbbbbbbbbboooooooooooo',parsedAttr)
    let left = parsedAttr.splice(1,1)
    console.log('bbbbbbbbbbbbbbbbbboooooooooooo',parsedAttr)
    console.log('bbbbbbbbbbbbbbbbbb------------',parsedAttr2)
    
    let obj = {...[parsedAttr]}
    console.log('bbbbbbbbbbbbbbbbbb------------',obj)


    let htmlString = `
    <div class="card">
      <img src="${nft.metadata.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${nft.metadata.name}</h5>
        <p class="card-text">${nft.metadata.description}</p>
        <p class="card-text">Token ID: ${nft.token_id}</p>
        <p class="card-text">Tokensupply: ${nft.amount}</p>
        <p class="card-text">Owned by you: ${nft.owners[0]?"Yes":"No"}</p>
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
