import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
// import { Header } from "react-native-elements";
// import { SafeAreaProvider } from "react-native-safe-area-context";

export default class Navbar extends Component {
  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Honoro</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor:"#673ab7",
    alignItems: "center",
    justifyContent: "center",

  },
  text:{
      color:"white",
      fontSize:24,
      fontWeight:"500"
  }
});
