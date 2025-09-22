import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { login } from '../service/authService';
import Header from "../components/Header";
import LoginForm from "../components/account/LoginForm";
import { validateEmail } from "../utils/validation";

const API_URL = "http://10.0.2.2:8000/account/login";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!validateEmail(email)) {
            newErrors.email = "Email không hợp lệ";
        }
        
        if (!password.trim()) {
            newErrors.password = "Mật khẩu không được để trống";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await login(email, password);

            setLoading(false);
            if (response.message === "Đăng nhập thành công!") {
                await AsyncStorage.setItem("user", JSON.stringify(response.user));
                Alert.alert("Thành công", "Đăng nhập thành công!");
                navigation.navigate("Home");
            } else {
                Alert.alert("Lỗi", "Đăng nhập thất bại");
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data.detail) {
                Alert.alert("Lỗi", error.response.data.detail);
            } else {
                Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
            }

        }
    };


    return (
        <View style={styles.container}>
            <Header navigation={navigation} title="Đăng nhập" />

            <Image source={require("../assets/img/banner.png")} style={styles.banner} />

            <LoginForm
                email={email}
                setEmail={(text) => {
                    setEmail(text);
                    clearError('email');
                }}
                password={password}
                setPassword={(text) => {
                    setPassword(text);
                    clearError('password');
                }}
                handleLogin={handleLogin}
                loading={loading}
                navigation={navigation}
                errors={errors}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
    },
    headerTitle: {
        flex: 1,
        paddingLeft: 20,
        fontSize: 18,
        fontFamily: "Roboto", // Added font family
    },
    banner: {
        width: "95%",
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    form: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
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

export default LoginScreen;
