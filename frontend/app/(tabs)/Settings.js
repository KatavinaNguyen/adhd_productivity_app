import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logged out", "You have been logged out.");
  };

  const handleHelp = () => {
    Alert.alert(
      "Help & Support",
      "For support, feedback, or questions:\n\n📧 support@tinytasks.com\n\n🌐 tinytasks.com"
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      "Privacy Policy",
      "We respect your privacy. Your data is stored securely and never shared without your consent. For full details, visit tinytasks.com/privacy."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Push Notifications</Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            thumbColor={pushEnabled ? "#FF7F50" : "#ccc"}
            trackColor={{ false: "#eee", true: "#FFDAB9" }}
          />
        </View>

        <TouchableOpacity style={styles.optionButton} onPress={handleHelp}>
          <Text style={styles.optionText}>Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={handlePrivacy}>
          <Text style={styles.optionText}>Privacy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dashboardButton} onPress={() => router.push("/ScheduleScreen")}>
        <Text style={styles.dashboardText}>Return to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBEA",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    color: "#333",
  },
  optionButton: {
    backgroundColor: "#F3F3F3",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#444",
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#3d3d3d",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  dashboardButton: {
    marginTop: 20,
    backgroundColor: "#FF7F50",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  dashboardText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default Settings;
