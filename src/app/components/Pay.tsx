import React from "react";
import { Actions } from "react-native-router-flux";
import { Card } from "react-native-elements";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";

import { any } from "prop-types";
import DropDownPicker from "react-native-dropdown-picker";
import {
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency,
  // Ensure that we are importing the functions from dappkit/lib/web
} from "@celo/dappkit/lib/web";

import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";
import Spinner from "react-native-loading-spinner-overlay";

import CONFIG from "./../common/config.json";

import APIServices from "./../services/APIService";
// set up ContractKit, using forno as a provider
// testnet
// export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
// mainnet -- comment out the above, uncomment below for mainnet
export const web3 = new Web3("https://forno.celo.org");

// @ts-ignore
export const kit = newKitFromWeb3(web3);

export default class Pay extends React.Component<any, any> {
  state = {
    amount: "",
    reference: "",
    company: any,
    address: CONFIG.CELO.DESTINATION_ADDRESS,
    mainPage: true,
    spinner: false,
    result: any,
    isSuccess: false,
    overlay: false,
    error: false,
    requestInProgress: false,
    errorMessage: "",
    transactionHash: "",
  };
  apiService = new APIServices();

  handleReference = (reference: string) => {
    this.setState({ reference: reference });
  };

  handleAmount = (amount: string) => {
    this.setState({ amount: amount });
  };
  selectedValue: any;
  // componentDidMount() {
  //   let reqObj = {
  //     hash:
  //       "0x1b9fe7e1685dde846e9e79348c8cd6a5230491486994b779522b1d26f2133593",
  //   };
  //   this.apiService
  //     .getTransactionDetails(reqObj)
  //     .then((result: any) => {
  //       console.log(result);
  //     })
  //     .catch((err: any) => {
  //       console.log("Error", err);
  //     });
  // }

  save() {
    this.setState({ spinner: true });
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    const reqObj = {
      company: {
        amount: this.state.amount,
        company: this.state.company.value,
        reference: this.state.reference,
        source: "honoro",
      },
    };
    if (userInfo !== null) {
      reqObj.company.userAddress = userInfo.address;
    }
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
        console.log(result);
        localStorage.setItem("inv", String(result.invoiceId));
        this.setState({ mainPage: false, result: result, spinner: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ spinner: false });
      });
  }
  transfer = async () => {
    if (this.state.address) {
      this.setState({ overlay: true, requestInProgress: true });
      console.log("Entering transfer");
      const requestId = "transfer";
      const dappName = "Honoro";
      const callback = `${CONFIG.SERVER.CLIENT}/transaction/detail`;

      // Replace with your own account address and desired value in WEI to transfer
      const transferToAccount = CONFIG.CELO.DESTINATION_ADDRESS;
      const transferValue = String(
        Number(this.state.result.updatedAmount) * 1000000000000000000
      );

      // Create a transaction object using ContractKit
      const stableToken = await kit.contracts.getStableToken();
      const txObject = stableToken.transfer(transferToAccount, transferValue)
        .txo;

      // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
      requestTxSig(
        // @ts-ignore
        kit,
        [
          {
            // @ts-ignore
            tx: txObject,
            to: stableToken.address,
            from: String(localStorage.getItem("address")),
            feeCurrency: FeeCurrency.cUSD,
          },
        ],
        { requestId, dappName, callback }
      );

      // Get the response from the Celo wallet
      // Wait for signed transaction object and handle possible timeout
      let rawTx;
      try {
        const dappkitResponse = await waitForSignedTxs(requestId);
        rawTx = dappkitResponse.rawTxs[0];
      } catch (error) {
        console.log(error);
        this.setState({
          error: true,
          requestInProgress: false,
          errorMessage: error.message,
        });
        // this.setState({ status: "transaction signing timed out, try again." });
        return;
      }

      // Wait for transaction result and check for success
      // let status;
      try {
        const tx = await kit.connection.sendSignedTransaction(rawTx);
        const receipt = await tx.waitReceipt();

        if (receipt.status) {
          this.setState({
            requestInProgress: false,
            isSuccess: true,
            error: false,
            transactionHash: receipt.transactionHash,
          });
          // status = "transfer succeeded with receipt: " + receipt.transactionHash;
        } else {
          console.log(JSON.stringify(receipt));
          status = "failed to send transaction";
          this.setState({
            error: true,
            requestInProgress: false,
            errorMessage: JSON.stringify(receipt),
          });
        }
      } catch (err) {
        this.setState({
          error: true,
          requestInProgress: false,
          errorMessage: err.message,
        });
      }
      // this.setState({ status: status });
    }
  };
  gotToLogin() {
    Actions.pop();
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={{ color: "#673ab7", fontSize: 14 }}
        />
        <Card containerStyle={styles.card}>
          {this.state.mainPage && (
            <View>
              <DropDownPicker
                items={CONFIG.COMPANY_LIST}
                placeholder="Select Company"
                style={styles.dropdown}
                onChangeItem={(item) => this.setState({ company: item })}
              />
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                placeholder="Reference"
                onChangeText={this.handleReference}
              />
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="Amount"
                autoCapitalize="none"
                onChangeText={this.handleAmount}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.save()}
              >
                <Text style={styles.submitButtonText}> Submit </Text>
              </TouchableOpacity>
            </View>
          )}
          {!this.state.mainPage && (
            <View style={styles.desc}>
              <Text style={styles.pid}>
                Payment Id: {this.state.result.invoiceId}
              </Text>
              <Text style={styles.status}>Pending</Text>
              <Text style={styles.title}>Company</Text>
              <Text style={styles.value}>{this.state.company.label}</Text>
              <Text style={styles.title}>Reference</Text>
              <Text style={styles.value}>{this.state.reference}</Text>
              <Text style={styles.title}>Amount in Pesos</Text>
              <Text style={styles.value}>
                {Number(this.state.amount).toFixed(2)}
              </Text>
              <Text style={styles.title}>Total in cUSD</Text>
              <Text style={styles.value}>
                {this.state.result.updatedAmount}
              </Text>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => this.transfer()}
              >
                <Text style={styles.submitButtonText}> Confirm Payment </Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.back}>
            <TouchableOpacity onPress={this.gotToLogin}>
              <Text onPress={() => this.props.history.push("/")}> Back </Text>
            </TouchableOpacity>
          </View>
          {this.state.overlay && (
            <View style={styles.overlay}>
              {this.state.requestInProgress && (
                <View>
                  <Image
                    source={{
                      uri: require("./../assets/images/742.gif"),
                    }}
                    style={styles.loader}
                  />
                  <Text style={styles.loadText}>
                    Waiting for confirmation...
                  </Text>
                </View>
              )}
              {this.state.isSuccess && (
                <View>
                  <Image
                    source={{
                      uri: require("./../assets/images/completed.png"),
                    }}
                    style={styles.loader}
                  />
                  <TouchableOpacity>
                    <Text
                      style={styles.statusLink}
                      onPress={() =>
                        this.props.history.push("/transaction/detail")
                      }
                    >
                      Check Status
                    </Text>
                    <Text style={styles.loadText}>
                      Transaction submitted...
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text
                      style={styles.statusLink}
                      onPress={() => window.open(`${CONFIG.CELO.TRANSACTION_API}${this.state.transactionHash}`, "_blank")}
                    >
                      <Image
                        source={{
                          uri: require("./../assets/images/celo.png"),
                        }}
                        style={styles.celoIcon}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {this.state.error && (
                <View>
                  <Image
                    source={{
                      uri: require("./../assets/images/error.png"),
                    }}
                    style={styles.loader}
                  />
                  <Text style={styles.errorMessage}>
                    {this.state.errorMessage}
                  </Text>
                  <TouchableOpacity>
                    <Text
                      style={styles.statusLink}
                      onPress={() =>
                        this.props.history.push("/transaction/detail")
                      }
                    >
                      Check Status
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </Card>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    margin: 15,
    height: 40,
    width: 200,
    borderColor: "rgb(223, 223, 223)",
    borderWidth: 1,
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#673ab7",
    padding: 10,
    margin: 15,
    height: 40,
    alignItems: "center",
    textAlign: "center",
    borderRadius: 5,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  label: {
    textAlign: "left",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  card: {
    backgroundColor: "#ffffff",
    width: 320,
    alignItems: "center",
    borderRadius: 3,
  },
  dropdown: {
    width: 200,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  back: {
    alignItems: "flex-end",
  },
  desc: {
    paddingTop: 10,
    color: "#1c1b19",
  },
  pid: {
    fontSize: 14,
    fontWeight: "600",
  },
  status: {
    color: "#673ab7",
    fontStyle: "italic",
    fontSize: 14,
    marginTop: 10,
  },
  title: {
    color: "#6f6e6b",
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: 2,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "400",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  overlay: {
    position: "absolute",
    top: 40,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#dad8d8",
    opacity: 1,
    borderRadius: 5,
    // width:335,
  },
  loader: {
    width: 64,
    height: 64,
    alignSelf: "center",
    marginTop: 10,
  },
  loadText: {
    alignSelf: "center",
    marginTop: 10,
    color: "#673ab7",
    fontWeight: "700",
    fontSize: 14,
  },
  statusLink: {
    alignSelf: "center",
    marginTop: 15,
    fontWeight: "700",
    fontSize: 12,
    color: "#673ab7",
  },
  errorMessage: {
    alignSelf: "center",
    marginTop: 15,
    fontWeight: "700",
    fontSize: 12,
    color: "red",
    textAlign: "center",
  },
  celoIcon: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginTop: 10,
  },
});
