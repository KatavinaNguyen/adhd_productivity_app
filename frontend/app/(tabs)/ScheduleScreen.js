import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ScheduleScreen = () => {
  // Get the current date
  const today = new Date();
  
  // Format the current date as "DAY MON DD, YYYY"
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).toUpperCase();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity Link href="/HomeScreen" style={styles.headerIcon}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity>
            <Text Link href="/FocusMode" style={styles.iconText}>⏱️</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.iconText}>📓</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.iconText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Full Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Half Day</Text>
        </TouchableOpacity>
      </View>

      {/* Current Date */}
      <Text style={styles.dateText}>{formattedDate}</Text>

      {/* Time Slots */}
      <ScrollView contentContainerStyle={styles.timeContainer}>
        {generateTimeSlots().map((time, index) => (
          <View key={index} style={styles.timeSlot}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Function to Generate Flat Hour Time Slots (12:00 AM to 11:00 PM)
const generateTimeSlots = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour === 0
      ? "12:00 AM"
      : hour === 12
      ? "12:00 PM"
      : hour > 12
      ? `${hour - 12}:00 PM`
      : `${hour}:00 AM`;
    times.push(formattedHour);
  }
  return times;
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerIcon: {
    backgroundColor: "#ECECEC",
    borderRadius: 8,
    padding: 8,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  iconText: {
    fontSize: 18,
    color: "#333",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ECECEC",
  },
  activeTab: {
    backgroundColor: "#FFEFD5",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#FF7F50",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#FF7F50",
    textAlign: "center",
    marginBottom: 16,
  },
  timeContainer: {
    paddingBottom: 20,
  },
  timeSlot: {
    borderBottomWidth: 1,
    borderBottomColor: "#FF7F50",
    height: 120,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 12,
    color: "#333",
  },
});

export default ScheduleScreen;
