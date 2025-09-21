import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MovieCategories = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.category}>SẮP CHIẾU</Text>
            <Text style={[styles.category, styles.activeCategory]}>ĐANG CHIẾU</Text>
            <Text style={[styles.category, styles.earlyShowingCategory]}>
                SUẤT CHIẾU SỚM
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        maxWidth: 366,
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 11,
    },
    category: {
        fontFamily: "Roboto",
        fontSize: 13,
        color: "#000000",
        fontWeight: "500",
        textAlign: "center",
        lineHeight: 26,
    },
    activeCategory: {
        color: "#4CDE4C",
    },
    earlyShowingCategory: {
        flex: 1,
        maxWidth: 91,
    },
});

export default MovieCategories;
