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

const StampBook = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tiny Stamps</Text>
      </View>

      <ScrollView
        style={styles.section}
        contentContainerStyle={styles.rewardsContainer}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        {Array(28)
          .fill()
          .map((_, index) => (
            <TouchableOpacity key={index} style={styles.rewardContainer}>
              <Image
                source={require("../../assets/images/reward-icon.png")}
                style={styles.rewardImage}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/ScheduleScreen")}>
          <Text style={styles.actionButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    backgroundColor: "#333",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#F9F9F9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxHeight: "70%", // Limit height to fit screen for mac users
  },
  rewardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,  // Reduced gap between stamps
  },
  rewardContainer: {
    borderRadius: 50,
    padding: 6,
    backgroundColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rewardImage: {
    width: 60, // Reduced size for better fit for mac users
    height: 60,
    borderRadius: 50,
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#FF7F50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    marginVertical: 10,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default StampBook;
