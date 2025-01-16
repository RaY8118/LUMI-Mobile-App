import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Icon } from "@/constants/Icons";
import { useUser } from "@/hooks/useUser";
const TabsLayout = () => {
  const { role } = useUser();
  return (
    <>
      <StatusBar backgroundColor="" style="dark" />
      <Tabs>
        <Tabs.Screen
          name="reminders"
          redirect={role !== "PAT"}
          options={({ navigation }) => ({
            headerTitle: "Reminders",
            title: "Reminders",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="tasks"
                color={color}
                size={size}
                library="FontAwesome5"
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
          redirect={role !== "PAT"}
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
          redirect={role !== "PAT"}
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
          redirect={role !== "PAT"}
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
          name="cgreminders"
          redirect={role !== "CG"}
          options={({ navigation }) => ({
            headerTitle: "CG Reminders",
            title: "CG Reminders",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="tasks"
                color={color}
                size={size}
                library="FontAwesome5"
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
          name="cgmaps"
          redirect={role !== "CG"}
          options={({ navigation }) => ({
            headerTitle: "CG Map",
            title: "CG Map",
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
          name="cgchat"
          redirect={role !== "CG"}
          options={({ navigation }) => ({
            headerTitle: "CG Chat",
            title: "CG Chat",
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
          name="settings"
          redirect={role !== "CG"}
          options={({ navigation }) => ({
            headerTitle: "Settings",
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="settings"
                color={color}
                size={size}
                library="Ionicons"
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
