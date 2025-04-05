import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // Wrap the entire Tabs component with GestureHandlerRootView to enable global gesture handling
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            display: 'none', // Hide the bottom tab bar
          },
        }}
      >
        {/* Define your tab screens here */}
      </Tabs>
    </GestureHandlerRootView>
  );
}

/*
~ old ugly nav in case kat wants it back to be faster

           tabBarStyle: Platform.select({
             ios: {
               position: 'absolute',
             },
             default: {},
           }),
         }}
       >
       </Tabs>
     </GestureHandlerRootView>
   );
 }
 */