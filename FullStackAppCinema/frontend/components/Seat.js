// components/Seat.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Seat = ({ seat, isSelected, onToggle }) => {
  const isSold = seat.trang_thai === "da_ban";
  const isHeld = seat.trang_thai === "dang_giu";

  let backgroundColor = "#eee";
  if (isSold) backgroundColor = "gray";
  else if (isHeld) backgroundColor = "orange";
  else if (isSelected) backgroundColor = "green";

  return (
    <TouchableOpacity
      style={[styles.seat, { backgroundColor }]}
      onPress={() => onToggle(seat.so_ghe)}
      disabled={isSold || isHeld}
    >
      <Text>{seat.so_ghe}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    seat: {
        width: 30,
        height: 30,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        margin: 3,
        borderRadius: 5,
    },
});

export default Seat;
