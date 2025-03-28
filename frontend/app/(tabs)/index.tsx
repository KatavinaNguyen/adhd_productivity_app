import { GoogleSignin, GoogleSigninButton, isErrorWithCode, SignInResponse, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

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



export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter(); // ✅ Ensure router is available

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In button pressed");
    await GoogleSignin.signOut();
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log("User Info:", user);

      setUserInfo(user); // ✅ Store user info in state

      // ✅ Fix: Extract ID Token directly
      //const { idToken } = user;
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      if (!idToken) {
        throw new Error("ID Token is missing from Google Sign-In response");
      }
      if (!accessToken) {
        throw new Error("Access Token is missing from Google-Sign In response.");
      }

      console.log("ID Token:", idToken);

      // ✅ Send the ID Token to your backend
      // Local Address for Mac's: http://127.0.0.1:3000/google/calendar/schedule_event
      const backendUrl = "http://10.0.2.2:3000/auth/google";
      const responseFromBackend = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const result = await responseFromBackend.json();
      console.log("Response from backend:", result);

      await AsyncStorage.setItem('accessToken', accessToken);
      
      // ✅ Navigate after successful login
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

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>TINY TASKS</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Text style={styles.checkmark}>✔</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>ADHD PRODUCTIVITY APP</Text>
      </View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F3",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 10,
  },
  iconContainer: {
    marginBottom: 10,
  },
  iconBox: {
    backgroundColor: "#FFD700",
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF7F50",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

