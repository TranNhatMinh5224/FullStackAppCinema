import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import EmailInput from "../components/account/EmailInput";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { forgotPassword } from '../service/authService';
import COLORS from "../assets/color";

const ForgetPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
            return;
        }

        const isGmail = /^[\w-.]+@gmail\.com$/.test(email);
        if (!isGmail) {
            Alert.alert("Lỗi", "Email phải là địa chỉ Gmail hợp lệ");
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(email);
            setLoading(false);
            Alert.alert("Mật khẩu của bạn", `Mật khẩu: ${response.mat_khau}`);
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.response?.data?.detail || "Không thể kết nối đến máy chủ");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Header title="Quên mật khẩu" navigation={navigation} />
            <Image source={require("../assets/img/banner.png")} style={styles.imageRegister} resizeMode="contain" />
            <View>
                <Text style={styles.header}>Lấy lại mật khẩu</Text>
            </View>
            <View style={styles.container}>
                <EmailInput value={email} onChange={setEmail} />

                <TouchableOpacity
                    style={[styles.button, !email && styles.buttonDisabled]}
                    onPress={handleForgotPassword}
                    disabled={loading || !email}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Đang xử lý..." : "Tiếp Tục"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        alignItems: "center",
        backgroundColor: "#fff",
        flex: 1,
        marginTop: 30
    },
    container: {
        width: "85%",
        alignItems: "center",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    imageRegister: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        width: "80%",
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: "#ccc",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ForgetPasswordScreen;
