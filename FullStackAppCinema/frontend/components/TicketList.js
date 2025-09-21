import React from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { format, parseISO } from 'date-fns';


const TicketList = ({
    loading,
    selectedTab,
    upcomingTickets,
    watchedTickets,
    styles,
    navigation,
}) => {
    const data = selectedTab === "upcoming" ? upcomingTickets : watchedTickets;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.ticketCard}
            onPress={() => navigation.navigate("TicketDetail", { ticket: item })}
        >
            <View style={styles.ticketLeft}>
                <Text style={styles.title}>{item.ten_phim}</Text>
                <Text style={styles.details}>{format(parseISO(item.ngay_chieu), 'dd-MM-yyyy')}</Text>
                <Text style={styles.details}>Phòng {item.phong_chieu}</Text>
            </View>
            <View style={styles.ticketRight}>
                <Text style={styles.price}>{item.so_tien}đ</Text>
                <Text>Thời hạn điểm: </Text>
                <Text style={styles.expire}>{format(parseISO(item.ngay_chieu), 'dd-MM-yyyy')}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#28a745"
                style={{ marginTop: 20 }}
            />
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.ma_giao_dich}_${item.id}_${index}`}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>Không có vé</Text>}
        />
    );
};

export default TicketList;
