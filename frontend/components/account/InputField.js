import React, { useState } from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import { validateEmail, validatePhone, validateName, validatePassword } from "../../utils/validation";

const InputField = ({ 
    placeholder, 
    onChangeText, 
    keyboardType, 
    secureTextEntry, 
    returnKeyType, 
    onSubmitEditing, 
    ref, 
    autoCapitalize = "none",
    autoCorrect = true,
    error,
    validationType,
    value,
    required = false
}) => {
    const [localError, setLocalError] = useState("");

    const handleChange = (text) => {
        onChangeText(text);
        
        if (text.length === 0) {
            setLocalError("");
            return;
        }
        
        let isValid = true;
        let errorMessage = "";
        
        switch (validationType) {
            case 'email':
                if (!validateEmail(text)) {
                    isValid = false;
                    errorMessage = "Email không hợp lệ. Vui lòng nhập đúng định dạng email";
                }
                break;
            case 'phone':
                if (!validatePhone(text)) {
                    isValid = false;
                    errorMessage = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số)";
                }
                break;
            case 'name':
                if (!validateName(text)) {
                    isValid = false;
                    errorMessage = "Họ tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái";
                }
                break;
            case 'password':
                if (text.length < 6) {
                    isValid = false;
                    errorMessage = "Mật khẩu phải có ít nhất 6 ký tự";
                }
                break;
            default:
                break;
        }
        
        if (!isValid) {
            setLocalError(errorMessage);
        } else {
            setLocalError("");
        }
    };

    const displayError = error || localError;

    return (
        <View style={{ width: "100%" }}>
            <View style={styles.labelContainer}>
                {required && <Text style={styles.requiredAsterisk}>*</Text>}
                <Text style={styles.placeholderText}>{placeholder}</Text>
            </View>
            <TextInput
                ref={ref}
                style={[styles.input, displayError && styles.inputError]}
                placeholder={placeholder}
                onChangeText={handleChange}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
                autoCapitalize={autoCapitalize}
                autoCorrect={autoCorrect}
                value={value}
            />
            {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}
        </View>
    );
};

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

export default InputField;
