import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { DataTable } from "react-native-paper";

import Spinner from "react-native-loading-spinner-overlay";
import { Card } from "react-native-elements";

import CONFIG from "../common/config.json";

export default class Transaction extends React.Component {
  state = {
    spinner: false,
    invoices: [],
  };
  componentDidMount() {
    let userInfo = JSON.parse(localStorage.getItem("usr"));
    if (userInfo === null) {
      this.setState({ spinner: false });
    } else {
      this.setState({ spinner: true });
      fetch(`${CONFIG.SERVER.URL}/invoices?u=${userInfo.address}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result: any) => {
            result=result.map((invoice:any)=>{
                const company = CONFIG.COMPANY_LIST.find(
                    (item) => item.value === invoice.company_id
                  );
                  if(company){
                      invoice.companyName=company.label;
                  }
                  return invoice;
            })
          this.setState({
            invoices: result,
            spinner: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({ spinner: false });
        });
    }
  }

  renderTableData() {
    return this.state.invoices.map((invoice: any, index) => {
      return (
        <DataTable.Row key={invoice.id}>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            {invoice.companyName}
          </DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            {invoice.celo_amount}
          </DataTable.Cell>
        </DataTable.Row>
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
        <Card containerStyle={styles.card}>
          <DataTable style={{ width: 400, height: 200, overflow: "scroll" }}>
            <DataTable.Header>
              <DataTable.Title style={{ justifyContent: "center" }}>
                Company
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                cUSD
              </DataTable.Title>
            </DataTable.Header>
            {this.renderTableData()}
            {/* <DataTable.Pagination
          page={1}
          numberOfPages={3}
          onPageChange={(page) => {
            console.log(page);
          }}
          label="1-2 of 6"
        /> */}
          </DataTable>
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
    //   width: 420,
    alignItems: "center",
    borderRadius: 5,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
