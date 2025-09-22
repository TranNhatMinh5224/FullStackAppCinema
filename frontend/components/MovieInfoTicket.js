import React from 'react';
import { View, Text } from 'react-native';

const MovieInfo = ({ ticket, ticketInfo, styles }) => (
    <View style={styles.card}>
        <Text style={styles.movieTitle}>{ticket.ten_phim}</Text>
        <Text style={styles.movieType}>{ticketInfo.type}</Text>
    </View>
);

export default MovieInfo;
