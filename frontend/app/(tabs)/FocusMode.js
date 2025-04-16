import React, { useState, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const FocusMode = () => {
  const router = useRouter();

  const tasks = ['Submit HW2', 'Do laundry', 'Group Project Meeting', 'Study for midterm'];
  const motivators = ["GREAT!", "Keep going!", "You got this!", "Focus mode ON", "Nice work!"];

  const [taskIndex, setTaskIndex] = useState(0);
  const [showMotivator, setShowMotivator] = useState(false);
  const [motivatorText, setMotivatorText] = useState("GREAT!");

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '0deg'],
  });

  const handleFinished = () => {
    const randomMotivator = motivators[Math.floor(Math.random() * motivators.length)];
    setMotivatorText(randomMotivator);
    setShowMotivator(true);

    scaleAnim.setValue(0);
    fadeAnim.setValue(0);
    flipAnim.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowMotivator(false);
      slideAnim.setValue(-300);
      setTaskIndex((prev) => {
        const nextIndex = (prev + 1) % tasks.length;
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          speed: 12,
          bounciness: 12,
        }).start();
        return nextIndex;
      });
    }, 2000);
  };

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
        {showMotivator && (
          <Animated.Text
            style={[
              styles.greatText,
              {
                transform: [{ scale: scaleAnim }, { rotateY: rotateY }],
                opacity: fadeAnim,
                backfaceVisibility: 'hidden',
                position: 'absolute',
                top: 35,
              },
            ]}
          >
            {motivatorText}
          </Animated.Text>
        )}

        {/* Hamster GIF */}
        <Image
          source={require("assets/images/hamstergif.gif")}
          style={styles.gifStyle}
        />

        {/* Sliding Task Text */}
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <Text style={styles.taskText}>{tasks[taskIndex]}</Text>
        </Animated.View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.finishedButton} onPress={handleFinished}>
        <Text style={styles.buttonText}>Finished!</Text>
      </TouchableOpacity>

      {/* Exit Button */}
      <TouchableOpacity style={styles.exitButton} onPress={() => router.push("/ScheduleScreen")}>
        <Ionicons name="exit-outline" size={24} color="#FFF" />
        <Text style={styles.exitButtonText}>Exit</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 30,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#FFEFD5",
    borderRadius: 25,
    marginHorizontal: 10,
    elevation: 5,
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
    borderRadius: 8,
    paddingTop: 80,
    paddingBottom: 80,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  greatText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#447abd",
    textAlign: "center",
  },
  gifStyle: {
    width: 250,
    height: 250,
    borderRadius: 90,
    marginBottom: 20,
  },
  taskText: {
    fontSize: 22,
    color: "#333",
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 10,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
  finishedButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  exitButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  exitButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default FocusMode;
