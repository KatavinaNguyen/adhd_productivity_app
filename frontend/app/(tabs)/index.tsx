import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

GoogleSignin.configure({
  webClientId: '1061066222675-jvt6ob80rvjuva0qknmhnh76gf5jve6i.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: '1061066222675-gjbsfevvduqbbv499i15i92ir1bm3o2a.apps.googleusercontent.com',
});

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<any>(null); // ✅ Correct state

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In button pressed");
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();  // ✅ Correct response type
      console.log("User Info:", user);

      setUserInfo(user); // ✅ Store user info in state

      // Extract the ID Token
      const { data } = user;
      const { idToken } = data;
      if (!idToken) {
        throw new Error("ID Token is missing from Google Sign-In response");
      }

      console.log("ID Token:", idToken);

      // Send the ID Token to your backend
      const backendUrl = "http://10.0.0.225:3000/auth/google"; // Replace with your actual backend URL
      const responseFromBackend = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      //response from backend after receiving idToken
      const result = await responseFromBackend.json();
      console.log("Response from backend:", result);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
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
      <GoogleSigninButton size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={handleGoogleSignIn} />
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
});
