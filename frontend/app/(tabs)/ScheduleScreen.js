import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Modal, Pressable, TextInput, Touchable } from "react-native";
import { useRouter } from "expo-router";
import DatePicker from 'react-native-date-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  Swipeable  from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { MMKV } from 'react-native-mmkv';
import { verifyToken, createEvent, updateEvent, deleteEvent, listEvents } from "../../server/server";

const tasksStorage = new MMKV();
//key-value pair as follows taskStorage.set('task_id', JSON.stringify(tasks_object));

const ScheduleScreen = () => {
  // Navigation + Visuals
  const router = useRouter();
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Full Day");

  // Task Creation Details
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);
  const [complete, setComplete] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
  const givenHalfTime = 14; //in 24hrs
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

  // Load tasks from local storage

  // Load tasks from Google Calendar

  const getTasksFromGoogleCalendar = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    try {
      const events = await listEvents(accessToken);
      // const tasks = events.map(event => ({
      //   id: event.id,
      //   name: event.summary,
      //   description: event.description,
      //   priority: event.colorId,
      //   start: new Date(event.start.dateTime),
      //   end: new Date(event.end.dateTime),
      //   complete: false,
      // }));
      // setTasks(tasks);
      console.log("Tasks loaded from Google Calendar:\n", events);
      return events;
    } catch (error) {
      console.error("Error loading tasks from Google Calendar:", error);
    }
  };
  // Call this function to load tasks when the component mounts
  React.useEffect(() => {
    const loadTasks = async () => {
      try {
        // const storedTasks = await AsyncStorage.getItem('tasks');
        // if (storedTasks) {
        //   const parsedTasks = JSON.parse(storedTasks);
        //   setTasks(parsedTasks);
        // } else {
        //   console.log("No tasks found in local storage.");
        // }

        let events = await getTasksFromGoogleCalendar();
        //console.log("Tasks loaded from Google Calendar:", events);
      } catch (error) {
        console.error("Error loading tasks from local storage:", error);
      }
    };
    loadTasks();
  }, []);

  // Handles task creation
  const createTask = async () => {
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
        id: null,
        name: taskName, 
        description: description, 
        priority: priority,
        start: startTime, 
        end: endTime, 
        complete: complete,
      };
      
      // Prevents google calendar from creating the event twice
      setTimeout(() => { }, 5000);

      //stores the calendar event's id inside of our task's googleId property
      newTask.id = await createGoogleCalendarEvent(newTask);

      //store tasks in local storage after creating the event in google calendar
      if (newTask.id === null) {
        alert("Failed to create event in Google Calendar. Please try again.");
        return;
      }
      // Store the new task in local storage
      tasksStorage.set(newTask.id, JSON.stringify(newTask));
      console.log("Task stored with id:", newTask.id);
      let taskDet = tasksStorage.getString(newTask.id)
      console.log(JSON.parse(taskDet));

      const newTasks = [...tasks, newTask].sort((a,b) => new Date(a.start) - new Date(b.start));   
      setTasks(newTasks);
      console.log(newTask);
      console.log(newTasks);

    } catch (error) {
      console.error("Error occurred: ", error);
    }

    // Resets settings for a new task to be created
    resetTaskForm();
  };

  const createGoogleCalendarEvent = async (task) => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    const eventDetails = {
      summary: task.name,
      description: task.description,
      start: {
        dateTime: task.start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: task.end,
        timeZone: 'UTC',
      },
      colorId: getColorID(task),
      extendedProperties: {
        private: {
            tinyTasksTitle: 'TinyTasks'
        }
      }
    };       
    try {
      console.log("Sending request to create event with details:", eventDetails);
      // Local Address for Mac's: http://127.0.0.1:3000/google/calendar/schedule_event
      // const response = await fetch("http://10.0.2.2:3000/google/calendar/schedule_event", {
      const event = await createEvent(accessToken, eventDetails);
      console.log("Event created:", event);
      
      setTimeout(() => { }, 5000);
  
      return event.id
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  };

  const getColorID = (task) => {
    if (task.isComplete) { 
      return 8; 
    } else {
      if (task.priority == "5" || task.priority == "4") {
        return task.priority;
      } else {
        return 2; //default = low = green
      }
    }
  }

  // Handles task editing
  const editTask = (task) => {
    setSelectedTask(task);
    setTaskName(task.name);
    setDescription(task.description);
    setPriority(task.priority);
    setSelectedPriority(task.priority);
    setStartTime(new Date(task.start));
    setEndTime(new Date(task.end));
    setModalVisible(true);
  };

  const updateTask = async () => {
    try {
      const checkOverlap = tasks.some((task) => {
        if (selectedTask === task) {
          return;
        }
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

      const updatedTask = {
        ...selectedTask,
        name: taskName,
        description: description,
        priority: priority,
        start: startTime,
        end: endTime,
      };

      await updateGoogleCalendarEvent(updatedTask);

      //update task in local storage
      if (selectedTask.id !== null) {
        tasksStorage.set(selectedTask.id, JSON.stringify(updatedTask));
        console.log("Task updated with id:", selectedTask.id);
        let taskDet = tasksStorage.getString(selectedTask.id);
        console.log("Updated Task Details: ", JSON.parse(taskDet));
      } else {
        console.error("Task ID is null, cannot update in local storage.");
      }

      const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      updatedTasks.sort((a,b) => new Date(a.start) - new Date(b.start));

      setTasks(updatedTasks);
      resetTaskForm();
    } catch (error) {
      console.error("Error occurred: ", error);
    }

    resetTaskForm();
  };

  const updateGoogleCalendarEvent = async (task) => {
    const accessToken = await AsyncStorage.getItem('accessToken');

    const eventDetails = {
        summary: task.name,
        description: task.description,
        start: {
            dateTime: task.start,
            timeZone: 'UTC',
        },
        end: {
            dateTime: task.end,
            timeZone: 'UTC',
        },
        colorId: getColorID(task),
    };

    try {
        await updateEvent(accessToken, task.id, eventDetails);
        console.log("Event updated:", task.id);
    } catch (error) {
        console.log("Error updating event:", error);
    }
  };

  const resetTaskForm = () => {
    setTaskName("");
    setDescription("");
    setPriority(2);
    setSelectedPriority(2);
    setStartTime(new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1, 0,));
    setEndTime(new Date(today.getFullYear(), today.getMonth(), today.getDate(), startTime.getHours() + 1, 0,));
    setSelectedTask(null);
    setModalVisible(false);
  };

  const viewTaskDetails = (task) => {
    setSelectedTask(task);
    setDetailsModalVisible(true);
  };

  const Card = ({ children, taskId, onPress }) => {
    const task = tasks.find(t => t.id === taskId);
    const completionText = task.complete ? "Undo" : "Complete";
    const renderLeftActions = () => (
      <View style={styles.leftAction}>
        <Text style={styles.completeText}>{completionText}</Text>
      </View>
    );
    const renderRightActions = () => (
      <View style={styles.rightAction}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
    );
    //MARKS TASK AS COMPLETE
    const completeTask = async ()  => {
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, complete: !t.complete } : t
      );
      setTasks(updatedTasks);
      setSelectedTask(null);

    }
    //PERMANENTLY DELETES TASK
    const deleteTask = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      // Remove the task from Google Calendar if it has an id
      try {
        await deleteEvent(accessToken, taskId);
        console.log("task deleted.. task deleted: ", taskId);
        
        const newList = tasks.filter((item) => item.id !== taskId);
        setTasks(newList);
        setSelectedTask(null);
      }
      catch (error) {
        console.error("Error deleting event from Google Calendar:", error);
      }
    }
    //Task Duration in minutes
    const minCardHeight = 10;
    const startTime = new Date(task.start);
    const endTime = new Date(task.end);
    const duration = [endTime - startTime] / (1000 * 60);
    const newHeight = duration > 5 ? (duration - 5) * 2 : 0;

    // Adds extra offset (40px) to the card if it passes the 61min threshold
    let stretchDifference = endTime.getHours() - startTime.getHours();
    if ((stretchDifference > 0 && endTime.getMinutes() == 0)) {
      stretchDifference--;
    }
    const stretchHeight = stretchDifference > 0 ? stretchDifference * 40 : 0;
    const cardHeight = minCardHeight + newHeight + stretchHeight;

    const topPosition = calculateTopPosition(task.id);
    
      return (
        <View style={{ position: 'relative', flex: 1, width: '100%', height: cardHeight, marginTop: topPosition }}>
          <Swipeable
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => (direction == "left") ? completeTask() : deleteTask()}
          >
            <TouchableOpacity 
              style={[styles.taskCard, { height: cardHeight }]}
              onPress={() => { viewTaskDetails(task); }}
              activeOpacity={0.7}
            >
              {children}
              <Text 
                style={[styles.priorityMark, 
                  { color: task.priority === 4 ? 'red' : (task.priority === 5 ? 'yellow' : 'green'),
                    opacity: task.complete ? 0.2 : 1
                  }]}
              >!
              </Text>

            </TouchableOpacity>
          </Swipeable>
        </View>
      );
    };

    const calculateTopPosition = (taskId) => {
      const baseTop = 30;
      let topPosition = 0;
    
      const task = tasks.find(t => t.id === taskId);
      const taskIndex = tasks.findIndex(t => t.id === taskId);
    
      const halfDayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), givenHalfTime, 0, 0, 0);
      if (selectedTab === 'Half Day') {
        if (task.start >= halfDayTime) {
          const remainingTasks = tasks.filter(t => t.start >= halfDayTime);
          const newTaskIndex = remainingTasks.findIndex(t => t.id === taskId);
          
          const subtractPosition = givenHalfTime * 160;
          
          if (newTaskIndex > 0) { // NOT the first task in our new list
            const prevTask = remainingTasks[newTaskIndex - 1];
            const prevEnd = new Date(prevTask.end);
    
            const gapinMin = (task.start - prevEnd) / (1000*60);
            const gapStretchDifference = task.start.getHours() - prevEnd.getHours();
    
            if (task.start.getHours() === prevEnd.getHours()) {
              if (prevEnd.getMinutes() === 0 || task.start.getMinutes() === 0) {
                topPosition = gapinMin * 2 + 40;
              } else {
                topPosition = gapinMin * 2;
              }
            } else { 
              topPosition = (gapinMin * 2) + gapStretchDifference * 40;
              if (prevEnd.getMinutes() === 0 || task.start.getMinutes() === 0) {
                topPosition += 40;
              }
            }
            if (gapinMin <= 5) {
              topPosition += gapinMin;
            }
          } else {
            topPosition = baseTop + (task.start.getHours() * 160 + task.start.getMinutes() * 2) - subtractPosition;
          }
        } else {
          topPosition = baseTop + (task.start.getHours() * 160 + task.start.getMinutes() * 2);
        }
      } else {
        if (taskIndex > 0) { // NOT the first task in our list
          const prevTask = tasks[taskIndex - 1];
          const prevEnd = new Date(prevTask.end);
    
          const gapinMin = (task.start - prevEnd) / (1000*60);
          const gapStretchDifference = task.start.getHours() - prevEnd.getHours();
    
          if (task.start.getHours() === prevEnd.getHours()) {
            if (prevEnd.getMinutes() === 0 || task.start.getMinutes() === 0) {
              topPosition = gapinMin * 2 + 40;
            } else {
              topPosition = gapinMin * 2;
            }
          } else { 
            topPosition = (gapinMin * 2) + gapStretchDifference * 40;
            if (prevEnd.getMinutes() === 0 || task.start.getMinutes() === 0) {
              topPosition += 40;
            }
          }
          if (gapinMin <= 5) {
            topPosition += gapinMin;
          }
        } else {
          topPosition = baseTop + (task.start.getHours() * 160 + task.start.getMinutes() * 2);
        }
      }
    
      return topPosition;
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
          <TouchableOpacity onPress={() => [setModalVisible(true), setSelectedTask(null)]}>
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
        onRequestClose={() => resetTaskForm()}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Exit */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.exitButton]}
                onPress={() => resetTaskForm() }
              >
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Title */}
            <Text style={styles.modalTitle}>{selectedTask ? "Edit Task" : "Create a Task"}</Text>
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
              {/* START TIME */}
              <DatePicker
                modal
                open={startPickerOpen}
                date={startTime}
                mode="time"
                //Once user clicks on endtime they CANNOT pick a time before the current one
                minimumDate = {today}
                maximumDate = {new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 54, 0, 0)}
                onConfirm={(selectedStartTime) => {
                  setStartPickerOpen(false);
                  setStartTime(selectedStartTime);
                  if (selectedStartTime.getTime() + 300000 >= endTime) {
                    setEndTime(new Date(selectedStartTime.getTime() + 300000));
                  }
                }}
                onCancel={() => {setStartPickerOpen(false)}}
              />
              </TouchableOpacity>
              <Text style={styles.toText}>to</Text>
              <TouchableOpacity style={styles.timeButton} onPress={() => setEndPickerOpen(true)}>
                <Text style={styles.buttonText}>{displayEnd}</Text>
              {/* END TIME */}
              <DatePicker
                modal
                open={endPickerOpen}
                date={endTime}
                mode="time"
                minimumDate = {new Date(startTime.getTime() + 300000)}
                maximumDate = {new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 0, 0)}
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
                  selectedTask ? updateTask() : createTask();
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Task Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Exit */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.exitButton]}
                onPress={() => setDetailsModalVisible(false)}
              >
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
            {/* Task Details */}
            {selectedTask && (
              <>
                <Text style={styles.modalTitle}>{selectedTask.name}</Text> 
                <Text style={styles.detailText}>Priority: {
                  selectedTask.priority == 4 ? <Text>High</Text> : 
                  (selectedTask.priority == 5 ? <Text>Medium</Text> : 
                  <Text>Low</Text>)
                }</Text>
                <Text style={styles.detailText}>Start Time: {new Date(selectedTask.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.detailText}>End Time: {new Date(selectedTask.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.detailText}>Description: {selectedTask.description}</Text>
                <Text></Text>
                {/* Edit Button */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => {
                      setDetailsModalVisible(false);
                      editTask(selectedTask);
                    }}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, selectedTab === "Full Day" && styles.activeTab]} 
        onPress={() => [setTimeSlots(generateTimeSlots(0)), setSelectedTab("Full Day")]}>
          <Text style={[styles.tabText, selectedTab === "Full Day" && styles.activeTabText]}>Full Day</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, selectedTab === "Half Day" && styles.activeTab]} 
        onPress={() => [setTimeSlots(generateTimeSlots(givenHalfTime)), setSelectedTab("Half Day")]}>
          <Text style={[styles.tabText, selectedTab === "Half Day" && styles.activeTabText]}>Half Day</Text>
        </TouchableOpacity>
      </View>

      {/* Current Date */}
      <Text style={styles.dateText}>{formattedDate}</Text>



      <View style={styles.container}>
        {/* Container ScrollView */}
        <ScrollView contentContainerStyle={styles.scrollContainer} scrollEventThrottle={16} style={{height: '100%'}}>
          <View style={{ flexDirection: "row", position: "relative" }}>
            
            {/* Time Slots */}
            <ScrollView scrollEnabled={false} contentContainerStyle={styles.timeSlotContainer}>
              {timeSlots.map((time, index) => (
                <View key={index} style={styles.timeSlot}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Task Cards */}
            <ScrollView 
              scrollEnabled={false} 
              contentContainerStyle={styles.taskCardContainer} 
              style={styles.taskOverlay}
            >
              <View style={{ flex: 1, flexDirection: 'column'}}>
                {tasks
                  .filter(task => {
                    if (selectedTab === "Half Day") {
                      const taskStart = task.start.getHours();
                      return taskStart >= givenHalfTime;
                    }
                    return true;
                  }) 
                  .map((task) => (
                    <Card key={task.id} taskId={task.id}>
                      <Text style={task.complete ? [styles.taskText, { opacity: 0.2 }] : styles.taskText}>
                        {task.name}
                      </Text>
                    </Card>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* End Day Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/DailyReflection")}>
              <Text style={styles.actionButtonText}>End Day</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
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
  timeSlotContainer: {
    paddingBottom: 100,
  },
  scrollContainer: {
    paddingBottom: 100,
    width: '100%',
  },
  //lesgo
  timeSlot: {
    borderBottomWidth: 1,
    borderBottomColor: "#FF7F50",
    height: 150,
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
  taskContainer: {
    position: 'relative', 
    left: 0, 
    right: 0, 
  },
  taskCard: {
    backgroundColor: '#f0eded',
    margin: 3,
    paddingLeft: 15, 
    paddingTop: 15, 
    position: 'relative',
  },
  taskCardContainer: {
    position: "relative", 
    top: 0, 
    left: 0, 
    right: 0, 
  },
  taskOverlay: {
    position: 'absolute', 
    width: '100%',
    zIndex: 5, 
  },
  leftAction: {
    flex: 1,
    padding: 16,
  },
  rightAction: {
    flex: 1,
    padding: 16,
  },
  deleteText: {
    color: 'red',
    fontSize: 20,
    textAlign: 'right',
  },
  completeText: {
    color: 'green', 
    fontSize: 20,
  },  
  taskText: {
    color: 'black',
  },
  detailButton: {
    fontSize: 16,
    marginBottom: 10,
  },
  priorityMark: {
    position: 'absolute', 
    right: 10, 
    fontSize: 30,
    paddingRight: 15, 
    paddingTop: 10, 
    fontWeight: 'bold',
  },
});

export default ScheduleScreen;
