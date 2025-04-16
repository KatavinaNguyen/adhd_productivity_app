import React, { useState, useEffect } from "react";
import { Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Settings = () => {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert("Logged out", "You have been logged out.");
    router.replace('/');
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

  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  // Add new section

  // Animated values for accordion expansion
  const accountHeight = useState(new Animated.Value(0))[0];
  const notificationsHeight = useState(new Animated.Value(0))[0];
  const helpHeight = useState(new Animated.Value(0))[0];
  // Add new section value

  const today = new Date();
  const [givenHalfTime, setGivenHalfTime] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0)
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  
  const [tempHalfTime, setTempHalfTime] = useState(givenHalfTime);
  const displayHalfTime = tempHalfTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });  

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

  React.useEffect(() => {
    const loadHalfTime = async () => {
      try {
        const storedTime = await AsyncStorage.getItem('halfTime');
        if (storedTime) {
          const parsedTime = new Date(storedTime);
          setGivenHalfTime(parsedTime);
          setTempHalfTime(parsedTime);
          console.log("Loaded half-time from storage:", parsedTime);
        }
      } catch (error) {
        console.error("Error loading half-time from storage:", error);
      }
    };
  
    loadHalfTime();
  }, []);  

  const storeHalfTime = async (selectedHalfTime) => {
    try {
      await AsyncStorage.setItem('halfTime', selectedHalfTime.toISOString());
      console.log("Half-day time saved:", selectedHalfTime);
    } catch (error) {
      console.error("Error changing half-day time: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Exit */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.exitButton]}
                onPress={() => setModalVisible(false) }
              >
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
          {/* Title */}
          <Text style={styles.modalTitle}>Half-Day Mark</Text>
          {/* Time Selection Modal */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.timeButton} onPress={() => {
                setTempHalfTime(givenHalfTime);
                setTimePickerOpen(true);
              }}>
                <Text style={styles.buttonText}>{displayHalfTime}</Text>
                {/* START TIME */}
                <DatePicker
                  modal
                  open={timePickerOpen}
                  date={tempHalfTime}
                  mode="time"
                  minuteInterval={60}
                  minimumDate = {new Date(today.getFullYear(), today.getMonth(), today.getDate(), 1, 0, 0, 0)}
                  maximumDate = {new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0, 0, 0)}
                  onConfirm={(selectedTime) => {
                    setTimePickerOpen(false);
                    setTempHalfTime(selectedTime);
                }}
                onCancel={() => {setTimePickerOpen(false)}}
                />
              </TouchableOpacity>
            </View>
          {/* Confirmation Button */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                setGivenHalfTime(tempHalfTime);
                storeHalfTime(tempHalfTime);
                setModalVisible(false);
              }}              
            > 
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

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

        <TouchableOpacity style={styles.optionButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.optionText}>Customize Half-Day</Text>
        </TouchableOpacity>

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
    paddingVertical: 16,
    alignItems: "center",
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
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
    elevation: 5,
  },
  dashboardText: {
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: "gray",
    borderRadius: 5,
    height: 35,
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: "#FF7F50",
    flex: 1,
    marginLeft: 5,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 6,
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFFBEA",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
    zIndex: 6,
  },
  exitButton: {
    backgroundColor: "#FF6347",
    height: 30, 
    flex: 1,
    marginLeft: 230,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 3,
    fontWeight: "bold",
    fontSize: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: "gray",
    borderRadius: 5,
    height: 35,
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  confirmButton: {
    backgroundColor: "#FF7F50",
    flex: 1,
    marginLeft: 5,
    borderRadius: 5,
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
