import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import CacheServices from "../services/CacheService";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";

import APIServices from "../services/APIService";

export default class Offer extends React.Component<any, any> {
  state = {
    spinner: false,
    offer: {},
  };
  apiService = new APIServices();
  cacheService = new CacheServices();
  handleAmount = (amount: string) => {
    this.setState({ amount: amount });
  };
  save() {}
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      return this.props.history.push("/");
    } else {
      const offer = this.cacheService.getOffer();
      if (Object.keys(offer).length === 0) {
        return this.props.history.push("/offers");
      }
      this.setState({ offer: this.cacheService.getOffer() });
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
        {this.state.offer && (
          <Card containerStyle={styles.topCard}>
            <View style={styles.cardItem}>
              <View>
                <Text style={styles.offerTitle}>
                  {this.state.offer.nickname}
                </Text>
              </View>
              <View>
                <Text style={styles.offerTitle}>
                  {this.state.offer.payment_method}
                </Text>
              </View>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.offerDesc}>Max Purchase</Text>
              <Text style={styles.offerDesc}>${this.state.offer.amount}</Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.offerDesc}>Fees</Text>
              <Text style={styles.offerDesc}>1% + ${this.state.offer.fee}</Text>
            </View>
          </Card>
        )}
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
          {/* {this.state.offer && (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.postfix}>Max {this.state.offer.amount}</Text>
          </View>
          )} */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => this.save()}
          >
            <Text style={styles.submitButtonText}> Take Offer </Text>
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
  topCard: {
    backgroundColor: "#ffffff",
    width: 280,
    top: 100,
    paddingBottom: 8,
    paddingTop: 8,
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
    paddingTop: 10,
    paddingLeft: 1,
    fontSize: 25,
    fontWeight: 700,
    alignItems: "center",
    outlineColor: "#fff",
    color: "#191954",
    outlineStyle: "none",
  },
  prefix: {
    paddingHorizontal: 1,
    color: "#191954",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 11,
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
