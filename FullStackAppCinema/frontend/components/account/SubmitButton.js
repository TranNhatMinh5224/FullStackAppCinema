import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import COLORS from "../../assets/color";

const SubmitButton = ({ onPress, loading }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{loading ? "Đang đăng ký..." : "ĐĂNG KÝ"}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        width: "80%",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
});

export default SubmitButton;
