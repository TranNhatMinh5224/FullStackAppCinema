import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const TabTicket = ({ label, isActive, onPress, styles }) => {
    return (
        <TouchableOpacity
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={onPress}
        >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

export default TabTicket;