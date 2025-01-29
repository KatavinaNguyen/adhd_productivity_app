import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const FocusMode = () => {
  return (
    <View style={styles.container}>
      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Pomo</Text>
        </TouchableOpacity>
      </View>

      {/* Motivational Banner */}
      <View style={styles.banner}>
        <Text style={styles.motivationalText}>GREAT</Text>
        <Image
          source={require("../../assets/images/hamster.png")} 
          style={styles.bannerImage}
        />
        <Text style={styles.taskText}>homework 1</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.finishedButton}>
        <Text style={styles.buttonText}>Finished!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exitButton}>
        <Text style={styles.exitButtonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEA",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#FFEFD5",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "#FF7F50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  banner: {
    backgroundColor: "#FFD580",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  motivationalText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 10,
  },
  bannerImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 18,
    color: "#333",
    backgroundColor: "#FFF",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: "center",
  },
  finishedButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  exitButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  exitButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default FocusMode;
