import React, { Component, useState } from "react";
import { Actions } from "react-native-router-flux";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";

import { any } from "prop-types";
import DropDownPicker from "react-native-dropdown-picker";
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

// set up ContractKit, using forno as a provider
// testnet
// export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
// mainnet -- comment out the above, uncomment below for mainnet
export const web3 = new Web3('https://forno.celo.org');

// @ts-ignore
export const kit = newKitFromWeb3(web3);

export default class Pay extends React.Component<any, any> {
  static navigationOptions = {
    title: "Home",
    headerStyle: {
      backgroundColor: "#f4511e",
    },
    //headerTintColor: '#0ff',
    headerTitleStyle: {
      fontWeight: "bold",
    },
  };
  state = {
    amount: "",
    reference: "",
    company: any,
    address: "0x3Ca7CdcFB98b066D6e8fEbe45a95C2FE911Bf138",
  };
  static company = [
    { value: 12, label: "Agua CDMX" },
    { value: 7, label: "Cablemas" },
    { value: 1, label: "CFE" },
    { value: 13, label: "Dish" },
    { value: 11, label: "EcoGas" },
    { value: 8, label: "Gas Natural" },
    { value: 2, label: "Infonavit" },
    { value: 34, label: "Izzi" },
    { value: 95, label: "MaxiGas" },
    { value: 6, label: "Megacable" },
    { value: 66, label: "Plan Telcel" },
    { value: 5, label: "SKY" },
    { value: 111, label: "Telmex" },
    { value: 88, label: "Total Play" },
  ];
  handleReference = (reference: string) => {
    this.setState({ reference: reference });
  };

  handleAmount = (amount: string) => {
    this.setState({ amount: amount });
  };
  selectedValue: any;

  save(amount: string, time: string) {
    fetch("", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstParam: "yourValue",
        secondParam: "yourOtherValue",
      }),
    });
  }
  transfer = async (amount: string, reference: any) => {
    if (this.state.address) {
      console.log("Entering transfer");
      const requestId = "transfer";
      const dappName = "Honoro";

      // Replace with your own account address and desired value in WEI to transfer
      const transferToAccount = '0x3Ca7CdcFB98b066D6e8fEbe45a95C2FE911Bf138';
      const transferValue = String(Number(this.state.amount)*1000000000000000000);

      // Create a transaction object using ContractKit
      const stableToken = await kit.contracts.getStableToken();
      const txObject = stableToken.transfer(transferToAccount, transferValue).txo;

      // Send a request to the Celo wallet to send an update transaction to the HelloWorld contract
      requestTxSig(
        // @ts-ignore
        kit,
        [
          {
            // @ts-ignore
            tx: txObject,
            to: stableToken.address,
            from: String(localStorage.getItem('address')),
            feeCurrency: FeeCurrency.cUSD,
          },
        ],
        { requestId, dappName, callback: window.location.href }
      );

      // Get the response from the Celo wallet
      // Wait for signed transaction object and handle possible timeout
      let rawTx;
      try {
        const dappkitResponse = await waitForSignedTxs(requestId);
        rawTx = dappkitResponse.rawTxs[0];
      } catch (error) {
        console.log(error);
        Alert.alert("Error", error, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);

        this.setState({ status: "transaction signing timed out, try again." });
        return;
      }

      // Wait for transaction result and check for success
      let status;
      const tx = await kit.connection.sendSignedTransaction(rawTx);
      const receipt = await tx.waitReceipt();

      if (receipt.status) {
        Alert.alert("Success", 'Transaction completed', [
          { text: "OK", onPress: () => console.log("OK") },
        ]);
        status = "transfer succeeded with receipt: " + receipt.transactionHash;
      } else {
        Alert.alert("Error", JSON.stringify(receipt), [
          { text: "OK", onPress: () => console.log("OK") },
        ]);

        console.log(JSON.stringify(receipt));
        status = "failed to send transaction";
      }
      this.setState({ status: status });
    }
  };
  gotToLogin() {
    Actions.pop();
  }
  render() {
    // const [selectedValue, setSelectedValue] = useState("java");
    return (
      <View style={styles.container}>
        <Card containerStyle={styles.card}>
          <DropDownPicker
            items={[
              { value: 12, label: "Agua CDMX" },
              { value: 7, label: "Cablemas" },
              { value: 1, label: "CFE" },
              { value: 13, label: "Dish" },
              { value: 11, label: "EcoGas" },
              { value: 8, label: "Gas Natural" },
              { value: 2, label: "Infonavit" },
              { value: 34, label: "Izzi" },
              { value: 95, label: "MaxiGas" },
              { value: 6, label: "Megacable" },
              { value: 66, label: "Plan Telcel" },
              { value: 5, label: "SKY" },
              { value: 111, label: "Telmex" },
              { value: 88, label: "Total Play" },
            ]}
            placeholder="Select Company"
            style={styles.dropdown}
            onChangeItem={(item) => console.log(item.label, item.value)}
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
            onPress={() =>
              this.transfer(this.state.reference, this.state.amount)
            }
          >
            <Text style={styles.submitButtonText}> Transfer </Text>
          </TouchableOpacity>
          <View style={styles.back}>
            <TouchableOpacity onPress={this.gotToLogin}>
              <Text onPress={() => this.props.history.push("/login")}>
                {" "}
                Back{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    );
  }
  setSelectedValue(itemValue: any): void {
    throw new Error("Method not implemented.");
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
});
