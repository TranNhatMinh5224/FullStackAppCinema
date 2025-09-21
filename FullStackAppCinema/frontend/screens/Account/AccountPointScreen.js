import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const AccountPointScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={20} color="green" />
                <Text style={styles.headerTitle}>Tích điểm</Text>

            </TouchableOpacity>

            {/* Card hiển thị điểm */}
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Icon name="coins" size={20} color="green" />
                    <Text style={styles.points}>4500 điểm</Text>
                </View>

                <Text style={styles.pointText}>Điểm đã dùng: <Text style={styles.boldText}>0 điểm</Text></Text>
                <Text style={styles.pointText}>Điểm sắp hết hạn: <Text style={styles.boldText}>0 điểm</Text></Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
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
    cardContainer: {
        marginTop: 20,
        backgroundColor: "#FFF",
        width: "90%",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginHorizontal: "auto"
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    coinIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    points: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    pointText: {
        fontSize: 14,
        color: '#555',
        marginVertical: 3,
    },
    boldText: {
        fontWeight: 'bold',
    }
});

export default AccountPointScreen;
