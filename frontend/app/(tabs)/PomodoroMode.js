import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PomodoroMode = () => {
  const router = useRouter();

  const pomodoroMin = 0.25;
  const breakMin = 0.05;

  const [isPomodoro, setIsPomodoro] = useState(true);
  const [timer, setTimer] = useState(pomodoroMin * 60);
  const [isRunning, setIsRunning] = useState(false);

  const isPomodoroRef = useRef(isPomodoro);
  isPomodoroRef.current = isPomodoro; // keep the ref in sync

  useEffect(() => {
    let interval;

    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timer === 0) {
      const nextMode = !isPomodoroRef.current;
      setIsPomodoro(nextMode);
      setTimer(nextMode ? pomodoroMin * 60 : breakMin * 60);
    }

    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const startPauseTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimer(isPomodoro ? pomodoroMin * 60 : breakMin * 60);
  };

  const switchMode = (mode) => {
    setIsPomodoro(mode);
    setTimer(mode ? pomodoroMin * 60 : breakMin * 60);

    // if the timer is running, keep it running after switch
    setIsRunning((prev) => prev);
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

        {/* Mode Switch (now works even if running) */}
        <View style={styles.modeSwitch}>
          <TouchableOpacity
            style={[styles.modeButton, isPomodoro ? styles.activeMode : styles.inactiveMode]}
            onPress={() => switchMode(true)}
          >
            <Text
              style={[styles.modeText, isPomodoro ? styles.activeModeText : styles.inactiveModeText]}
            >
              Pomodoro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, !isPomodoro ? styles.activeMode : styles.inactiveMode]}
            onPress={() => switchMode(false)}
          >
            <Text
              style={[styles.modeText, !isPomodoro ? styles.activeModeText : styles.inactiveModeText]}
            >
              Break
            </Text>
          </TouchableOpacity>
        </View>

        {/* Start, Pause, and Reset Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.startButton} onPress={startPauseTimer}>
            <Text style={styles.startButtonText}>{isRunning ? "Pause" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
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
