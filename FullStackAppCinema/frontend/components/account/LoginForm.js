import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../assets/color';

const LoginForm = ({
    email, setEmail,
    password, setPassword,
    handleLogin, loading,
    navigation
}) => {
    const [emailError, setEmailError] = useState("");

    const handleEmailChange = (text) => {
        setEmail(text);
        const isValid = /^[\w-.]+@gmail\.com$/.test(text);
        if (!isValid) {
            setEmailError("Email phải là Gmail hợp lệ (vd: example@gmail.com)");
        } else {
            setEmailError("");
        }
    };

    return (
        <View style={styles.form}>
            <View style={{ width: "100%" }}>
                <TextInput
                    placeholder="Email"
                    style={[styles.input, emailError && styles.inputError]}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <TextInput
                placeholder="Mật khẩu"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleLogin}
                disabled={loading || emailError !== ""}
            >
                <Text style={styles.loginText}>
                    {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}  >
                <Text style={styles.forgotPass}>
                    Quên mật khẩu?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.register}>
                <Text style={{ fontSize: 14 }}>Đăng ký tài khoản</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20
    },
    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
        marginVertical: 10,
        fontFamily: "Roboto",
    },
    inputError: {
        borderColor: "red",
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
    loginBtn: {
        width: "100%",
        backgroundColor: COLORS.primary,
        padding: 15,
        alignItems: "center",
        borderRadius: 20,
        marginVertical: 10
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
    forgotPass: {
        color: "#007bff",
        marginVertical: 15,
        fontFamily: "Roboto",
    },
    register: {
        marginTop: 30,
        fontFamily: "Roboto",
    },
});

export default LoginForm;
