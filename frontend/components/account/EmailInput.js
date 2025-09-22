import React, { useState, forwardRef } from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";
import { validateEmail } from "../../utils/validation";

const EmailInput = forwardRef(({ value, onChange, returnKeyType, onSubmitEditing, required = false }, ref) => {
    const [error, setError] = useState("");

    const handleChange = (text) => {
        onChange(text);
        
        if (text.length === 0) {
            setError("");
            return;
        }
        
        if (!validateEmail(text)) {
            setError("Email không hợp lệ. Vui lòng nhập đúng định dạng email");
        } else {
            setError("");
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <View style={styles.labelContainer}>
                {required && <Text style={styles.requiredAsterisk}>*</Text>}
                <Text style={styles.placeholderText}>Email</Text>
            </View>
            <TextInput
                ref={ref}
                style={[styles.input, error && styles.inputError]}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange}
                value={value}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                autoCapitalize="none"
                autoCorrect={false}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
});

const styles = StyleSheet.create({
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requiredAsterisk: {
        color: "#E74C3C",
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 4,
    },
    placeholderText: {
        fontSize: 14,
        color: "#2C3E50",
        fontFamily: "Roboto",
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 15,
        marginBottom: 5,
        padding: 15,
        width: "100%",
        fontFamily: "Roboto",
        backgroundColor: '#F8F9FA',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    inputError: {
        borderColor: "#E74C3C",
        borderWidth: 2,
    },
    errorText: {
        color: "#E74C3C",
        fontSize: 12,
        marginBottom: 10,
        fontFamily: "Roboto",
        fontWeight: '500',
    },
});

export default EmailInput;

