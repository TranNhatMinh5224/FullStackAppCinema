import React from "react";
import { View, Image, StyleSheet } from "react-native";

const NavigationIcons = () => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/img/avt-icon.png')

                }
                style={styles.icon}
            />
            <View style={styles.rightIcons}>
                <Image
                    source={require('../assets/img/voucher-icon.png')}
                    style={styles.icon}
                />
                <Image
                    source={require('../assets/img/menu-icon.svg')}
                    style={styles.icon}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 379,
        alignItems: "center",
        marginTop: 4,
    },
    rightIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    icon: {
        width: 30,
        height: 30,
    },
});

export default NavigationIcons;
