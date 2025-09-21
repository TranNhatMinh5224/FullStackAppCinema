import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';




const AccountMember = ({ navigation }) => {
    const barcode = "7589023168141122";

    return (
        <View style={styles.container}>
            {/* Header */}
            {/* Header */}
            <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
                <View >
                    <Icon name="chevron-left" size={20} color="green" />
                </View>
                <Text style={styles.headerTitle}>ACCOUNT MEMBER</Text>

            </TouchableOpacity>
            <View style={styles.cardContainer}>
                <View style={styles.line}></View>
                <Image
                    source={{ uri: `https://barcode.tec-it.com/barcode.ashx?data=${barcode}` }}
                    style={styles.barcode}
                />

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
        marginHorizontal: "auto",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    line: {
        backgroundColor: "black",
        height: 1,
        width: "100%",
        marginVertical: 10,

    },
    logo: {

        height: 30,
        resizeMode: "contain",
        marginBottom: 10,
    },
    barcode: {

        width: "100%",
        height: 100,
        resizeMode: "contain",
    },
    barcodeText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
});

export default AccountMember;
