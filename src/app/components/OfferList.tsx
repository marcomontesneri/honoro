import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { DataTable } from "react-native-paper";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";

import CONFIG from "../common/config.json";
import APIServices from "../services/APIService";

export default class OfferList extends React.Component<any, any> {
  state = {
    spinner: false,
    offers: [],
  };
  apiService = new APIServices();
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      this.setState({ spinner: false });
    } else {
      this.setState({ spinner: false });
    }
  }
  renderRows() {
    return [1, 2, 3, 4, 5].map((item: any, index) => {
      return (
        <Card key={index} containerStyle={styles.card}>
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
      );
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
        <Image
          source={{
            uri: require("./../assets/images/cusd.png"),
          }}
          style={styles.logo}
        />
        <Text style={styles.logoText}>cUSD</Text>
        {/* <TouchableOpacity>
          <Text style={styles.back} onPress={() =>
                        this.props.history.push("/")
                      }>Back</Text>
        </TouchableOpacity> */}

        <TouchableOpacity>
          <Text style={styles.offerLink} onPress={() =>
                        this.props.history.push("/offer/create")
                      }>Create Offer</Text>
        </TouchableOpacity>
        {this.renderRows()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    flex: 1,
    alignItems: "center",
    overflow: "scroll",
    marginBottom: 23,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  card: {
    backgroundColor: "#ffffff",
    width: 280,
    top: 100,
    paddingBottom: 8,
    paddingTop: 8,
    // height: 70,
    // minHeight:70,
    borderRadius: 3,
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
  offerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#191954",
  },
  offerDesc: {
    fontSize: 12,
    color: "#191954",
  },
});
