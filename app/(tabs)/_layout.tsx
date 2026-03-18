import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

// import { Stack } from "expo-router";
// import '../db';

// export default function RootLayout() {
//   return <Stack />;
// }


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#25292e',
                    borderTopColor: '#3a3f47',
                },
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#888888',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerTintColor: '#ffffff',
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Scan',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="line-scan" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='add-route'
                options={{
                    title: 'Add Route',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons size={28} name='add' color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='map'
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons size={28} name='map' color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}