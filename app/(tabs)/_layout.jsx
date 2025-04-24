import React from "react";
import { Tabs, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Icon } from "@/constants/Icons";
import { useUser } from "@/hooks/useUser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const { role } = useUser();
  const insets = useSafeAreaInsets()
  return (
    <>
      <StatusBar backgroundColor="" style="dark" />
      <Tabs
        screenOptions={{
          headerTintColor: "violet",
          tabBarStyle: {
            position: 'absolute',
            bottom: insets.bottom + 12,
            left: 16,
            right: 16,
            height: 70,
            borderRadius: 24,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
            padding: 6
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 700
          }
        }}>
        <Tabs.Screen
          name="reminders"
          redirect={role !== "PAT"}
          options={() => ({
            headerTitle: "Reminders",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Reminders",
            tabBarIcon: ({ color }) => (
              <Icon
                name="tasks"
                color={color}
                size={32}
                library="FontAwesome5"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="map"
          redirect={role !== "PAT"}
          options={() => ({
            headerTitle: "Maps",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Maps",
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-o"
                color={color}
                size={size}
                library="FontAwesome" />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={36}
                style={{ marginRight: 15 }}
                onPress={() => router.push("profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="chat"
          redirect={role !== "PAT"}
          options={() => ({
            headerTitle: "Chat Room",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <Icon
                name="chat"
                color={color}
                size={32}
                library="Entypo"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="camera"
          redirect={role !== "PAT"}
          options={() => ({
            headerTitle: "Camera",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Camera",
            tabBarIcon: ({ color }) => (
              <Icon
                name="camera"
                color={color}
                size={32}
                library="MaterialCommunityIcons"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="cgreminders"
          redirect={role !== "CG"}
          options={() => ({
            headerTitle: "CG Reminders",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "CG Reminders",
            tabBarIcon: ({ color }) => (
              <Icon
                name="tasks"
                color={color}
                size={32}
                library="FontAwesome5"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="cgmaps"
          redirect={role !== "CG"}
          options={() => ({
            headerTitle: "CG Map",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "CG Map",
            tabBarIcon: ({ color, size }) => (
              <Icon name="map-o" color={color} size={size} library="FontAwesome" />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="cgchat"
          redirect={role !== "CG"}
          options={() => ({
            headerTitle: "CG Chat",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "CG Chat",
            tabBarIcon: ({ color }) => (
              <Icon
                name="chat"
                color={color}
                size={32}
                library="Entypo"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="settings"
          redirect={role !== "CG"}
          options={() => ({
            headerTitle: "",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Icon
                name="settings"
                color={color}
                size={32}
                library="Ionicons"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
        <Tabs.Screen
          name="tutorial"
          redirect={role !== "PAT"}
          options={() => ({
            headerTitle: "Tutorials",
            headerTitleStyle: { fontSize: 30, fontWeight: "bold" },
            title: "Tutorials",
            tabBarIcon: ({ color }) => (
              <Icon
                name="play-video"
                color={color}
                size={32}
                library="Foundation"
              />
            ),
            headerRight: () => (
              <Icon
                name="person-outline"
                size={32}
                style={{ marginRight: 15 }}
                onPress={() => router.push("/profile")}
                library="Ionicons"
              />
            ),
          })}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
