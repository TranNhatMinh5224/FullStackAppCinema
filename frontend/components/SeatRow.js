// components/SeatRow.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Seat from "./Seat";

const SeatRow = ({ rowSeats, selectedSeats, onToggle }) => (
  <View style={styles.row}>
    {rowSeats.map(seat => (
      <Seat
        key={seat.id}
        seat={seat}
        isSelected={selectedSeats.includes(seat.so_ghe)}
        onToggle={onToggle}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default SeatRow;
