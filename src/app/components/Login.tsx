import React, { Component } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  requestTxSig,
  waitForSignedTxs,
  requestAccountAddress,
  waitForAccountAuth,
  FeeCurrency,
  // Ensure that we are importing the functions from dappkit/lib/web
} from "@celo/dappkit/lib/web";

import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";
import { Card } from "react-native-elements";

// set up ContractKit, using forno as a provider
// testnet
export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
// mainnet -- comment out the above, uncomment below for mainnet
// export const web3 = new Web3('https://forno.celo.org');

// @ts-ignore
export const kit = newKitFromWeb3(web3);
export default class Login extends Component<any, any> {
  state = {
    status: null,
    address: null,
    phoneNumber: null,
  };

  login = async () => {
    console.log("entering login");
    // A string you can pass to DAppKit, that you can use to listen to the response for that request
    const requestId = "login";

    // A string that will be displayed to the user, indicating the DApp requesting access/signature
    const dappName = "Web DappKit";
    // Ask the Celo Alfajores Wallet for user info
    requestAccountAddress({
      requestId,
      dappName: dappName,
      callback: window.location.href,
    });

    // Wait for the Celo Wallet response
    try {
      const dappkitResponse = await waitForAccountAuth(requestId);
      this.setState({
        status: "Login succeeded",
        address: dappkitResponse.address,
        phoneNumber: dappkitResponse.phoneNumber,
        loggedIn: true,
      });
      // Catch and handle possible timeout errors
    } catch (error) {
      console.log(error);
      this.setState({
        status: "Login timed out, try again.",
      });
    }
  };

  // transfer = async () => {
  //   if (this.state.address) {
  //     console.log("Entering transfer");
  //     const requestId = "transfer";
  //     const dappName = "Hello Celo";

  //     // Replace with your own account address and desired value in WEI to transfer
  //     const transferToAccount = "0x3Ca7CdcFB98b066D6e8fEbe45a95C2FE911Bf138";
  //     const transferValue = "1";

  //     // Create a transaction object using ContractKit
  //     const stableToken = await kit.contracts.getStableToken();
  //     const txObject = stableToken.transfer(transferToAccount, transferValue)
  //       .txo;

  //     // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
  //     requestTxSig(
  //       // @ts-ignore
  //       kit,
  //       [
  //         {
  //           // @ts-ignore
  //           tx: txObject,
  //           from: this.state.address!,
  //           to: stableToken.address,
  //           feeCurrency: FeeCurrency.cUSD,
  //         },
  //       ],
  //       { requestId, dappName, callback: window.location.href }
  //     );

  //     // Get the response from the Celo wallet
  //     // Wait for signed transaction object and handle possible timeout
  //     let rawTx;
  //     try {
  //       const dappkitResponse = await waitForSignedTxs(requestId);
  //       rawTx = dappkitResponse.rawTxs[0];
  //     } catch (error) {
  //       console.log(error);
  //       this.setState({ status: "transaction signing timed out, try again." });
  //       return;
  //     }

  //     // Wait for transaction result and check for success
  //     let status;
  //     const tx = await kit.connection.sendSignedTransaction(rawTx);
  //     const receipt = await tx.waitReceipt();

  //     if (receipt.status) {
  //       status = "transfer succeeded with receipt: " + receipt.transactionHash;
  //     } else {
  //       console.log(JSON.stringify(receipt));
  //       status = "failed to send transaction";
  //     }
  //     this.setState({ status: status });
  //   }
  // };

  render() {
    return (
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <TouchableOpacity style={styles.submitButton} onPress={() => this.login()}>
            <Text style={styles.submitButtonText}> Connect to Valora </Text>
          </TouchableOpacity>
           <View style={styles.desc}>
            <Text style={styles.text}>Status: {this.state.status}</Text>
            <Text style={styles.text}>Address: {this.state.address}</Text>
            <Text style={styles.text}>
              Phone number: {this.state.phoneNumber}
            </Text>
          </View>
          <View style={styles.pay}>
            <TouchableOpacity>
              <Text onPress={() => this.props.history.push("/pay")}>Pay</Text>
            </TouchableOpacity>
          </View>
          <></>
          {/* 
          <TouchableOpacity
            style={styles.submitButton}
            
          >
            <Text style={styles.submitButtonText}> Transfer </Text> */}
          {/* </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={this.gotToLogin}> */}
          {/* <Text onPress={() => this.props.history.push("/login")}> Back </Text> */}
          {/* </TouchableOpacity> */}
        </Card>
      </View>
      // <View style={styles.container}>
      //   <Card containerStyle={styles.card}>
      //     {/* <Text style={styles.title}>Honoro</Text> */}
      //     <Button title="Connect to Valora" onPress={() => this.login()} />
      //     <Text style={styles.text}>Status: {this.state.status}</Text>
      //     <Text style={styles.text}>Address: {this.state.address}</Text>
      //     <Text style={styles.text}>
      //       Phone number: {this.state.phoneNumber}
      //     </Text>
      //     {this.state.address ? (
      //       <Button title="Transfer" onPress={() => this.transfer()} />
      //     ) : (
      //       <></>
      //     )}
      //   </Card>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: 300,
    borderRadius: 3,
    minHeight: 300,
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
  text: {
    padding: 10,
  },
  desc: {
    padding: 20,
  },
  pay: {
    alignItems: "flex-end",
  },
});
