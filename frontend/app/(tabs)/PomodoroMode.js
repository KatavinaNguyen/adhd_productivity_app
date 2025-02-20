import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';

const PomodoroMode = () => {
  const router = useRouter();

  const [isPomodoro, setIsPomodoro] = useState(true); // Switch between Pomodoro and Break
  const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab} onPress={() => router.push("/FocusMode")}>
          <Text style={styles.tabText}>Focus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Pomo</Text>
        </TouchableOpacity>
      </View>

      {/* Timer Display with Buttons */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timer)}</Text>

        {/* Mode Switch */}
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              isPomodoro ? styles.activeMode : styles.inactiveMode,
            ]}
            onPress={() => setIsPomodoro(true)}
          >
            <Text
              style={[
                styles.modeText,
                isPomodoro ? styles.activeModeText : styles.inactiveModeText,
              ]}
            >
              Pomodoro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              !isPomodoro ? styles.activeMode : styles.inactiveMode,
            ]}
            onPress={() => setIsPomodoro(false)}
          >
            <Text
              style={[
                styles.modeText,
                !isPomodoro ? styles.activeModeText : styles.inactiveModeText,
              ]}
            >
              Break
            </Text>
          </TouchableOpacity>
        </View>

        {/* Start and Reset Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exit Button */}
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
    backgroundColor: "#FFEFD5",
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
  timerContainer: {
    backgroundColor: "#FFF9E5",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 90,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 20,
  },
  modeSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ECECEC",
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeMode: {
    backgroundColor: "#FF7F50",
  },
  inactiveMode: {
    backgroundColor: "#ECECEC",
  },
  modeText: {
    fontSize: 16,
  },
  activeModeText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  inactiveModeText: {
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  startButton: {
    backgroundColor: "#32CD32",
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#333",
    flex: 1,
    marginLeft: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
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

export default PomodoroMode;
