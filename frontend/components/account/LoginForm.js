import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import COLORS from '../../assets/color';
import { validateEmail } from '../../utils/validation';

const LoginForm = ({
    email, setEmail,
    password, setPassword,
    handleLogin, loading,
    navigation,
    errors = {}
}) => {
    const [emailError, setEmailError] = useState("");
    const passwordRef = useRef(null);

    const handleEmailChange = (text) => {
        setEmail(text);
        
        if (text.length === 0) {
            setEmailError("");
            return;
        }
        
        if (!validateEmail(text)) {
            setEmailError("Email không hợp lệ. Vui lòng nhập đúng định dạng email");
        } else {
            setEmailError("");
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.form}>
                    <View style={{ width: "100%" }}>
                        <TextInput
                            placeholder="Email"
                            style={[styles.input, (emailError || errors.email) && styles.inputError]}
                            value={email}
                            onChangeText={handleEmailChange}
                            keyboardType="email-address"
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            blurOnSubmit={false}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {(emailError || errors.email) ? <Text style={styles.errorText}>{emailError || errors.email}</Text> : null}
                    </View>

                    <View style={{ width: "100%" }}>
                        <TextInput
                            ref={passwordRef}
                            placeholder="Mật khẩu"
                            secureTextEntry
                            style={[styles.input, errors.password && styles.inputError]}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                // Clear password error when user starts typing
                                if (errors.password) {
                                    // This will be handled by parent component
                                }
                            }}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                    </View>

                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={handleLogin}
                        disabled={loading || emailError !== "" || !!errors.email || !!errors.password}
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    form: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 20,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 10,
        fontFamily: "Roboto",
        backgroundColor: 'white',
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
    loginBtn: {
        width: "100%",
        backgroundColor: "#2ECC71",
        padding: 18,
        alignItems: "center",
        borderRadius: 25,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
        fontFamily: "Roboto",
        fontSize: 18,
        letterSpacing: 0.5,
    },
    forgotPass: {
        color: "#3498DB",
        marginVertical: 15,
        fontFamily: "Roboto",
        fontSize: 16,
        fontWeight: '500',
    },
    register: {
        marginTop: 30,
        fontFamily: "Roboto",
        fontSize: 16,
        color: '#2C3E50',
    },
});

export default LoginForm;
