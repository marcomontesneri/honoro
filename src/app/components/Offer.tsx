import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { DataTable } from "react-native-paper";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";

import CONFIG from "../common/config.json";
import APIServices from "../services/APIService";

export default class Offer extends React.Component<any, any> {
  state = {
    spinner: false,
    offers: [],
  };
  apiService = new APIServices();
  handleAmount = (amount: string) => {
    this.setState({ amount: amount });
  };
  save() {}
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      this.setState({ spinner: false });
    } else {
      this.setState({ spinner: false });
    }
  }

  render() {
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
        <Card containerStyle={styles.topCard}>
          <View style={styles.cardItem}>
            <View>
              <Text style={styles.offerTitle}>Juna 66</Text>
            </View>
            <View>
              <Text style={styles.offerTitle}>Zelle</Text>
            </View>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.offerDesc}>Max Purchase</Text>
            <Text style={styles.offerDesc}>$200</Text>
          </View>
          <View style={styles.cardItem}>
            <Text style={styles.offerDesc}>Fees</Text>
            <Text style={styles.offerDesc}>1% + $3</Text>
          </View>
        </Card>
        <Card containerStyle={styles.detailCard}>
          <View style={styles.detailCardItem}>
            <Text style={styles.prefix}>$</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              placeholder="0.00"
              autoFocus={true}
              maxLength={5}
              onChangeText={this.handleAmount}
            />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.postfix}>Max 200</Text>
          </View>
          {/* <View style={styles.cardItem}> */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.save()}
          >
            <Text style={styles.submitButtonText}> Take Offer </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignItems:"flex-end"}}
            onPress={() => this.props.history.push("/offers")}
          >
            <Text> Back </Text>
          </TouchableOpacity>
          {/* </View> */}
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
  topCard: {
    backgroundColor: "#ffffff",
    width: 280,
    top: 100,
    paddingBottom: 8,
    paddingTop: 8,
    // height: 70,
    minHeight: 70,
    borderRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  detailCard: {
    backgroundColor: "#ffffff",
    width: 280,
    minHeight: 70,
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
    // flexWrap:"wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  detailCardItem: {
    fontSize: 14,
    fontWeight: 700,
    // flexWrap:"wrap",
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
    // margin: 15,
    height: 40,
    width: 200,
    paddingTop: 10,
    paddingLeft:1,
    fontSize: 18,
    fontWeight: 700,
    alignItems: "center",
    outlineColor: "#fff",
    color: "#191954",
  },
  prefix: {
    paddingHorizontal: 1,
    color: "#191954",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#3de3a3",
    padding: 10,
    margin: 15,
    height: 40,
    alignItems: "center",
    textAlign: "center",
    borderRadius: 5,
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  postfix: { fontSize: 12, color: "#191954" },
});
