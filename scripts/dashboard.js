// import { appId, serverUrl } from "../.secret";
import { getAllOwners } from "../scripts/ratelimit";
import shortenAddress from "../utility/shortenAddress";
import access from "../utility/access";

const initDashboard = async () => {
  // Rinkeby testnet server on Moralis
  const serverUrl = "https://zjaux8t7jfje.usemoralis.com:2053/server";
  const appId = "dsGPCxn9M5fRH1VVOysTr2Z5dtdLwxq4XOmMbkZH";
  const contractAddress = "0x15e86f1898d843c339a99e88673cbb3310f992f2";
  const chain = "rinkeby";

  const msg = document.getElementById("msg");

  async function getNFTs() {
    // console.log("In Dashboard");
    Moralis.start({ serverUrl, appId });

    let currentUser = Moralis.User.current();

    let currentAddress = currentUser.get("ethAddress");
    console.log("CurrentEth Address", currentAddress);
    // Authorize
    if (!access(currentAddress)) {
      window.location.pathname = "/index.html";
    }
    showConnectedWallet(currentUser);

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

    let nftsWithOwners = await addOwnersToNft(await owners, await NFTs);

    let nftMetadata = await fetchNftMetadata(await NFTs.result);
    // console.log("nfts metadata", nftMetadata);
    renderInventory(await NFTs, currentAddress);
  }

  function fetchNftMetadata(nfts) {
    let promises = [];
    for (let i = 0; i < nfts.length; i++) {
      let nft = nfts[i];
      let nftId = nft.token_id;
      // Call moralis cloud function
      promises.push(
        fetch(getcloudFunctionUrl(nftId))
          .then((res) => res.json())
          .then((res) => JSON.parse(res.result))
          .then((res) => (nft.metadata = res))
          .then((res) => {
            return res;
          })
      );
    }
    return Promise.all(promises);
  }

  const getcloudFunctionUrl = (nftId) =>
    `${serverUrl}/functions/getNFT?_ApplicationId=${appId}&nftId=${nftId}`;

  async function addOwnersToNft(owners, nfts) {
    let nftArr = nfts.result;
    nftArr.forEach((nft, i) => {
      nft.owners = [];
      // console.log("NFT", nft, i);
      owners.forEach((owner, j) => {
        let _owner = {};
        if (nft.token_id === owner.token_id) {
          // console.log("Owner", owner);
          _owner.address = owner.owner_of;
          _owner.token_amount = owner.amount;
          nft.owners.push(_owner);
        }
      });
    });
    // console.log("NFT Arr", nftArr);
    return nftArr;
  }

  async function renderInventory(nfts, curAddr) {
    const parent = document.getElementById("app");
    console.log("Rendered nfts", nfts);
    for (let i = 0; i < nfts.total; i++) {
      const nft = await nfts.result[i];
      console.log("Metadata attributes", nft.metadata.attributes);
      console.log("Rendered nft", nft);

      let htmlString = `
      <div class="card">
        <div class="card-image__overlay"></div>
        <img src="${nft.metadata.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <div class="card-body__overlay"></div>
          <h5 class="card-title">${nft.metadata.name}</h5>
          <p class="card-text">${nft.metadata.description}</p>
          <p class="card-text">Token ID: ${nft.token_id}</p>
          <p class="card-text">Tokensupply: ${nft.amount}</p>
          <p class="card-text">Holders: ${await nft.owners.length}</p>
          <p class="card-text">Held by you: ${await getOwnedAmount(
            nft,
            curAddr
          )}</p>
          <a href="https://testnets.opensea.io/assets/rinkeby/${contractAddress}/${
        nft.token_id
      }" class="btn btn-primary">View on Opensea</a>
          <a href="../html/mint.html/?nftId=${
            nft.token_id
          }" class="btn btn-primary">Mint</a>
          </div>
          </div>
          `;
      let col = document.createElement("article");
      col.className = "col col-md-4";
      col.innerHTML = htmlString;
      parent.appendChild(col);
    }
  }

  async function getOwnedAmount(nft, curAddr) {
    let owners = nft.owners;
    let amount = "0";
    console.log("owners of nft", owners[0]);
    owners.forEach((owner, i) => {
      let address = owners[i].address;
      if (address === curAddr) {
        amount = owner.token_amount;
      }
    });
    return amount;
  }
  function showConnectedWallet(_user) {
    if (_user !== null || _user !== undefined) {
      msg.innerText = shortenAddress(_user.get("ethAddress"));
      msg.style.visibility = "visible";
    }
  }

  getNFTs();
};
document.addEventListener("DOMContentLoaded", () => initDashboard());
