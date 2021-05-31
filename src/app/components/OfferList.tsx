import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { DataTable } from "react-native-paper";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";

import CONFIG from "../common/config.json";
import APIServices from "../services/APIService";
import CacheServices from "../services/CacheService";

export default class OfferList extends React.Component<any, any> {
  state = {
    spinner: false,
    offers: [],
  };
  apiService = new APIServices();
  cacheService = new CacheServices();
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      this.setState({ spinner: false });
    } else {
      this.setState({ spinner: true });
      let reqObj = {
        address: userInfo.nickname,
      };
      this.apiService
        .getOffers(reqObj)
        .then((result: any) => {
          this.setState({
            spinner: false,
            offers: result.offers,
          });
        })
        .catch((err: any) => {
          console.log(err);
          this.setState({ spinner: false });
        });
    }
  }
  setOffer(offer: any) {
    this.cacheService.setOffer(offer);
  }
  renderRows() {
    return this.state.offers.map((item: any, index) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          onPress={() => {
            this.setOffer(item);
            this.props.history.push("/offer/take");
          }}
        >
          <Card key={index} containerStyle={styles.card}>
            <View style={styles.cardItem}>
              <View>
                <Text style={styles.offerTitle}>{item.nickname}</Text>
              </View>
              <View>
                <Text style={styles.offerTitle}>{item.payment_method}</Text>
              </View>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.offerDesc}>Max Purchase</Text>
              <Text style={styles.offerDesc}>${item.amount}</Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.offerDesc}>Fees</Text>
              <Text style={styles.offerDesc}>1% + ${item.fee}</Text>
            </View>
          </Card>
        </TouchableOpacity>
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
        <View>
          <Image
            source={{
              uri: require("./../assets/images/cusd.png"),
            }}
            style={styles.logo}
          />
          <Text style={styles.logoText}>cUSD</Text>
        </View>
        <View style={{ width: 280, alignItems: "flex-end" }}>
          <TouchableOpacity>
            <Text
              style={styles.offerLink}
              onPress={() => this.props.history.push("/offer/create")}
            >
              Create Offer
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            overflow: "scroll",
            height: 350,
            marginTop: 20,
          }}
        >
          {this.state.offers.length > 0 && <View>{this.renderRows()}</View>}
          <TouchableOpacity>
            <Text
              style={styles.back}
              onPress={() => this.props.history.push("/")}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    alignItems: "center",
    marginBottom: 23,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  card: {
    backgroundColor: "#ffffff",
    width: 280,
    paddingBottom: 8,
    paddingTop: 8,
    overflow: "scroll",
    borderRadius: 3,
    marginTop: 7,
  },
  logo: {
    marginTop: 20,
    width: 40,
    height: 40,
  },
  logoText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 700,
    color: "#191954",
  },
  offerLink: {
    marginTop: 20,
    position: "relative",
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
  offerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#191954",
  },
  offerDesc: {
    fontSize: 12,
    color: "#191954",
  },
  back: {
    position: "relative",
    textAlign: "right",
    width: 280,
    marginTop: 5,
  },
});
