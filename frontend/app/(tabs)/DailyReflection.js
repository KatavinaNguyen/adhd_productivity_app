import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";

const stampImages = [
  require("../../assets/images/books.png"),
  require("../../assets/images/calculator_5861015.png"),
  require("../../assets/images/laptop_5860866.png"),
  require("../../assets/images/maths_5860816.png"),
  require("../../assets/images/mortarboard.png"),
  require("../../assets/images/ruler.png"),
  require("../../assets/images/test-tubes_5861018.png"),
];

const tasks = [
  "Submit HW2",
  "Do laundry",
  "Group Project Meeting",
  "Study for midterm",
  "Take out trash",
  "Start HW3",
];

const DailyReflection = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // Create Animated Values for each task
  const animations = useRef(tasks.map(() => new Animated.Value(-300))).current;

  const handleDownloadPDF = () => {
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2500);
  };

  // Animate tasks on mount
  useEffect(() => {
    const animationsSequence = animations.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 0,
        delay: i * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animationsSequence).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.notebookHeader}>
        <Text style={styles.headerText}>Daily Reflection</Text>
      </View>

      <View style={styles.page}>
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <ScrollView contentContainerStyle={styles.taskList}>
          {tasks.map((task, index) => (
            <Animated.View
              key={index}
              style={{ transform: [{ translateX: animations[index] }] }}
            >
              <View style={styles.taskLine}>
                <Text style={styles.taskText}>{task}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.page}>
        <Text style={styles.sectionTitle}>Stamps Earned</Text>
        <View style={styles.rewardsContainer}>
          {Array(12)
            .fill()
            .map((_, index) => (
              <Image
                key={index}
                source={stampImages[index % stampImages.length]}
                style={styles.rewardImage}
              />
            ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleDownloadPDF}>
          <Text style={styles.buttonText}>Download PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/ScheduleScreen")}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              📧 PDF has been sent to your email!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6E3",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  notebookHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  page: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5DED0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 12,
  },
  taskList: {
    gap: 12,
  },
  taskLine: {
    paddingVertical: 6,
    paddingLeft: 6,
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: "#444",
  },
  rewardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 10,
  },
  rewardImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FF7F50",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    elevation: 6,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
});

export default DailyReflection;
