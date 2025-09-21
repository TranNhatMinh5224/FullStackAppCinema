import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    SafeAreaView,
    Alert,
    Platform,
    StatusBar
} from "react-native";

import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { signup } from '../service/authService';
import InputField from "../components/account/InputField";
import SubmitButton from "../components/account/SubmitButton";
import GenderPicker from "../components/account/GenderPicker";
import DatePickerField from "../components/account/DatePickerField";
import EmailInput from "../components/account/EmailInput";
import Header from "../components/Header";
import COLORS from "../assets/color";




const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    const isGmail = (email) => /^[\w-.]+@gmail\.com$/.test(email);

    const handleSignup = async () => {
        if (!email || !password || !phone || !name) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (!isGmail(email)) {
            Alert.alert("Lỗi", "Email phải là địa chỉ Gmail hợp lệ");
            return;
        }
        setLoading(true);

        try {
            const userData = {
                email,
                mat_khau: password,
                sdt: phone,
                gioi_tinh: gender === "Nam" ? true : gender === "Nữ" ? false : null,
                ngay_sinh: dob ? dob.toISOString().split("T")[0] : null, // Chuyển Date thành YYYY-MM-DD
                dia_chi: "Chưa cập nhật", // Giá trị mặc định
                ten: name
            };
            console.log(userData);
            const response = await signup(userData);
            console.log(response);

            setLoading(false);
            Alert.alert("Thành công", "Đăng ký thành công!");
            navigation.navigate("Login");
        } catch (error) {
            setLoading(false);
            console.error(error);
            Alert.alert("Lỗi", error.response?.data?.detail || "Không thể kết nối đến máy chủ");
        }
    };

    return (

        <SafeAreaView style={styles.safeContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContainer}
            >
                <Header title="Đăng ký" navigation={navigation} />
                <Image source={require("../assets/img/banner.png")} style={styles.imageRegister} resizeMode="contain" />
                <View style={styles.container}>
                    <InputField placeholder="Họ tên" onChangeText={setName} />
                    <InputField placeholder="Số điện thoại" onChangeText={setPhone} keyboardType="phone-pad" />
                    <EmailInput value={email} onChange={setEmail} />
                    <InputField placeholder="Mật khẩu" onChangeText={setPassword} secureTextEntry />

                    {/* Chọn ngày sinh */}
                    <View style={styles.dobAndGender}>
                        <DatePickerField
                            dob={dob}
                            isVisible={isDatePickerVisible}
                            show={() => setDatePickerVisibility(true)}
                            hide={() => setDatePickerVisibility(false)}
                            onConfirm={(date) => {
                                setDob(date);
                                setDatePickerVisibility(false);
                            }}
                        />

                        {/* Chọn giới tính */}
                        <GenderPicker gender={gender} onChange={setGender} />
                    </View>

                    <Text style={styles.note}>* Thông tin bắt buộc</Text>
                    <SubmitButton onPress={handleSignup} loading={loading} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    scrollView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    scrollContainer: {
        alignItems: "center"
    },
    container: {
        width: "85%",
        alignItems: "center"
    },
    imageRegister: {
        marginBottom: 30
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        padding: 10,
        width: "100%",
        fontFamily: "Roboto", // Added font family
    },
    dobAndGender: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",

    },
    inputHalf: {
        width: "50%",
        justifyContent: "center"
    },
    dateText: {
        color: "#000",
        textAlign: "left",
        fontFamily: "Roboto", // Added font family
    },
    note: {
        color: "red",
        fontStyle: "italic",
        marginBottom: 10,
        alignSelf: "flex-start",
        fontFamily: "Roboto", // Added font family
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        width: "80%",
        marginTop: 20
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
});

export default SignupScreen;
