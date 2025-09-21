import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const GenderPicker = ({ gender, onChange }) => (
    <View style={[styles.input, styles.inputHalf]}>
        <Picker selectedValue={gender} onValueChange={onChange}>
            <Picker.Item label="Chọn giới tính" value="" />
            <Picker.Item label="Nam" value="Nam" />
            <Picker.Item label="Nữ" value="Nữ" />
        </Picker>
    </View>
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
});

export default GenderPicker;
