export async function getAllOwners(token_id) {
  const serverUrl = "https://zjaux8t7jfje.usemoralis.com:2053/server";
  const appId = "dsGPCxn9M5fRH1VVOysTr2Z5dtdLwxq4XOmMbkZH";
  const contractAddress = "0x15e86f1898d843c339a99e88673cbb3310f992f2";
  const chain = "rinkeby";
  await Moralis.start({ serverUrl, appId });
  let cursor = null;
  let owners = {};
  do {
    const response = await Moralis.Web3API.token.getNFTOwners({
      address: contractAddress,
      chain: chain,
      limit: 25,
      cursor: cursor,
    });
    // console.log(
    //   `Response:`,
    //   response
    // );
    cursor = response.cursor;

    return response.result;
  } while (cursor != "" && cursor != null);
}

export default getAllOwners;

// async function getAllOwners() {
//   await Moralis.start({serverUrl, appId });
//   let cursor = null;
//   let owners = {};
//   do {
//     const response = await Moralis.Web3API.token.getNFTOwners({
//       address: contractAddress,
//       chain: chain,
//       limit: 90,
//       cursor: cursor,
//     });
//     console.log(

//       `Got page ${response.page} of ${Math.ceil(
//         response.total / response.page_size
//       )}, ${response.total} total. Response:`, response
//     );
//     for (const owner of response.result) {
//       owners[owner.owner_of] = {
//         amount: owner.amount,
//         owner: owner.owner_of,
//         tokenId: owner.token_id,
//         tokenAddress: owner.token_address,
//       };
//     }
//     cursor = response.cursor;
//   } while (cursor != "" && cursor != null);

//   console.log("owners:", owners, "total owners:", Object.keys(owners).length);
// }

// getAllOwners();
