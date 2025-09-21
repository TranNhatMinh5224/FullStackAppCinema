import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from '../../context/UserContext';
import Header from '../../components/Header';
import { ru } from 'date-fns/locale';
import COLORS from '../../assets/color';
import { updateUserInfo } from '../../service/authService';

const AccountInfoScreen = ({ route, navigation }) => {
    const { user } = route.params;

    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const [dob, setDob] = useState(user.dob ? new Date(user.dob) : null);
    // const [gender, setGender] = useState(user.gender || null);
    const [gender, setGender] = useState(
        user.gender === true ? "Nam" : user.gender === false ? "Nữ" : null
    );

    const [address, setAddress] = useState(user.address || '');
    const [showPicker, setShowPicker] = useState(false);



    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setDob(selectedDate);
        }
        setShowPicker(false);
    };
    useEffect(() => { console.log(user) });

    // const handleUpdate = async () => {
    //     try {
    //         const updatedUser = {
    //             name,
    //             phone,
    //             dob: dob ? dob.toISOString().split('T')[0] : null,
    //             gender,
    //             address
    //         };
    //         console.log(updatedUser)

    //         const response = await axios.put(
    //             `http://192.168.1.211:8000/account/users/account/users/${user.id}`,
    //             updatedUser
    //         );

    //         const userNew = response.data;
    //         setUser(userNew);
    //         await AsyncStorage.setItem("user", JSON.stringify(userNew));
    //         Alert.alert("Thành công", "Thông tin đã được cập nhật!");
    //     } catch (error) {
    //         Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    //     }
    // };
    const handleUpdate = async () => {
        try {
            const updatedUser = {
                ten: name,
                sdt: phone,
                ngay_sinh: dob ? dob.toISOString().split('T')[0] : null,
                gioi_tinh: gender === "Nam" ? true : false,
                dia_chi: address
            };

            const userNew = await updateUserInfo(user.id, updatedUser);
            await AsyncStorage.setItem("user", JSON.stringify(userNew));
            Alert.alert("Thành công", "Thông tin đã được cập nhật!");
            navigation.navigate("Home");

        } catch (error) {
            console.error("Update error:", error);
            Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
        }
    };


    return (
        <View style={styles.container}>
            <Header title="Thông tin tài khoản" navigation={navigation} />

            <Text style={styles.sectionTitle}>Tài khoản của bạn là</Text>
            <TextInput style={styles.input} editable={false} value={user.email} />

            <Text style={styles.sectionTitle}>Thông tin thêm</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Họ tên</Text>
                <TextInput style={styles.value} value={name} onChangeText={setName} />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Ngày sinh</Text>
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text style={styles.value}>{dob ? dob.toLocaleDateString() : "Chọn ngày sinh"}</Text>
                </TouchableOpacity>
                {showPicker && (
                    <DateTimePicker
                        value={dob || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Giới tính</Text>
                {/* <Picker selectedValue={gender} onValueChange={(value) => setGender(value)} style={{ width: 120 }}>
                    <Picker.Item label="Chọn giới tính" value={null} />
                    <Picker.Item label="Nam" value="Nam" />
                    <Picker.Item label="Nữ" value="Nữ" />
                </Picker> */}
                <Picker
                    selectedValue={gender}
                    onValueChange={(value) => setGender(value)}
                    style={{ width: 120 }}
                >
                    <Picker.Item label="Chọn giới tính" value={null} />
                    <Picker.Item label="Nam" value="Nam" />
                    <Picker.Item label="Nữ" value="Nữ" />
                </Picker>

            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput style={styles.value} value={address} onChangeText={setAddress} />
            </View>
            <Text style={styles.sectionTitle}>Liên hệ</Text>
            <View style={styles.row}>
                <Text style={styles.label}>SDT di động</Text>
                <TextInput style={styles.value} value={phone} onChangeText={setPhone} />
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Cập nhật thông tin</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#D9D9D9', marginTop: 30 },
    header: {
        flexDirection: 'row', padding: 15, backgroundColor: 'white', elevation: 2,
        fontFamily: "Roboto",
    },
    headerTitle: { flex: 1, paddingLeft: 20, fontSize: 18, fontFamily: "Roboto" },
    sectionTitle: { fontSize: 14, color: 'gray', padding: 20, paddingBottom: 10, fontFamily: "Roboto" },
    input: { backgroundColor: '#FFFFFF', padding: 20, borderBottomWidth: 1, borderColor: "#D9D9D9", marginTop: 5 },
    row: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#D9D9D9', alignItems: "center" },
    label: { fontSize: 16, color: "#D9D9D9", fontFamily: "Roboto" },
    value: { fontSize: 16, fontWeight: 'bold', textAlign: 'right', fontFamily: "Roboto", flex: 1 },
    updateButton: { width: "80%", backgroundColor: COLORS.primary, padding: 10, borderRadius: 20, alignItems: 'center', marginTop: 20, alignSelf: "center" },
    buttonText: { color: 'white', fontSize: 16, fontFamily: "Roboto" },
});

export default AccountInfoScreen;