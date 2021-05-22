import CONFIG from "./../common/config.json";

export default class APIServices {
  getTransactionDetails(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.CELO.TRANSACTION_API}${reqObj.hash}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result: any) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
