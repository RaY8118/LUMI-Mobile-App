import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LocationMapContainer from "../../utils/LocationMapContainer"; // Adjust the path accordingly

const Map = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LocationMapContainer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Map;
