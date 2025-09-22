// components/InfoRow.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InfoRow = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
        alignItems: "center",
    },
    label: {
        fontSize: 14,
        color: "#555",
        fontFamily: "Roboto",
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
});

export default InfoRow;
