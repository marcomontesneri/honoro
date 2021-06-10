import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";
import { showMessage } from "react-native-flash-message";
import { newKitFromWeb3 } from "@celo/contractkit";
import BN from 'bignumber.js'

import {
  requestTxSig,
  waitForSignedTxs,
  FeeCurrency,
  // Ensure that we are importing the functions from dappkit/lib/web
} from "@celo/dappkit/lib/web";

import Web3 from "web3";
export const web3 = new Web3("https://forno.celo.org");

// @ts-ignore
export const kit = newKitFromWeb3(web3);

import CONFIG from "../common/config.json";
import ABI from "../common/abi.json";
import APIServices from "../services/APIService";

export default class NewOffer extends React.Component<any, any> {
  state = {
    spinner: false,
    offers: [],
    amount: "",
    fee: "",
    pMethod: "",
  };
  apiService = new APIServices();
  handleAmount = (amount: string) => {
    this.setState({ amount: amount });
  };
  handleFee = (fee: string) => {
    this.setState({ fee: fee });
  };
  handlePaymentMethod = (pMethod: string) => {
    this.setState({ pMethod: pMethod });
  };
  async save() {
    this.setState({ spinner: true });
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    let reqObj = {
      nickname: userInfo.nickname,
      amount: this.state.amount,
      fee: this.state.fee,
      paymentMethod: this.state.pMethod,
    };
    this.apiService
      .saveOffer(reqObj)
      .then((result: any) => {
        showMessage({
          message: "Success",
          description: "Offer created successfully",
          type: "success",
          duration: CONFIG.FLASH_TIME,
        });
        this.props.history.push("/offers");
        this.setState({
          spinner: false,
        });
      })
      .catch((err: any) => {
        showMessage({
          message: "Error",
          description: err.error || err.message || err,
          type: "danger",
          duration: CONFIG.FLASH_TIME,
        });
        console.log(err);
        this.setState({ spinner: false });
      });

      try {
        const requestId = "transfer";
        const dappName = "Honoro";
        const PoolContract = new web3.eth.Contract(ABI, CONFIG.CELO.CONTRACT_ADDRESS);
        const value = BN(10).pow(18).multipliedBy(this.state.amount).toFixed(0)
        const isCUSD = 'cusd';
        const stableToken = await kit.contracts.getStableToken();
        let txObject= await PoolContract.methods.deposit(CONFIG.CELO.CONTRACT_DEPOSIT_ADDRESS, value);
        // const txObject = lendingPool.methods.deposit(reserves[txCurrency.toLowerCase()], value, 0)
  
        const txParamCelo = {
          tx: txObject,
          from:userInfo.address,
          to: CONFIG.CELO.CONTRACT_DEPOSIT_ADDRESS,
          // hello valora. Fix for rounding issues in mobile app
          // https://github.com/celo-org/celo-monorepo/issues/6830
          value: BN(value).plus('1000000000').toFixed(0),
          estimatedGas: 2000000,
          feeCurrency: isCUSD ? FeeCurrency.cUSD : undefined
        }
  
        let txParams = []
        
        if (isCUSD) {
          const approveTxObj = await stableToken.approve(CONFIG.CELO.CONTRACT_DEPOSIT_ADDRESS, value).txo
          const txParamCUSD = {
            tx: approveTxObj,
            from: userInfo.address,
            to: CONFIG.CELO.CONTRACT_DEPOSIT_ADDRESS,
            estimatedGas: 1000000,
            feeCurrency: isCUSD ? FeeCurrency.cUSD : undefined
          }
          txParams = [txParamCUSD, txParamCelo]
        } else {
          txParams = [txParamCelo]
        }
  
        const callback = `${CONFIG.SERVER.CLIENT}/offer/create`;
        
        requestTxSig(
          kit,
          txParams,
          { requestId, dappName, callback }
        );
  
        // Get the response from the Celo wallet
      // Wait for signed transaction object and handle possible timeout
      let rawTx;
      try {
        const dappkitResponse = await waitForSignedTxs(requestId);
        rawTx = dappkitResponse.rawTxs[0];
      } catch (err) {
        console.log(err);
        showMessage({
          message: "Error",
          description: err.error || err.message || err,
          type: "danger",
          duration: CONFIG.FLASH_TIME,
        });
        this.setState({ spinner: false });
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
        } else {
          console.log(JSON.stringify(receipt));
          status = "failed to send transaction";
          showMessage({
            message: "Error",
            description: JSON.stringify(receipt),
            type: "danger",
            duration: CONFIG.FLASH_TIME,
          });
          this.setState({ spinner: false });
        }
      } catch (err) {
        showMessage({
          message: "Error",
          description: err.error || err.message || err,
          type: "danger",
          duration: CONFIG.FLASH_TIME,
        });
        this.setState({ spinner: false });
      }

      } catch (error) {
        console.log(error);
        showMessage({
          message: "Error",
          description: error.error || error.message || error,
          type: "danger",
          duration: CONFIG.FLASH_TIME,
        });
        this.setState({ spinner: false });
      }


  }
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      return this.props.history.push("/");
    }
  }
  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    const { amount, fee, pMethod } = this.state;
    const enabled = amount.length > 0 && pMethod.length > 0 && fee.length > 0;
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={{ color: "#673ab7", fontSize: 14 }}
        />
        <Image
          source={{
            uri: require("./../assets/images/cusd.png"),
          }}
          style={styles.logo}
        />
        <Text style={styles.logoText}>cUSD</Text>
        <Card containerStyle={styles.detailCard}>
          <View style={styles.detailCardItem}>
            <Text style={styles.prefix}>$</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="0.00"
              autoFocus={true}
              maxLength={5}
              onChangeText={this.handleAmount}
            />
          </View>
          <View>
            <TextInput
              keyboardType="numeric"
              style={styles.inputFee}
              placeholder="transaction fee"
              maxLength={5}
              onChangeText={this.handleFee}
            />
          </View>
          <View>
            <TextInput
              style={styles.inputFee}
              placeholder="payment method"
              onChangeText={this.handlePaymentMethod}
              numeric
            />
          </View>
          <TouchableOpacity
            disabled={!enabled}
            style={styles.submitButton}
            onPress={() => this.save()}
          >
            <Text style={styles.submitButtonText}> Create Offer </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => this.props.history.push("/offers")}
          >
            <Text> Back </Text>
          </TouchableOpacity>
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
    marginBottom: 23,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  detailCard: {
    backgroundColor: "#ffffff",
    width: 280,
    minHeight: 200,
    top: 100,
    borderRadius: 3,
    margin: 0,
  },
  logo: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 30,
  },
  logoText: {
    position: "absolute",
    top: 73,
    fontSize: 16,
    fontWeight: 700,
    color: "#191954",
  },
  offerLink: {
    top: 95,
    position: "absolute",
    justifyContent: "space-between",
    left: 50,
    width: 100,
    fontWeight: 500,
    color: "#191954",
  },
  cardItem: {
    fontSize: 14,
    fontWeight: 700,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  detailCardItem: {
    fontSize: 14,
    fontWeight: 700,
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 10,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#191954",
  },
  offerDesc: {
    fontSize: 12,
    color: "#191954",
  },
  input: {
    height: 40,
    width: 200,
    // paddingTop: 10,
    paddingLeft: 1,
    fontSize: 36,
    fontWeight: 700,
    borderBottomWidth: 2,
    // paddingBottom: 15,
    alignItems: "center",
    outlineColor: "#fff",
    color: "#191954",
    outlineStyle: "none",
  },
  inputFee: {
    height: 40,
    width: 200,
    paddingTop: 10,
    paddingLeft: 1,
    fontSize: 12,
    fontWeight: 700,
    borderBottomWidth: 2,
    paddingBottom: 5,
    alignItems: "center",
    outlineColor: "#fff",
    color: "#191954",
    marginLeft: 35,
    position: "relative",
    outlineStyle: "none",
  },
  prefix: {
    paddingHorizontal: 1,
    color: "#191954",
    fontSize: 36,
    fontWeight: "700",
    // marginTop: -5,
  },
  submitButton: {
    backgroundColor: "#3de3a3",
    padding: 10,
    margin: 15,
    height: 40,
    alignItems: "center",
    textAlign: "center",
    borderRadius: 23,
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  postfix: { fontSize: 12, color: "#191954" },
});
