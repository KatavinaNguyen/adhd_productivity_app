import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const StampBook = () => {
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Tiny Stamps</Text>
      </View>

      {/* Stamps */}
      <View style={styles.section}>
        <View style={styles.rewardsContainer}>
          {Array(28)
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

      {/* Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
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
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 12,
  },
  rewardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  rewardImage: {
    width: 70,
    height: 70,
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

export default StampBook;
