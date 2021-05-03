import React from "react";
import { Card } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
} from "react-native";

import { any } from "prop-types";
import Spinner from "react-native-loading-spinner-overlay";

import CONFIG from "./../common/config.json";

export default class TransactionDetails extends React.Component<any, any> {
  state = {
    invoice: any,
    spinner: false,
  };

  componentDidMount() {
    this.setState({ spinner: true });
    setTimeout(() => {
      let invoiceId = localStorage.getItem("inv");
      if (invoiceId === null) {
        Alert.alert("Error", "Invoice id is missing", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        fetch(`${CONFIG.SERVER.URL}/invoice?invoiceId=${invoiceId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((result: any) => {
            const company = CONFIG.COMPANY_LIST.find(
              (item) => item.value === result.company_id
            );
            result.company = company.label;
            this.setState({ invoice: result, spinner: false });
          })
          .catch((err) => {
            console.log(err);
            this.setState({ spinner: false });
          });
      }
    }, 100);
  }
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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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
          textStyle={{ color: "#673ab7", fontSize: 14 }}
        />
        <Card containerStyle={styles.card}>
          <View style={styles.desc}>
            <Image
              source={{
                uri:
                  this.state.invoice.status === "completed"
                    ? require("./../assets/images/completed.png")
                    : require("./../assets/images/pending.png"),
              }}
              style={styles.icon}
            />
            <Text style={styles.pid}>
              Payment Id: {this.state.invoice.invoice_id}
            </Text>
            <Text style={styles.status}>
              {this.state.invoice.status === "initiated"
                ? "Pending"
                : this.state.invoice.status}
            </Text>
            <Text style={styles.title}>Company</Text>
            <Text style={styles.value}>{this.state.invoice.company}</Text>
            <Text style={styles.title}>Reference</Text>
            <Text style={styles.value}>{this.state.invoice.reference}</Text>
            <Text style={styles.title}>Amount in Pesos</Text>
            <Text style={styles.value}>
              {Number(this.state.invoice.amount).toFixed(2)}
            </Text>
            <Text style={styles.title}>Total in cUSD</Text>
            <Text style={styles.value}>{this.state.invoice.celo_amount}</Text>
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
    borderRadius: 3
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
  icon: { width: 40, height: 40, alignSelf: "center", marginBottom: 10 },
});
