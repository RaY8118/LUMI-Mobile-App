import React from "react";
import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

const TabsLayout = () => {
  return (
    <>
      <StatusBar backgroundColor="" style="dark" />
      <Tabs>
        <Tabs.Screen
          name="main"
          options={({ navigation }) => ({
            headerTitle: "Reminders",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            headerRight: () => (
              <Ionicons
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
              />
            ),
          })}
        />
        <Tabs.Screen
          name="map"
          options={({ navigation }) => ({
            headerTitle: "Maps",
            tabBarIcon: ({ color, size }) => (
              <Entypo name="map" color={color} size={size} />
            ),
            headerRight: () => (
              <Ionicons
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
              />
            ),
          })}
        />
        <Tabs.Screen
          name="chat"
          options={({ navigation }) => ({
            headerTitle: "Chat Room",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chat" color={color} size={size} />
            ),
            headerRight: () => (
              <Ionicons
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
              />
            ),
          })}
        />
        <Tabs.Screen
          name="cameraview"
          options={({ navigation }) => ({
            headerTitle: "Camera",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="camera" color={color} size={size} />
            ),
            headerRight: () => (
              <Ionicons
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
              />
            ),
          })}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarButton: () => null,
            headerTitle: "Profile",
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
