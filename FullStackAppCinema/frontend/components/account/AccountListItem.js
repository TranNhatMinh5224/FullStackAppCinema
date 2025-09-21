import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View } from 'react-native';
import COLORS from '../../assets/color';

const AccountListItem = ({ icon, label, onPress, iconColor = 'green', textColor = 'black' }) => (
    <TouchableOpacity style={styles.listItem} onPress={onPress}>
        {icon && <Icon name={icon} size={30} color={COLORS.primary} />}
        <Text style={[styles.listText, { color: textColor }]}>{label}</Text>
        <Icon name="chevron-right" size={18} color="gray" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 30,
        paddingHorizontal: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    listText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 15,
        fontFamily: "Roboto",
    },
});

export default AccountListItem;
