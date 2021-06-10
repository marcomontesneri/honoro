import React from "react";
import Navbar from "./src/app/screens/Navbar";
import Routes from "./src/app/Routes";
import { StyleSheet, View } from "react-native";
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <>
      <Navbar/>
    <View style={styles.MainContainer}>
        <Routes />
        </View>
        {/* GLOBAL FLASH MESSAGE COMPONENT INSTANCE */}
        <FlashMessage position="top" /> {/* <--- here as last component */}
    </>
  );
};
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    // Set content's vertical alignment.
    justifyContent: "center",
    // Set content's horizontal alignment.
    alignItems: "center",
    // Set hex color code here.
    backgroundColor: "#e8ebf4",
  },
});
export default App;
