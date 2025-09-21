import React from 'react';
import { View, StyleSheet } from 'react-native';

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
    separator: {
        height: 40,
        backgroundColor: '#F4F4F4',
    },
});

export default Separator;
