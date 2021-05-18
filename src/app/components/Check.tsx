import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default class Check extends React.Component<any, any> {
  render() {
    return (
      <View style={styles.container}>
        {localStorage.getItem("usr")};
        <TouchableOpacity onPress={() => localStorage.clear()}>
          <Text> Reset </Text>
        </TouchableOpacity>
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
});
