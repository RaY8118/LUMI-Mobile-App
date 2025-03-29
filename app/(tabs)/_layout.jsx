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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
            headerTitle: "",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
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
          name="psettings"
          redirect={role !== "PAT"}
          options={({ navigation }) => ({
            headerTitle: "Tutorials",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Tutorials",
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="play-video"
                color={color}
                size={size}
                library="Foundation"
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
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
