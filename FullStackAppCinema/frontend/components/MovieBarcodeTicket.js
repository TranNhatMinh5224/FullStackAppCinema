import React from 'react';
import { View, Image } from 'react-native';

const MovieBarcodeTicket = ({ ticket, styles }) => (
    <View style={styles.cardInfo}>
        <Image
            source={{ uri: "https://barcode.tec-it.com/barcode.ashx?data=" + ticket.ma_giao_dich }}
            style={styles.barcode}
        />
    </View>
);

export default MovieBarcodeTicket;
