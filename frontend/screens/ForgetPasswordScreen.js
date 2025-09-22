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
import { validateEmail, validatePassword } from "../utils/validation";
import InputField from "../components/account/InputField";

const ForgetPasswordScreen = () => {
    const navigation = useNavigation();
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateEmailStep = () => {
        const newErrors = {};
        
        if (!email.trim()) {
            newErrors.email = "Email không được để trống";
        } else if (!validateEmail(email)) {
            newErrors.email = "Email không hợp lệ";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!validateEmailStep()) {
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email);
            setLoading(false);
            Alert.alert("Thành công", "OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.");
            handleStepChange(2);
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.response?.data?.detail || "Không thể kết nối đến máy chủ");
        }
    };

    const validateOTPStep = () => {
        const newErrors = {};
        
        if (!otp.trim()) {
            newErrors.otp = "Mã OTP không được để trống";
        } else if (otp.length !== 6) {
            newErrors.otp = "Mã OTP phải có đúng 6 chữ số";
        } else if (!/^\d{6}$/.test(otp)) {
            newErrors.otp = "Mã OTP chỉ được chứa số";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleVerifyOTP = async () => {
        if (!validateOTPStep()) {
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setLoading(false);
            Alert.alert("Thành công", "OTP hợp lệ. Vui lòng nhập mật khẩu mới.");
            handleStepChange(3);
        } catch (error) {
            setLoading(false);
            Alert.alert("Lỗi", error.response?.data?.detail || "OTP không hợp lệ hoặc đã hết hạn");
        }
    };

    const validatePasswordStep = () => {
        const newErrors = {};
        
        if (!newPassword.trim()) {
            newErrors.newPassword = "Mật khẩu mới không được để trống";
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
        }
        
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validatePasswordStep()) {
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
            setErrors({}); // Clear errors when going back
        } else {
            navigation.goBack();
        }
    };

    const handleStepChange = (newStep) => {
        setStep(newStep);
        setErrors({}); // Clear errors when changing steps
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.container}>
                        <Text style={styles.subHeader}>Nhập email của bạn để nhận mã OTP</Text>
                        <EmailInput 
                            value={email} 
                            onChange={setEmail}
                            returnKeyType="done"
                            onSubmitEditing={handleSendOTP}
                        />
                        <TouchableOpacity
                            style={[styles.button, (!email || errors.email) && styles.buttonDisabled]}
                            onPress={handleSendOTP}
                            disabled={loading || !email || !!errors.email}
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
                        <InputField
                            placeholder="Nhập mã OTP 6 chữ số"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            error={errors.otp}
                            returnKeyType="done"
                            onSubmitEditing={handleVerifyOTP}
                        />
                        <TouchableOpacity
                            style={[styles.button, (!otp || otp.length !== 6 || errors.otp) && styles.buttonDisabled]}
                            onPress={handleVerifyOTP}
                            disabled={loading || !otp || otp.length !== 6 || !!errors.otp}
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
                        <InputField
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            error={errors.newPassword}
                            returnKeyType="next"
                            onSubmitEditing={() => {}}
                        />
                        <InputField
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            error={errors.confirmPassword}
                            returnKeyType="done"
                            onSubmitEditing={handleResetPassword}
                        />
                        <TouchableOpacity
                            style={[styles.button, (!newPassword || !confirmPassword || errors.newPassword || errors.confirmPassword) && styles.buttonDisabled]}
                            onPress={handleResetPassword}
                            disabled={loading || !newPassword || !confirmPassword || !!errors.newPassword || !!errors.confirmPassword}
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
        backgroundColor: "#F8F9FA",
        flex: 1,
        paddingTop: 30
    },
    container: {
        width: "90%",
        alignItems: "center",
        paddingVertical: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#2C3E50",
        textAlign: "center",
    },
    subHeader: {
        fontSize: 16,
        color: "#7F8C8D",
        marginBottom: 25,
        textAlign: "center",
        lineHeight: 22,
    },
    stepIndicator: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 20,
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    imageRegister: {
        marginBottom: 25,
        width: 120,
        height: 120,
    },
    input: {
        width: "100%",
        height: 55,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: "#FFFFFF",
        fontFamily: "Roboto",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: "#BDC3C7",
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Roboto",
        letterSpacing: 0.5,
    },
    resendButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    resendText: {
        color: COLORS.primary,
        fontSize: 16,
        textDecorationLine: "underline",
        fontFamily: "Roboto",
        fontWeight: "500",
    },
});

export default ForgetPasswordScreen;
