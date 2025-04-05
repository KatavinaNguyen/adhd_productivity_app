import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set up Google Sign-In configuration
GoogleSignin.configure({
  webClientId: '1061066222675-jvt6ob80rvjuva0qknmhnh76gf5jve6i.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: '1061066222675-gjbsfevvduqbbv499i15i92ir1bm3o2a.apps.googleusercontent.com',
});

// HomeScreen component with animation
export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  // Set up animation references for all elements
  const slideAnimTitle = useRef(new Animated.Value(100)).current;
  const slideAnimLogo = useRef(new Animated.Value(100)).current;
  const slideAnimSubtitle = useRef(new Animated.Value(100)).current;

  // Handle Google Sign-In button press
  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In button pressed");
    await GoogleSignin.signOut(); // Sign out from any previous sessions
    try {
      await GoogleSignin.hasPlayServices(); // Check if Google Play Services are available
      const user = await GoogleSignin.signIn(); // Sign in the user
      console.log("User Info:", user);

      setUserInfo(user); // Set user info state

      // Get the tokens for authentication
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error("ID Token is missing from Google Sign-In response");
      }
      if (!accessToken) {
        throw new Error("Access Token is missing from Google-Sign In response.");
      }

      console.log("ID Token:", idToken);

      // Save the access token in AsyncStorage
      await AsyncStorage.setItem('accessToken', accessToken);

      // Navigate to the ScheduleScreen after successful sign-in
      router.push("/ScheduleScreen");

    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log("Sign-in is already in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log("Play Services not available or outdated");
            break;
          default:
            console.log("Google Sign-In Error:", error);
        }
      } else {
        console.log("Unknown error:", error);
      }
    }
  };

  // This section loads everything in a float-up effect at different timings
  useEffect(() => {
    Animated.timing(slideAnimTitle, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnimLogo, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnimSubtitle, {
      toValue: 0,
      duration: 1400,
      useNativeDriver: true,
    }).start();

  }, [slideAnimTitle, slideAnimLogo, slideAnimSubtitle]);

  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Animated.Text style={[styles.title, { transform: [{ translateY: slideAnimTitle }] }]}>
          TINY TASKS
        </Animated.Text>
        <Animated.View style={[styles.iconContainer, { transform: [{ translateY: slideAnimLogo }] }]}>
          <Image
            source={require('../../assets/images/favicon.png')}
            style={styles.logoImage}
          />
        </Animated.View>
        <Animated.Text style={[styles.subtitle, { transform: [{ translateY: slideAnimSubtitle }] }]}>
          ADHD PRODUCTIVITY APP
        </Animated.Text>
      </View>

      {/* Google Sign-In Button */}
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn} // Trigger Google Sign-In
      />
    </View>
  );
}


// Styles for components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F3",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 10,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 20,
    color: "#333",
    fontStyle: "italic",
    textAlign: 'center',
    marginTop: 10,
  },
  googleButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
