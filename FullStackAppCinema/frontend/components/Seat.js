// components/Seat.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const Seat = ({ seat, isSelected, onToggle }) => {
  // seat.state expected values: 'available', 'dang_giu', 'da_ban'
  const isSold = seat.state === "da_ban";
  const isHeld = seat.state === "dang_giu";
  const isOwned = seat.owner != null;

  let backgroundColor = "#eee";
  if (isSold) backgroundColor = "gray";
  else if (isHeld) backgroundColor = "orange";
  else if (isSelected) backgroundColor = "green";

  const disabled = isSold || (isHeld && String(seat.owner) !== String(seat.currentUser || seat.owner));

  return (
    <TouchableOpacity
      style={[styles.seat, { backgroundColor }]}
      onPress={() => onToggle(seat.so_ghe || seat.id)}
      disabled={disabled}
    >
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.text}>{seat.so_ghe}</Text>
        {isHeld && (
          <Text style={styles.ownerText}>{seat.owner === undefined || seat.owner === null ? 'Held' : `Held by ${seat.owner}`}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  seat: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: 6,
    padding: 2,
  },
  text: { fontSize: 12 },
  ownerText: { fontSize: 9, color: '#333' },
});

export default Seat;
