import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from 'expo-router';

const Settings = () => {
  const router = useRouter();

  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  // Add new section

  // Animated values for accordion expansion
  const accountHeight = useState(new Animated.Value(0))[0];
  const notificationsHeight = useState(new Animated.Value(0))[0];
  const helpHeight = useState(new Animated.Value(0))[0];
  // Add new section value

  const toggleAccordion = (section: string) => {
    let heightValue = 0;
    let stateSetter = () => {};

    switch (section) {
      case "account":
        heightValue = accountOpen ? 0 : 100; // Height when expanded
        stateSetter = () => setAccountOpen((prev) => !prev);
        Animated.timing(accountHeight, {
          toValue: heightValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
        break;
      case "notifications":
        heightValue = notificationsOpen ? 0 : 100;
        stateSetter = () => setNotificationsOpen((prev) => !prev);
        Animated.timing(notificationsHeight, {
          toValue: heightValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
        break;
      case "help":
        heightValue = helpOpen ? 0 : 100;
        stateSetter = () => setHelpOpen((prev) => !prev);
        Animated.timing(helpHeight, {
          toValue: heightValue,
          duration: 300,
          useNativeDriver: false,
        }).start();
        break;
       // Add copy for new section

    }
    stateSetter();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Settings List - Accordion */}
      <View style={styles.section}>
        {/* Account Section */}
        <TouchableOpacity style={styles.listButton} onPress={() => toggleAccordion("account")}>
          <Text style={styles.listText}>Account</Text>
        </TouchableOpacity>
        <Animated.View style={{ height: accountHeight, overflow: "hidden" }}>
          <View style={styles.accordionContent}>
            <Text style={styles.accordionText}>Account Settings Content</Text>
          </View>
        </Animated.View>

        {/* Notifications Section */}
        <TouchableOpacity style={styles.listButton} onPress={() => toggleAccordion("notifications")}>
          <Text style={styles.listText}>Manage Notifications</Text>
        </TouchableOpacity>
        <Animated.View style={{ height: notificationsHeight, overflow: "hidden" }}>
          <View style={styles.accordionContent}>
            <Text style={styles.accordionText}>Notifications Settings Content</Text>
          </View>
        </Animated.View>

        {/* Help Section */}
        <TouchableOpacity style={styles.listButton} onPress={() => toggleAccordion("help")}>
          <Text style={styles.listText}>Help</Text>
        </TouchableOpacity>
        <Animated.View style={{ height: helpHeight, overflow: "hidden" }}>
          <View style={styles.accordionContent}>
            <Text style={styles.accordionText}>Help Content</Text>
          </View>
        </Animated.View>
      </View>

      {/* Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/ScheduleScreen")}
        >
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
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  listButton: {
    backgroundColor: "#333",
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "500",
  },
  accordionContent: {
    backgroundColor: "#FFE5B4",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    elevation: 2,
  },
  accordionText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Settings;
