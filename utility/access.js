export function access(address){
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
      alert("Welcome you are whitelisted")
      return true;
    } else {
      console.log("Sorry you are not authorized to view content");
      alert("Sorry you are not authorized to view content")
      return false
    }

}

export default access;