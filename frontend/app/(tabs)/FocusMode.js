import React, { useState, useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const FocusMode = () => {
  const router = useRouter();

  // State for task and display
  const [task, setTask] = useState("homework 1");
  const [showGreatText, setShowGreatText] = useState(false);

  // Animation for rotating clock-like circle
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Function to handle "Finished!" button press
  const handleFinished = () => {
    setShowGreatText(true); // Show "GREAT" text
    setTimeout(() => {
      setShowGreatText(false); // Hide "GREAT" text after 2 sec
      setTask("homework 1"); // Reload the task - dummy value homework 1
    }, 2000);
  };

  // Rotate animation to simulate clock hands
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000, // 1 sec rotation
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push("/PomodoroMode")}>
          <Text style={styles.tabText}>Pomo</Text>
        </TouchableOpacity>
      </View>

      {/* Motivational Banner */}
      <View style={styles.banner}>
        {/* Show "GREAT" only when the button is clicked */}
        {showGreatText && <Text style={styles.greatText}>GREAT</Text>}

        {/* Rotating Circle */}
        <Animated.View
          style={[styles.clockContainer, { transform: [{ rotate: rotateInterpolation }] }]}
        >
          <View style={styles.clockHand} />
        </Animated.View>

        <Text style={styles.taskText}>{task}</Text> {/* Display current task */}

      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.finishedButton} onPress={handleFinished}>
        <Text style={styles.buttonText}>Finished!</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exitButton} onPress={() => router.push("/ScheduleScreen")}>
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
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#FFEFD5",
    borderRadius: 25,
    marginHorizontal: 10,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: "#FF7F50",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  banner: {
    backgroundColor: "#FFD580",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  motivationalText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 15,
  },
  clockContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "#FF7F50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#FFF3E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  clockHand: {
    width: 4,
    height: 50,
    backgroundColor: "#FF7F50",
    position: "absolute",
    top: 15,
    borderRadius: 2,
  },
  taskText: {
    fontSize: 18,
    color: "#333",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  greatText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#447abd",
    marginTop: 10,
    textAlign: "center",
    animation: "fadeIn 2s ease-out",
  },
  finishedButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
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
    elevation: 3,
  },
  exitButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default FocusMode;
