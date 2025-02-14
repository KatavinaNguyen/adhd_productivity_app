import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DailyReflection = () => {
  const tasks = [
    "Data Structures HW",
    "Grocery Shopping",
    "Team Meeting",
    "Walk the Dog",
    "Volunteer Shift",
    "Library Book Return",
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Daily Reflection</Text>
      </View>

      {/* Focus Mode Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Focus Mode</Text>
        <ScrollView contentContainerStyle={styles.taskList}>
          {tasks.map((task, index) => (
            <TouchableOpacity key={index} style={styles.taskButton}>
              <Text style={styles.taskText}>{task}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Rewards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewards</Text>
        <View style={styles.rewardsContainer}>
          {Array(12)
            .fill()
            .map((_, index) => (
              <Image
                key={index}
                source={require("../../assets/images/reward-icon.png")} 
                style={styles.rewardImage}
              />
            ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Download PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity Link href="/ScheduleScreen" style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Load New Day</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 12,
  },
  taskList: {
    flexDirection: "column",
    gap: 10,
  },
  taskButton: {
    backgroundColor: "#ECECEC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  taskText: {
    fontSize: 14,
    color: "#333",
  },
  rewardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  rewardImage: {
    width: 40,
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default DailyReflection;
