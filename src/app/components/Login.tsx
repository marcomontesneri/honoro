import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  requestAccountAddress,
  waitForAccountAuth,
  // Ensure that we are importing the functions from dappkit/lib/web
} from "@celo/dappkit/lib/web";
import Spinner from "react-native-loading-spinner-overlay";
import { showMessage } from "react-native-flash-message";

import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";
import { Card } from "react-native-elements";
import CONFIG from "./../common/config.json";
// set up ContractKit, using forno as a provider
// testnet
// export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
// mainnet -- comment out the above, uncomment below for mainnet
export const web3 = new Web3("https://forno.celo.org");

import APIServices from "./../services/APIService";
// @ts-ignore
export const kit = newKitFromWeb3(web3);
export default class Login extends React.Component<any, any> {
  state = {
    status: null,
    address: null,
    phoneNumber: null,
    isUserExist: null,
    user: {},
    spinner: false,
    nickname: "",
    firstName: "",
    lastName: "",
    nicknameExist: true,
  };
  apiService = new APIServices();
  componentDidMount() {
    this.setState({ spinner: true });
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      this.setState({ isUserExist: false });
      this.setState({ spinner: false });
    } else {
      let reqObj = {
        address: userInfo.address,
      };
      this.apiService
        .getAccountDetails(reqObj)
        .then((result: any) => {
          let nicknameFlag = true;
          if (!result.trader) {
            nicknameFlag = false;
          }
          userInfo.nickname = result.trader.nickname;
          localStorage.setItem("usr", JSON.stringify(userInfo));
          this.setState({
            isUserExist: true,
            user: { ...userInfo, ...result },
            spinner: false,
            nicknameExist: nicknameFlag,
          });
        })
        .catch((err: any) => {
          console.log(err);
          this.setState({ spinner: false });
          showMessage({
            message: "Error",
            description: err.error,
            type: "danger",
            duration: CONFIG.FLASH_TIME,
          });
        });
    }
  }

  login = async () => {
    this.setState({ spinner: true });
    console.log("entering login");
    // A string you can pass to DAppKit, that you can use to listen to the response for that request
    const requestId = "login";

    // A string that will be displayed to the user, indicating the DApp requesting access/signature
    const dappName = "Honoro";
    // Ask the Celo Alfajores Wallet for user info
    requestAccountAddress({
      requestId,
      dappName: dappName,
      callback: window.location.href,
    });

    // Wait for the Celo Wallet response
    try {
      const dappkitResponse = await waitForAccountAuth(requestId);
      let userInfo = {
        status: "Login succeeded",
        address: dappkitResponse.address,
        phoneNumber: dappkitResponse.phoneNumber,
      };
      localStorage.setItem("usr", JSON.stringify(userInfo));

      let reqObj = {
        address: dappkitResponse.address,
      };
      this.apiService
        .getAccountDetails(reqObj)
        .then((result: any) => {
          this.setState({
            status: "Login succeeded",
            isUserExist: true,
            user: { ...userInfo, ...result },
            spinner: false,
            loggedIn: true,
          });
        })
        .catch((err: any) => {
          console.log(err);
          this.setState({ spinner: false });
          showMessage({
            message: "Error",
            description: err.error,
            type: "danger",
            duration: CONFIG.FLASH_TIME,
          });
        });
      // Catch and handle possible timeout errors
    } catch (error) {
      console.log(error);
      this.setState({
        status: error.message || "Login timed out, try again.",
        spinner: false,
      });
      showMessage({
        message: "Error",
        description: error.error,
        type: "danger",
        duration: CONFIG.FLASH_TIME,
      });
    }
  };
  handleInput(inputValue: any) {
    this.setState(inputValue);
  }
  save() {
    this.setState({ spinner: true });
    let reqObj = {
      nickname: this.state.nickname,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phoneNumber: this.state.user.phoneNumber,
      address: this.state.user.address,
    };
    this.apiService
      .saveUserInfo(reqObj)
      .then((result: any) => {
        let info = {
          phoneNumber: this.state.user.phoneNumber,
          trader: {
            nickname: this.state.nickname,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
          },
        };
        this.setState({ nicknameExist: true, spinner: false, user: info });
        showMessage({
          message: "Success",
          description: "User info saved successfully",
          type: "success",
          duration: CONFIG.FLASH_TIME,
        });
      })
      .catch((err: any) => {
        console.log(err);
        this.setState({ spinner: false });
        showMessage({
          message: "Error",
          description: err.error,
          type: "danger",
          duration: CONFIG.FLASH_TIME,
        });
      });
  }

  render() {
    const { nickname } = this.state;
    const enabled = nickname.length > 0;

    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={{ color: "#673ab7", fontSize: 14 }}
        />

        <Card containerStyle={styles.card}>
          {Object.keys(this.state.user).length === 0 ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.login()}
            >
              <Text style={styles.submitButtonText}> Connect to Valora </Text>
            </TouchableOpacity>
          ) : (
            this.state.nicknameExist &&
            this.state.user && (
              <View>
                <View style={styles.mainV}>
                  <View style={styles.cView}>
                    <View style={styles.cUSDView}></View>
                    <Text style={styles.cUSD}>
                      {this.state.user.cUSDBalance} cUSD
                    </Text>
                  </View>
                  <View style={styles.hView}>
                    <View style={styles.HNRView}></View>
                    <Text style={styles.HNR}>
                      {this.state.user.HNRBalance} HNR
                    </Text>
                  </View>
                </View>
              </View>
            )
          )}
          {this.state.nicknameExist && this.state.user.trader ? (
            <View style={styles.desc}>
              <Text style={styles.text}>
                Nickname: {this.state.user.trader.nickname}
              </Text>
              <Text style={styles.text}>
                First Name: {this.state.user.trader.first_name}
              </Text>
              <Text style={styles.text}>
                Last Name: {this.state.user.trader.last_name}
              </Text>
              <Text style={styles.text}>
                Phone number: {this.state.user.phoneNumber}
              </Text>
            </View>
          ) : null}
          {this.state.nicknameExist && Object.keys(this.state.user).length>0 && (
            <View style={styles.pay}>
              <TouchableOpacity>
                <Text onPress={() => this.props.history.push("/transaction")}>
                  History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text onPress={() => this.props.history.push("/offers")}>
                  get cUSD
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text onPress={() => this.props.history.push("/pay")}>Use</Text>
              </TouchableOpacity>
            </View>
          )}
          {!this.state.nicknameExist && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#000000bf" }}>
                Please update following details
              </Text>
              <TextInput
                style={styles.input}
                placeholder="nickname"
                autoFocus={true}
                onChangeText={(text) => this.handleInput({ nickname: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="First name"
                onChangeText={(text) => this.handleInput({ firstName: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                onChangeText={(text) => this.handleInput({ lastName: text })}
              />
              <TouchableOpacity
                disabled={!enabled}
                style={styles.submitButton}
                onPress={() => this.save()}
              >
                <Text style={styles.submitButtonText}> Submit </Text>
              </TouchableOpacity>
            </View>
          )}
          <></>
        </Card>
      </View>
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
    padding: 0,
    paddingTop: 25,
    width: 300,
    borderRadius: 3,
    // minHeight: 300,
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
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    flex: 1,
    top: 45,
    padding: 20,
    backgroundColor: "#cccbc8",
    fontSize: 14,
    fontWeight: 700,
  },
  cUSDView: {
    width: 20,
    height: 20,
    backgroundColor: "#07a832",
    marginLeft: 30,
    borderRadius: 18,
  },
  cView: {
    flexDirection: "row",
  },
  hView: {
    flexDirection: "row",
  },
  cUSD: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 700,
  },
  HNRView: {
    width: 20,
    height: 20,
    backgroundColor: "#c9c012",
    marginLeft: 20,
    borderRadius: 18,
  },
  HNR: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: 700,
  },
  mainV: {
    flexDirection: "row",
  },
  input: {
    margin: 15,
    height: 40,
    width: 200,
    // borderColor: "rgb(223, 223, 223)",
    borderWidth: 1,
    padding: 10,
    color: "#000000bf",
  },
});
