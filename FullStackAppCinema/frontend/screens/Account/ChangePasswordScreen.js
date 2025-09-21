import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changePassword } from '../../service/authService';
import COLORS from '../../assets/color';
import Header from '../../components/Header';



const ChangePassword = ({ route, navigation }) => {
    const { user } = route.params;

    const [showPassword, setShowPassword] = useState({
        old: true,
        new: true,
    });

    const [form, setForm] = useState({
        oldpassword: '',
        newpassword: '',
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        navigation.replace("Home");
    };

    const handleChangePassword = async () => {
        if (!form.oldpassword || !form.newpassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (form.oldpassword === form.newpassword) {
            Alert.alert("Lỗi", "Mật khẩu mới phải khác mật khẩu cũ!");
            return;
        }

        try {
            console.log(form);
            console.log(user.id);



            // Gửi request PUT với header và dữ liệu JSON
            const response = await changePassword(user.id, form);

            // Hiển thị phản hồi nếu thành công
            console.log(response);
            if (response.message) {

                // Thông báo và quay lại màn hình đăng nhập
                Alert.alert("Thành công", "Mật khẩu đã được thay đổi!", [
                    { text: "OK", onPress: handleLogout }
                ]);

            }

        } catch (error) {
            console.log("Lỗi đổi mật khẩu:", error);

            if (error.response) {
                // Lỗi từ server, log thông tin chi tiết
                console.log("Response error status:", error.response.status);
                console.log("Response error data:", error.response.data.detail);

                // Nếu server có trả về lỗi cụ thể, hiển thị thông báo lỗi cho người dùng
                if (error.response.data.detail || error.response.data.errors) {
                    Alert.alert("Lỗi", `Chi tiết lỗi: ${JSON.stringify(error.response.data.detail)}`);
                } else {
                    Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình đổi mật khẩu!");
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Đổi mật khẩu"
                navigation={navigation} />

            <Text style={styles.sectionTitle}>MẬT KHẨU ĐĂNG NHẬP</Text>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu cũ"
                    secureTextEntry={showPassword.old}
                    onChangeText={(text) => handleChange('oldpassword', text)}
                />
                <TouchableOpacity onPress={() => togglePasswordVisibility('old')}>
                    <Icon name={showPassword.old ? "eye-slash" : "eye"} size={20} color="gray" />
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    placeholder="Mật khẩu mới"
                    secureTextEntry={showPassword.new}
                    onChangeText={(text) => handleChange('newpassword', text)}
                />
                <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
                    <Icon name={showPassword.new ? "eye-slash" : "eye"} size={20} color="gray" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#D9D9D9', marginTop: 30 },
    header: { flexDirection: 'row', padding: 15, backgroundColor: 'white', elevation: 2 },
    headerTitle: { flex: 1, paddingLeft: 20, fontSize: 18, fontFamily: "Roboto" },
    sectionTitle: { fontSize: 14, color: 'gray', padding: 20, paddingBottom: 10, fontFamily: "Roboto" },
    input: { backgroundColor: '#FFFFFF', flex: 1, fontFamily: "Roboto", },
    row: { flexDirection: 'row', padding: 20, paddingVertical: 10, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#D9D9D9', alignItems: "center" },
    updateButton: { width: "80%", backgroundColor: COLORS.primary, padding: 10, borderRadius: 20, alignItems: 'center', marginTop: 20, marginHorizontal: "auto" },
    buttonText: { color: 'white', fontSize: 16, fontFamily: "Roboto" },
});

export default ChangePassword;
