import React, { useState, useRef } from "react";
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
    StatusBar,
    KeyboardAvoidingView
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
import { validateEmail, validatePhone, validateName, validatePassword, validateRequired } from "../utils/validation";




const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Refs for input focus management
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};
        
        // Validate name
        const nameError = validateRequired(name, "Họ tên");
        if (nameError) {
            newErrors.name = nameError;
        } else if (!validateName(name)) {
            newErrors.name = "Họ tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái";
        }
        
        // Validate phone
        const phoneError = validateRequired(phone, "Số điện thoại");
        if (phoneError) {
            newErrors.phone = phoneError;
        } else if (!validatePhone(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số)";
        }
        
        // Validate email
        const emailError = validateRequired(email, "Email");
        if (emailError) {
            newErrors.email = emailError;
        } else if (!validateEmail(email)) {
            newErrors.email = "Email không hợp lệ";
        }
        
        // Validate password
        const passwordError = validateRequired(password, "Mật khẩu");
        if (passwordError) {
            newErrors.password = passwordError;
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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

    const handleSignup = async () => {
        if (!validateForm()) {
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
            <KeyboardAvoidingView 
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Header title="Đăng ký" navigation={navigation} />
                    <Image source={require("../assets/img/banner.png")} style={styles.imageRegister} resizeMode="contain" />
                    <View style={styles.container}>
                        <InputField 
                            placeholder="Họ tên" 
                            onChangeText={(text) => {
                                setName(text);
                                clearError('name');
                            }}
                            returnKeyType="next"
                            onSubmitEditing={() => phoneRef.current?.focus()}
                            autoCapitalize="words"
                            error={errors.name}
                            validationType="name"
                            value={name}
                            required={true}
                        />
                        <InputField 
                            ref={phoneRef}
                            placeholder="Số điện thoại" 
                            onChangeText={(text) => {
                                setPhone(text);
                                clearError('phone');
                            }}
                            keyboardType="phone-pad"
                            returnKeyType="next"
                            onSubmitEditing={() => emailRef.current?.focus()}
                            error={errors.phone}
                            validationType="phone"
                            value={phone}
                            required={true}
                        />
                        <EmailInput 
                            value={email} 
                            onChange={(text) => {
                                setEmail(text);
                                clearError('email');
                            }}
                            ref={emailRef}
                            returnKeyType="next"
                            onSubmitEditing={() => passwordRef.current?.focus()}
                            required={true}
                        />
                        <InputField 
                            ref={passwordRef}
                            placeholder="Mật khẩu" 
                            onChangeText={(text) => {
                                setPassword(text);
                                clearError('password');
                            }}
                            secureTextEntry
                            returnKeyType="done"
                            onSubmitEditing={() => {}}
                            error={errors.password}
                            validationType="password"
                            value={password}
                            required={true}
                        />

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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 50
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#F8F9FA'
    },
    scrollContainer: {
        alignItems: "center"
    },
    container: {
        width: "90%",
        alignItems: "center",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    imageRegister: {
        marginBottom: 30,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 15,
        marginBottom: 15,
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
    dobAndGender: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 15,
    },
    inputHalf: {
        width: "48%",
        justifyContent: "center"
    },
    dateText: {
        color: "#000",
        textAlign: "left",
        fontFamily: "Roboto", // Added font family
    },
    note: {
        color: "#E74C3C",
        fontStyle: "italic",
        marginBottom: 15,
        alignSelf: "flex-start",
        fontFamily: "Roboto",
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: "center",
        width: "100%",
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Roboto",
        letterSpacing: 0.5,
    },
});

export default SignupScreen;
