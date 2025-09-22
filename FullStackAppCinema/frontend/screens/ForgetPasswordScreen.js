import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    TextInput,
} from "react-native";
import EmailInput from "../components/account/EmailInput";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import { forgotPassword, verifyOTP, resetPassword } from '../service/authService';
import COLORS from "../assets/color";

const ForgetPasswordScreen = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
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
            await forgotPassword(email);
            setLoading(false);
            Alert.alert("Thành công", "OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");
            setStep(2);
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.response?.data?.detail || "Không thể kết nối đến máy chủ");
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert("Lỗi", "Vui lòng nhập mã OTP 6 chữ số");
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setLoading(false);
            Alert.alert("Thành công", "OTP hợp lệ. Vui lòng nhập mật khẩu mới.");
            setStep(3);
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.response?.data?.detail || "OTP không hợp lệ hoặc đã hết hạn");
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }

        setLoading(true);
        try {
            await resetPassword(email, newPassword);
            setLoading(false);
            Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công!", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.response?.data?.detail || "Không thể đặt lại mật khẩu");
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigation.goBack();
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.container}>
                        <Text style={styles.subHeader}>Nhập email của bạn để nhận mã OTP</Text>
                        <EmailInput value={email} onChange={setEmail} />
                        <TouchableOpacity
                            style={[styles.button, !email && styles.buttonDisabled]}
                            onPress={handleSendOTP}
                            disabled={loading || !email}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Đang gửi..." : "Gửi OTP"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <View style={styles.container}>
                        <Text style={styles.subHeader}>Nhập mã OTP đã gửi đến {email}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mã OTP 6 chữ số"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            maxLength={6}
                        />
                        <TouchableOpacity
                            style={[styles.button, (!otp || otp.length !== 6) && styles.buttonDisabled]}
                            onPress={handleVerifyOTP}
                            disabled={loading || !otp || otp.length !== 6}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Đang xác minh..." : "Xác minh OTP"}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleSendOTP}
                            disabled={loading}
                        >
                            <Text style={styles.resendText}>Gửi lại OTP</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 3:
                return (
                    <View style={styles.container}>
                        <Text style={styles.subHeader}>Nhập mật khẩu mới</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={[styles.button, (!newPassword || !confirmPassword) && styles.buttonDisabled]}
                            onPress={handleResetPassword}
                            disabled={loading || !newPassword || !confirmPassword}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Header title="Quên mật khẩu" navigation={navigation} onBack={handleBack} />
            <Image source={require("../assets/img/banner.png")} style={styles.imageRegister} resizeMode="contain" />
            <View>
                <Text style={styles.header}>Lấy lại mật khẩu</Text>
                <Text style={styles.stepIndicator}>Bước {step}/3</Text>
            </View>
            {renderStepContent()}
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
        marginBottom: 5,
    },
    subHeader: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
        textAlign: "center",
    },
    stepIndicator: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 15,
    },
    imageRegister: {
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 25,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
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
    resendButton: {
        marginTop: 15,
    },
    resendText: {
        color: COLORS.primary,
        fontSize: 16,
        textDecorationLine: "underline",
    },
});

export default ForgetPasswordScreen;
