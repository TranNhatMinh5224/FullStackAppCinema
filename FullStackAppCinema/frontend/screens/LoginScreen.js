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

const API_URL = "http://10.0.2.2:8000/account/login";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const isGmail = (email) => /^[\w-.]+@gmail\.com$/.test(email);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
            return;
        }

        if (!isGmail(email)) {
            Alert.alert("Lỗi", "Email phải là địa chỉ Gmail hợp lệ");
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
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                loading={loading}
                navigation={navigation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 30,
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
        width: "100%",
        height: 180,
        marginBottom: 30
    },
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
        fontFamily: "Roboto", // Added font family
    },
    loginBtn: {
        width: "100%",
        backgroundColor: "#33DD33",
        padding: 15,
        alignItems: "center",
        borderRadius: 20,
        marginVertical: 10
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    forgotPass: {
        color: "#007bff",
        marginVertical: 15,
        fontFamily: "Roboto", // Added font family
    },
    register: {
        marginTop: 30,
        fontFamily: "Roboto", // Added font family
    },
});

export default LoginScreen;
