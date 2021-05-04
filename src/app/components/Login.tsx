import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  requestAccountAddress,
  waitForAccountAuth,
  // Ensure that we are importing the functions from dappkit/lib/web
} from "@celo/dappkit/lib/web";
import Spinner from "react-native-loading-spinner-overlay";

import { newKitFromWeb3 } from "@celo/contractkit";
import Web3 from "web3";
import { Card } from "react-native-elements";
import CONFIG from "./../common/config.json";
// set up ContractKit, using forno as a provider
// testnet
// export const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
// mainnet -- comment out the above, uncomment below for mainnet
export const web3 = new Web3("https://forno.celo.org");

// @ts-ignore
export const kit = newKitFromWeb3(web3);
export default class Login extends React.Component<any, any> {
  state = {
    status: null,
    address: null,
    phoneNumber: null,
    isUserExist: null,
    user: null,
    spinner: false,
  };
  componentDidMount() {
    this.setState({ spinner: true });
    setTimeout(()=>{
      let userInfo = JSON.parse(localStorage.getItem("usr"));
      if (userInfo === null) {
        this.setState({ isUserExist: false });
        this.setState({ spinner: false });
      } else {
        fetch(`${CONFIG.SERVER.URL}/celo/balances?address=${userInfo.address}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((result: any) => {
              this.setState({ isUserExist: true, user: userInfo,result: result,spinner: false });
          })
          .catch((err) => {
            console.log(err);
            this.setState({ spinner: false });
          });
      }

    },1000);
  }

  login = async () => {
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
      setTimeout(() => {
        this.setState({
          status: "Login succeeded",
          address: dappkitResponse.address,
          phoneNumber: dappkitResponse.phoneNumber,
          loggedIn: true,
        });
      }, 100);
      let userInfo = {
        status: "Login succeeded",
        address: dappkitResponse.address,
        phoneNumber: dappkitResponse.phoneNumber,
      };
      localStorage.setItem("usr", JSON.stringify(userInfo));
      // Catch and handle possible timeout errors
    } catch (error) {
      console.log(error);
      this.setState({
        status: "Login timed out, try again.",
      });
    }
  };

  render() {
    return (
      
      <View style={styles.container}>
                <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={{color:"#673ab7", fontSize:14}}
        />

        <Card containerStyle={styles.card}>
          {this.state.user === null ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => this.login()}
            >
              <Text style={styles.submitButtonText}> Connect to Valora </Text>
            </TouchableOpacity>
          ) : (
            this.state.result && (
              <View>
                <View style={styles.mainV}>
                  <View style={styles.cView}>
                    <View style={styles.cUSDView}></View>
                    <Text style={styles.cUSD}>
                      {this.state.result.cUSDBalance} cUSD
                    </Text>
                  </View>
                  <View style={styles.hView}>
                    <View style={styles.HNRView}></View>
                    <Text style={styles.HNR}>
                      {this.state.result.HNRBalance} HNR
                    </Text>
                  </View>
                </View>
              </View>
            )
          )}
          {this.state.user ? (
            <View style={styles.desc}>
              <Text style={styles.text}>Status: {this.state.user.status}</Text>
              <Text style={styles.text}>
                Address: {this.state.user.address}
              </Text>
              <Text style={styles.text}>
                Phone number: {this.state.user.phoneNumber}
              </Text>
            </View>
          ) : null}
          {this.state.user && (
            <View style={styles.pay}>
              <TouchableOpacity>
                <Text onPress={() => this.props.history.push("/pay")}>
                  Borrow
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text onPress={() => this.props.history.push("/pay")}>
                  Repay
                </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text onPress={() => this.props.history.push("/pay")}>Use</Text>
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
});
