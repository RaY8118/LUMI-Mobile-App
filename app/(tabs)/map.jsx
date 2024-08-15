// import React from "react";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import { StyleSheet, View } from "react-native";

// const INITIAL_REGION = {
//   latitude: 19.135668,
//   longitude: 72.937083,
//   latitudeDelta: 2,
//   longitudeDelta: 2,
// };
// const Map = () => {
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         initialRegion={INITIAL_REGION}
//         showsUserLocation
//         showsMyLocationButton
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: "100%",
//     height: "100%",
//   },
// });

// export default Map;

import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import LocationMap from "../components/Location"; // Adjust the path accordingly

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LocationMap />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
