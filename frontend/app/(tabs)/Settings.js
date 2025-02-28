import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from 'expo-router';

const Settings = () => {
  const router = useRouter();
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
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Settings List */}
      <View style={styles.section}>
      <TouchableOpacity style={styles.listButton}>
            <Text style={styles.listText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listButton}>
            <Text style={styles.listText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.listButton}>
            <Text style={styles.listText}>Other</Text>
        </TouchableOpacity>
      </View>

      {/* Home Button */}
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/ScheduleScreen")}>
                <Text style={styles.actionButtonText}>Return to Dashboard</Text>
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
    padding: 23,
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
  listButton: {
    backgroundColor: "#ECECEC",
    paddingVertical: 25,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  listText: {
    fontSize: 18,
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
    bottom: 0,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Settings;
