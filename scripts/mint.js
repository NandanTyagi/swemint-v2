import shortenAddress from "../utility/shortenAddress";
import access from "../utility/access";
let web3;

  // Moralis
  // const serverUrl = "https://fgobknghleyp.usemoralis.com:2053/server";
  // const appId = "b6IxjhUZhcj7B3Y1TxRcyKGVPqICIlr4rDVVlTZ4";
  const serverUrl = "https://zjaux8t7jfje.usemoralis.com:2053/server";
  const appId = "dsGPCxn9M5fRH1VVOysTr2Z5dtdLwxq4XOmMbkZH";
  const contractAddress = "0x15e86f1898d843c339a99e88673cbb3310f992f2";
  const chain = "rinkeby";

  Moralis.start({ serverUrl, appId });

  let user = Moralis.User.current();

  // Authorize
  if (!access(user.get("ethAddress"))) {
    window.location.pathname = "/index.html";
  }
const init = async () => {

  const countdown = document.getElementById("countdown");
  if (!countdown) return;
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const loading = document.getElementById("loading");
  const btn = document.getElementById("btn");
  const err = document.getElementById("error");
  const msg = document.getElementById("msg");

  const mintBtnArticle = document.getElementById("mint-btn-article");
  const mintBtn = document.getElementById("mint-btn");
  const connectBtnArticle = document.getElementById("connect-btn-article");

  /********** Moralis mint vid ********************/
  const tokenIdInput = document.getElementById("token-id-input");
  const amountInput = document.getElementById("amount-input");
  const addressInput = document.getElementById("address-input");
  /********** Moralis mint vid ********************/

  const currentYear = new Date().getFullYear();

  const mintDeadLine = new Date(`August 20 ${currentYear} 18:00:00`);

  // Update time countdown
  function updateCountdown() {
    const currentTime = new Date();
    const diff = mintDeadLine - currentTime;
    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const s = Math.floor(diff / 1000) % 60;

    // Add values to DOM
    days.innerHTML = d + ":";
    hours.innerHTML = h < 10 ? "0" + h + ":" : h + ":";
    minutes.innerHTML = m < 10 ? "0" + m + ":" : m + ":";
    seconds.innerHTML = s < 10 ? "0" + s : s;
  }

  //Show spinner before countdown
  setTimeout(() => {
    loading.remove();
  }, 1000);

  // Run every second
  setInterval(updateCountdown, 1000);

  /********* Moralis mint vid **********/
  // if(!user) {
  //   window.location.pathname = "/index.html"
  // }
  const urlParams = new URLSearchParams(window.location.search);
  const nftId = urlParams.get("nftId");
  console.log(nftId);
  tokenIdInput.value = nftId;

  web3 = await Moralis.enableWeb3();
  let accounts = await web3.eth.getAccounts();
  console.log("account", accounts);
  addressInput.value = accounts[0];

  /********* Moralis mint vid **********/

  if (user) {
    console.log("logged in user: ", user);
    // btn.innerText = "Disconnect wallet";
    toggleMintBtn();
  }

  async function loginMetamask() {
    // console.log("logged in user:", user);
    toggleMintBtn();
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Log in to Mint NFT",
      })
        .then(function (user) {
          // console.log("logged in user:", user);
          // console.log(user.get("ethAddress"));
          let address = user.get("ethAddress");
          msg.innerHTML = shortenAddress(address);
          msg.style.visibility = "visible";
          btn.innerText = "Disconnect wallet";
          removeConnectBtn();
        })
        .catch(function (error) {
          // console.log(error);
          removeMintBtn(error);
          err.style.visibility = "visible";
          err.innerHTML = error.message;
          setTimeout(() => {
            err.style.visibility = "hidden";
          }, 10000);
        });
    }
  }

  function connectionCheck() {
    if (user !== null && user !== undefined) {
      msg.innerText = shortenAddress(user.get("ethAddress"));
      msg.style.visibility = "visible";
      toggleMintBtn();
    } else {
      toggleMintBtn();
      loginMetamask();
    }
  }

  btn.addEventListener("pointerup", () => connectionCheck());

  /********************** MINT ****************************/
  function toggleMintBtn(address) {
    // console.log("in mint Toogle", address);
    if (user) {
      removeConnectBtn(address);
    } else {
      removeMintBtn(address);
    }
  }

  function removeMintBtn(address) {
    //   console.log("in mint remove Mint btn", address);
    mintBtnArticle.classList.add("hide");
    connectBtnArticle.classList.remove("hide");
  }

  function removeConnectBtn(address) {
    // console.log("in mint remove Connect btn", address);
    mintBtnArticle.classList.remove("hide");
    connectBtnArticle.classList.add("hide");
  }

  async function mint(address) {
    /*****************Moralis mint vid *****************/
    let inputTokenId = parseInt(tokenIdInput.value);
    let inputAddress = addressInput.value;
    let inputAmount = parseInt(tokenIdInput.value);

    /*****************Moralis mint vid *****************/
    const whiteList = [];
    let isWhitelisted = false;
    whiteList.push("0xf3772dD9B10D46dE9Cd7d5aAbf64712477987418");
    whiteList.push("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    whiteList.push("0x830AcAD3D82f41435918767fa7995A8c5b6523aD");
    whiteList.map((wlAddress, i) => {
      if (wlAddress.toUpperCase() === address.toUpperCase()) {
        isWhitelisted = true;
      }
      return isWhitelisted;
    });
    if (isWhitelisted) {
      console.log("Welcome you are whitelisted");
      alert("Welcome you are whitelisted");
      /*****************Moralis mint vid *****************/
      const contract = new web3.eth.Contract(contractAbi, contractAddress);
      contract.methods
        .mint(inputAddress, inputTokenId, inputAmount)
        .send({ from: accounts[0], value: 0 })
        .on("receipt", (receipt) => alert("Mint complete"));
      /*****************Moralis mint vid *****************/
    } else {
      console.log("Sorry you are not elegible for the mint");
      alert("Sorry you are not elegible for the mint");
    }
  }

  connectionCheck();
  mintBtn.addEventListener("pointerup", () =>
    mint(window.ethereum.selectedAddress)
  );
  /********************** MINT ****************************/
};

document.addEventListener("DOMContentLoaded", () => init());
