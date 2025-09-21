import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AccountGiftScreen = ({ navigation }) => {
    const [giftCode, setGiftCode] = useState('');
    const [pinCode, setPinCode] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                <View >
                    <Icon name="chevron-left" size={20} color="green" />
                </View>
                <Text style={styles.headerTitle}>ACCOUNT GIFT</Text>

            </TouchableOpacity>

            {/* Thông tin thẻ */}
            <Text style={styles.sectionTitle}>THÔNG TIN THẺ QUÀ TẶNG</Text>

            {/* Input Mã quà tặng */}
            <TextInput
                style={styles.input}
                placeholder="Mã quà tặng"
                value={giftCode}
                onChangeText={setGiftCode}
            />

            {/* Input Mã pin */}
            <TextInput
                style={styles.input}
                placeholder="Mã pin"
                secureTextEntry
                value={pinCode}
                onChangeText={setPinCode}
            />

            {/* Nút Xác nhận */}
            <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9D9D9',
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

    },
    sectionTitle: {
        fontSize: 14,
        color: 'gray',
        padding: 20,
        paddingBottom: 10,

    },
    input: {
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',

    },
    confirmButton: {
        width: '80%',
        backgroundColor: '#4CDE4C',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: "auto"
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccountGiftScreen;
