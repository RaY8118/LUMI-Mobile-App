import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Icon } from "@/constants/Icons";
const TabsLayout = () => {
  return (
    <>
      <StatusBar backgroundColor="" style="dark" />
      <Tabs>
        <Tabs.Screen
          name="reminders"
          options={({ navigation }) => ({
            headerTitle: "Reminders",
            title: "Reminders",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="home"
                color={color}
                size={size}
                library="MaterialCommunityIcons"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="map"
          options={({ navigation }) => ({
            headerTitle: "Maps",
            title: "Maps",
            tabBarIcon: ({ color, size }) => (
              <Icon name="map" color={color} size={size} library="Entypo" />
            ),
            headerRight: () => (
              <Icon
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="chat"
          options={({ navigation }) => ({
            headerTitle: "Chat Room",
            title: "Chat",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="chat"
                color={color}
                size={size}
                library="MaterialCommunityIcons"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="camera"
          options={({ navigation }) => ({
            headerTitle: "Camera",
            title: "Camera",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="camera"
                color={color}
                size={size}
                library="MaterialCommunityIcons"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-circle-outline"
                size={30}
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("profile")}
                library="Ionicons"
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
