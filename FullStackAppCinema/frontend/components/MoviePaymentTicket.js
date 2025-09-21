import React from 'react';
import { View, Text } from 'react-native';

const MoviePaymentTicket = ({ ticket, ticketInfo, styles }) => (
    <View style={styles.cardTotal}>
        <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.paymentMethod}>{ticketInfo.payment}</Text>
            <Text style={styles.label}>Thanh toán</Text>
        </View>
        <View style={styles.totalMoney}>
            <Text style={styles.label}>Tổng tiền</Text>
            <Text style={styles.total}>{ticket.so_tien}đ</Text>
            <Text style={styles.label}>Thời hạn điểm</Text>
            <Text style={styles.expiry}>{ticket.ngay_chieu}</Text>
        </View>
    </View>
);

export default MoviePaymentTicket;
