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
  getAccountDetails(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/balances?address=${reqObj.address}`, {
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
  getInvoiceList(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/invoices?u=${reqObj.address}&s=honoro`, {
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
  saveTransactionDraft(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/transaction/details`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
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
  getInvoice(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/invoice?invoiceId=${reqObj.invoiceId}`, {
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
  saveOffer(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/offer`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
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
  getOffers(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/offers?u=${reqObj.address}`, {
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
  saveUserInfo(reqObj: any) {
    return new Promise((resolve, reject) => {
      fetch(`${CONFIG.SERVER.URL}/trader`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqObj),
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            response.json().then((result) => resolve(result));
          } else {
            response.json().then((error) => {
              reject(error);
            });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
