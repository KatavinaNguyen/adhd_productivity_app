import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const HomeScreen = () => {
  const handleGoogleSignIn = () => {
    console.log("Google Sign-In button pressed");
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
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
          }}
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

export default HomeScreen;
