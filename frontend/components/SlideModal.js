// components/SlideModal.js
import React from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

const SlideModal = ({ slideAnim, totalPrice }) => {
  return (
    <Animated.View
      style={[
        styles.modal,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.totalText}>Tổng tiền: {totalPrice.toLocaleString()} VND</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SlideModal;
