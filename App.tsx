import React from "react";
import Navbar from "./src/app/screens/Navbar";
// import AppContainer from "./src/app/navigations/Navigation";
import Routes from "./src/app/Routes";
import { StyleSheet, View } from "react-native";
const App = () => {
  return (
    <>
      <Navbar/>
    <View style={styles.MainContainer}>
        <Routes />
        </View>
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
