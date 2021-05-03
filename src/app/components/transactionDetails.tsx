import React from "react";
import { Actions } from "react-native-router-flux";
import { Card } from "react-native-elements";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";

import { any } from "prop-types";
import Spinner from "react-native-loading-spinner-overlay";

import CONFIG from "./../common/config.json";

export default class TransactionDetails extends React.Component<any, any> {
  state = {
    amount: "",
    reference: "",
    company: any,
    address: CONFIG.CELO.DESTINATION_ADDRESS,
    mainPage: true,
    spinner: false,
  };


  save() {
    this.setState({ spinner: true });
    const reqObg = {
      company: {
        amount: this.state.amount,
        company: this.state.company.value,
        reference: this.state.reference,
        source: "honoro",
        result: any,
      },
    };
    fetch(`${CONFIG.SERVER.URL}/transaction/details`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    })
      .then((response) => response.json())
      .then((result: any) => {
        console.log(result);
        this.setState({ mainPage: false, result: result, spinner: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ spinner: false });
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={"Loading..."}
          textStyle={{color:"#673ab7", fontSize:14}}
        />
        <Card containerStyle={styles.card}>
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
            </View>
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
  card: {
    backgroundColor: "#ffffff",
    width: 320,
    alignItems: "center",
    borderRadius: 3,
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
    color: '#FFF'
  }
});
