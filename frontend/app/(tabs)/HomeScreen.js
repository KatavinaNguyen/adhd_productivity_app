import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = () => {
  const handleGoogleSignIn = () => {
    // Logic for Google Sign-In goes here
    console.log("Google Sign-In button pressed");
  };
 
  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Text style={styles.title}>TINY TASKS</Text>
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Text style={styles.checkmark}>✔</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>ADHD PRODUCTIVITY APP</Text>
      </View>

      {/* Google Sign-In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image
          source={require('../../assets/images/google.png')}
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>
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
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    elevation: 2,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#333",
  },
});

export default HomeScreen;
