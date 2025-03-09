import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Pressable, TextInput, Touchable } from "react-native";
import { useRouter } from "expo-router";
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScheduleScreen = () => {
  // Navigation + Visuals
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(0));
  const [modalVisible, setModalVisible] = useState(false);

  // Task Creation Details
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);

  // Priority Setting
  // Google Calendar color ids: 2 = green, 5 = yellow, 4 = red
  const [selectedPriority, setSelectedPriority] = useState(2);
  const handlePriority = (buttonId) => {
    setSelectedPriority(buttonId);
    setPriority(buttonId);
  }
  const priorityButtons = [
    { id: 2, label: '!' },
    { id: 5, label: '!!' },
    { id: 4, label: '!!!' },
  ];

  // Time Setting (dates in UTC)
  const givenHalfTime = 18; //in 24hrs
  const today = new Date();
  const [startTime, setStartTime] = useState(new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    today.getHours() + 1,
    0,
  ));
  const [endTime, setEndTime] = useState(new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    startTime.getHours() + 1,
    0,
  ));
  const [startPickerOpen, setStartPickerOpen] = useState(false);
  const [endPickerOpen, setEndPickerOpen] = useState(false);
  const displayStart = startTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });
  const displayEnd = endTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });
  // Format the current date as "DAY MON DD, YYYY"
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).toUpperCase();

  // Displays tasks as a card
  const Card = ({children}) => (
    <View style={styles.taskCard}>
      {children}
    </View>
  );

  // Handles task creation
  createTask = async () => {
    try {
      const checkOverlap = tasks.some((task) => {
        return (
          (startTime <= task.start && endTime >= task.end) ||
          (startTime >= task.start && startTime < task.end) ||
          (endTime > task.start && endTime <= task.end)
        );
      });

      if (checkOverlap) {
        alert("Overlap Error -- Please select another time slot");
        return;
      }
  
      const newTask = {
        id: tasks.length + 1,
        name: taskName, 
        description: description, 
        priority: priority,
        start: startTime, 
        end: endTime
      };

      await createGoogleCalendarEvent();
      setTasks([...tasks, newTask]);

    } catch (error) {
      console.error("Error occurred: ", error);
    }

    // Resets settings for a new task to be created
    setTaskName("");
    setDescription("Description");
    setPriority(2);
    setSelectedPriority(2);
    setStartTime(new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1, 0,));
    setEndTime(new Date(today.getFullYear(), today.getMonth(), today.getDate(), startTime.getHours() + 1, 0,));
    setModalVisible(false);
  };

  const createGoogleCalendarEvent = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    const eventDetails = {
      summary: taskName,
      description: description,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      colorId: priority,
    };       
    try {
      const response = await fetch("http://10.0.2.2:3000/google/calendar/schedule_event", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });        
  
      const result = await response.json();
      if (response.ok) {
        console.log("Event created!", result);
      } else {
        console.error("Error with the response:", result);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/index")}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => router.push("/FocusMode")}>
            <Text style={styles.iconText}>⏱️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/StampBook")}>
            <Text style={styles.iconText}>📓</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.iconText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Settings")}>
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Adding Task Modal */}
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
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Title */}
            <Text style={styles.modalTitle}>Create a Task</Text>
            {/* Text Input */}
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              value={taskName}
              onChangeText={setTaskName}
            />
            <View style={styles.buttonRow}>
            {priorityButtons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={[
                  styles.priorityButton,
                  selectedPriority === button.id && styles.selectedPriority,
                ]}
                onPress={() => handlePriority(button.id)}
              >
                <Text style={styles.priorityText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
            </View>
            {/* Time Selection Modal */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.timeButton} onPress={() => setStartPickerOpen(true)}>
                <Text style={styles.buttonText}>{displayStart}</Text>
              <DatePicker
                modal
                open={startPickerOpen}
                date={startTime}
                mode="time"
                //Once user clicks on endtime they CANNOT pick a time before the current one
                minimumDate = {new Date()}
                onConfirm={(selectedStartTime) => {
                  setStartPickerOpen(false);
                  setStartTime(selectedStartTime);
                  if (selectedStartTime >= endTime) {
                    setEndTime(new Date(selectedStartTime.getTime() + 60000));
                  }
                }}
                onCancel={() => {setStartPickerOpen(false)}}
              />
              </TouchableOpacity>
              <Text style={styles.toText}>to</Text>
              <TouchableOpacity style={styles.timeButton} onPress={() => setEndPickerOpen(true)}>
                <Text style={styles.buttonText}>{displayEnd}</Text>
              <DatePicker
                modal
                open={endPickerOpen}
                date={endTime}
                mode="time"
                minimumDate = {new Date(startTime.getTime() + 60000)}
                onConfirm={(selectedEndTime) => {
                  setEndPickerOpen(false);
                  setEndTime(selectedEndTime);
                }}
                onCancel={() => {setEndPickerOpen(false)}}
              />
              </TouchableOpacity>
            </View>
            {/* Description */}
            <TextInput
              style={styles.description}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            {/* Confirmation Button */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  createTask();
                  createGoogleCalendarEvent();
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => setTimeSlots(generateTimeSlots(0))}>
          <Text style={[styles.tabText, styles.activeTabText]}>Full Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setTimeSlots(generateTimeSlots(givenHalfTime))}>
          <Text style={styles.tabText}>Half Day</Text>
        </TouchableOpacity>
      </View>

      {/* Current Date */}
      <Text style={styles.dateText}>{formattedDate}</Text>

      {/* Time Slots */}
      <ScrollView contentContainerStyle={styles.timeContainer}>
        {timeSlots.map((time, index) => {
          //time = XX:XX AM/PM
          const [hourMinute, period] = time.split(" ");
          const [hour, minute] = hourMinute.split(":").map(Number);

          // Converting to 24hr time
          let currentHour = hour;
          if (period === "PM" && hour !== 12) currentHour += 12;
          if (period === "AM" && hour === 12) currentHour = 0;

          const matchTaskTime = tasks.filter((task) => {
            return (task.start).getHours() === currentHour;
          });

          return (
            <View key={index} style={styles.timeSlot}>
              <Text style={styles.timeText}>{time}</Text>

              {/* Display tasks within the same hour */}
              {matchTaskTime.length > 0 ? (
                matchTaskTime.map((task) => (
                  <View key={task.id} style={styles.taskContainer}>
                    <Card>
                      <Text style={styles.taskText}>{task.name}</Text>
                    </Card>
                  </View>
                ))
              ) : (
                <></>
              )}
            </View>
          );
        })}
        {/* End Day Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/DailyReflection")}>
            <Text style={styles.actionButtonText}>End Day</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const generateTimeSlots = ( startTime ) => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour === 0
      ? "12:00 AM"
      : hour === 12
      ? "12:00 PM"
      : hour > 12
      ? `${hour - 12}:00 PM`
      : `${hour}:00 AM`;
    if (hour >= startTime) {
      times.push(formattedHour);
    }
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
    marginTop: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 50,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#FFFBEA",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
  confirmButton: {
    backgroundColor: "#FF7F50",
    flex: 1,
    marginLeft: 5,
    borderRadius: 5,
  },
  priorityButton: {
    backgroundColor: "white",
    height: 40, 
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 10,
  }, 
  selectedPriority: {
    borderColor: 'green',
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 30,
    textAlign: "center",
  },
  timeButton: {
    backgroundColor: "gray",
    borderRadius: 5,
    height: 35,
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 20,
  },
  toText: {
    color: "gray",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 20,
  },
  description: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 100,
  },
  taskCard: {
    backgroundColor: '#f0eded',
    borderRadius: 10,
    margin: 5,
    padding: 16,
  }
});

export default ScheduleScreen;
