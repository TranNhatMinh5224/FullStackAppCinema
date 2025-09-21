import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const AccountAvatar = ({ username }) => (
    <View style={styles.avatarContainer}>
        <Image source={require('../../assets/img/avt-icon.png')} style={styles.avatar} />
        <Text style={styles.username}>{username || "User"}</Text>
    </View>
);

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 50,
        backgroundColor: '#DFFFD6',
        padding: 20,
    },
    username: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: "Roboto",
    },
});

export default AccountAvatar;
