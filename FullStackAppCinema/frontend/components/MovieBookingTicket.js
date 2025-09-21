import React from 'react';
import { View, Text } from 'react-native';
import { format, parseISO } from 'date-fns';

const MovieBookingTicket = ({ ticket, ticketInfo, styles }) => (
    <View style={styles.cardInfo}>
        <View style={styles.cardLeft}>
            <Text style={styles.label}>Rạp chiếu</Text>
            <Text style={styles.label}>Ngày chiếu</Text>
            <Text style={styles.label}>Giờ chiếu</Text>
            <Text style={styles.label}>Phòng chiếu</Text>
            <Text style={styles.label}>Ghế ngồi</Text>
        </View>
        <View style={styles.cardRight}>
            <Text style={styles.value}>{ticketInfo.cinema}</Text>
            <Text style={styles.value}>{format(parseISO(ticket.ngay_chieu), 'dd-MM-yyyy')}</Text>
            <Text style={styles.value}>{ticket.gio_bat_dau.split(':').slice(0, 2).join(':')}</Text>
            <Text style={styles.value}>{ticket.phong_chieu}</Text>
            <Text style={styles.value}>{ticket.danh_sach_ghe.join(', ')}</Text>
        </View>
    </View>
);

export default MovieBookingTicket;
