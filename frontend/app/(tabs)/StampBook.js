import React, { useState, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
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

const StampBook = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const scaleAnims = useRef(Array(28).fill().map(() => new Animated.Value(1))).current;
  const rotateAnims = useRef(Array(28).fill().map(() => new Animated.Value(0))).current;

  const handleStampPress = (index) => {
    if (selectedIndex === index) return;

    const prev = selectedIndex;
    setSelectedIndex(index);

    if (prev !== null) {
      Animated.sequence([
        Animated.timing(rotateAnims[prev], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnims[prev], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[prev], {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }

    Animated.spring(scaleAnims[index], {
      toValue: 1.2,
      useNativeDriver: true,
      speed: 15,
      bounciness: 10,
    }).start();
  };

  const handleDeselect = () => {
    if (selectedIndex !== null) {
      const flip = rotateAnims[selectedIndex];
      const scale = scaleAnims[selectedIndex];

      flip.setValue(0);
      Animated.sequence([
        Animated.timing(flip, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(flip, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSelectedIndex(null);
      });
    }
  };

  return (
    <Pressable style={styles.container} onPress={handleDeselect}>
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
          .map((_, index) => {
            const rotateY = rotateAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            });

            return (
              <Pressable
                key={index}
                onPress={(e) => {
                  e.stopPropagation(); // prevent deselect on tap
                  handleStampPress(index);
                }}
              >
                <Animated.View
                  style={[
                    styles.rewardContainer,
                    {
                      transform: [
                        { scale: scaleAnims[index] },
                        { rotateY: rotateY },
                      ],
                    },
                  ]}
                >
                  <Image
                    source={stampImages[index % stampImages.length]}
                    style={styles.rewardImage}
                  />
                </Animated.View>
              </Pressable>
            );
          })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/ScheduleScreen")}
        >
          <Text style={styles.actionButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
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
    maxHeight: "70%",
  },
  rewardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  rewardContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  rewardImage: {
    width: 32,
    height: 32,
    resizeMode: "contain",
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
