import React from "react";
import { TextInput, StyleSheet } from "react-native";

const InputField = ({ placeholder, onChangeText, keyboardType, secureTextEntry }) => (
    <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
    />
);

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        padding: 10,
        width: "100%",
        fontFamily: "Roboto",
    },
});

export default InputField;
