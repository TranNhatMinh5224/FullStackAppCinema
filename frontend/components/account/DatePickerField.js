import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DatePickerField = ({ dob, isVisible, show, hide, onConfirm }) => (
    <>
        <TouchableOpacity onPress={show} style={[styles.input, styles.inputHalf]}>
            <Text style={styles.dateText}>{dob ? dob.toLocaleDateString() : "Chọn ngày sinh"}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
            isVisible={isVisible}
            mode="date"
            onConfirm={onConfirm}
            onCancel={hide}
        />
    </>
);

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        padding: 10,
    },
    inputHalf: {
        width: "50%",
        justifyContent: "center",
    },
    dateText: {
        color: "#000",
        textAlign: "left",
        fontFamily: "Roboto",
    },
});

export default DatePickerField;
