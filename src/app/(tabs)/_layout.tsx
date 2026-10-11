import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Tabs } from "expo-router";
export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                tabBarStyle: {
                    backgroundColor: "#101C28",
                    borderTopWidth: 0,
                    height: 65,
                },

                tabBarShowLabel: true,
                tabBarActiveTintColor: "#0EA5E9",
                tabBarInactiveTintColor: "#7D8995",

                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6
                            name="house"
                            size={size}
                            color={color}
                            iconStyle="solid"
                        />
                    ),
                }}

            />

            <Tabs.Screen
                name="explorer"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6
                            name="compass"
                            size={size}
                            color={color}
                            iconStyle="solid"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="analysis"
                options={{
                    title: "Analyze", tabBarIcon: ({ color, size }) => (
                        <FontAwesome6
                            name="chess-knight"
                            size={size}
                            color={color}
                            iconStyle="solid"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="cameraLog"
                options={{
                    title: "Camera",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6
                            name="camera"
                            size={size}
                            color={color}
                            iconStyle="solid"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome6
                            name="user"
                            size={size}
                            color={color}
                            iconStyle="solid"
                        />
                    ),
                }}
            />
        </Tabs>
    );
}