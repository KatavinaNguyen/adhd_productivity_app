import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

GoogleSignin.configure({
  webClientId: '1061066222675-jvt6ob80rvjuva0qknmhnh76gf5jve6i.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: '1061066222675-gjbsfevvduqbbv499i15i92ir1bm3o2a.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

export default function HomeScreen() {
  const router = useRouter();
  let currentUser = null;

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In button pressed");
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      currentUser = response.data;
      console.log(currentUser);
      router.push("/ScheduleScreen");
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log(error);
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


