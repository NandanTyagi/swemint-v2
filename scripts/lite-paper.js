import access from "../utility/access";

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