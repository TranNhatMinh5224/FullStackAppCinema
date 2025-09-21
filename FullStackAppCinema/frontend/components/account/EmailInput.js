import React, { useState } from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";

const EmailInput = ({ value, onChange }) => {
    const [error, setError] = useState("");

    const handleChange = (text) => {
        onChange(text);
        const isValid = /^[\w-.]+@gmail\.com$/.test(text);
        if (!isValid) {
            setError("Email phải là Gmail hợp lệ (vd: example@gmail.com)");
        } else {
            setError("");
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Email (Gmail)"
                keyboardType="email-address"
                onChangeText={handleChange}
                value={value}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 5,
        padding: 10,
        width: "100%",
    },
    inputError: {
        borderColor: "red",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
});

export default EmailInput;

