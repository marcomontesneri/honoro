import React from "react";
import {
  StyleSheet,
  View
} from "react-native";

export default class Check extends React.Component<any, any> {

  render() {
    return (
      <View style={styles.container}>
          {localStorage.getItem('usr')}
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
  }
});
