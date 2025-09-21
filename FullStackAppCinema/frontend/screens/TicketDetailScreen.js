import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Header from "../components/Header";
import MovieInfo from "../components/MovieInfoTicket";
import MovieBookingTicket from "../components/MovieBookingTicket";
import PaymentInfo from "../components/MoviePaymentTicket";
import BarcodeSection from "../components/MovieBarcodeTicket"; // Import BarcodeSection component
import MovieBarcodeTicket from "../components/MovieBarcodeTicket";
import COLORS from "../assets/color";


const TicketDetail = ({ route, navigation }) => {
    const ticketInfo = {
        movie: "Linh miêu",
        type: "C18 | 2D Phụ đề | 109 phút",
        cinema: "Jack Hồ Gươm",
        date: "16/03/2025",
        time: "21:30",
        seats: ["A1", "A2", "A3"], // Danh sách ghế
        payment: "Momo",
        total: "250.000đ",
        points: 7500,
        expiry: "16/09/2025",
        barcode: "7589023168141122",
    };
    const { ticket } = route.params;

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header navigation={navigation} title="Chi tiết vé" />

            {/* Thông tin phim */}
            <MovieInfo ticket={ticket} ticketInfo={ticketInfo} styles={styles} />

            {/* Thông tin đặt vé */}
            <MovieBookingTicket ticket={ticket} ticketInfo={ticketInfo} styles={styles} />

            {/* Thông tin thanh toán */}
            <PaymentInfo ticket={ticket} ticketInfo={ticketInfo} styles={styles} />

            {/* Mã vạch */}
            <MovieBarcodeTicket ticket={ticket} ticketInfo={ticketInfo} styles={styles} />

            {/* Lưu ý */}
            <Text style={styles.note}>Lưu ý: Vui lòng đưa mã số này đến quầy vé để nhận vé.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        marginTop: 30,
    },
    header: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
        borderBottomWidth: 1,
        marginBottom: 10,
        borderColor: "#D9D9D9",
    },
    headerTitle: {
        flex: 1,
        paddingLeft: 20,
        fontSize: 18,
        fontFamily: "Roboto", // Added font family
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    cardInfo: {
        backgroundColor: "#fff",
        padding: 15,
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: "flex-start",
        elevation: 3,
    },
    cardLeft: {
        paddingHorizontal: 20,
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    movieType: {
        color: "gray",
        fontFamily: "Roboto", // Added font family
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 5,
        fontFamily: "Roboto", // Added font family
    },
    value: {
        fontWeight: "bold",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 5,
        fontFamily: "Roboto", // Added font family
    },
    cardRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    cardTotal: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        borderBottomWidth: 2,
        borderColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: "flex-start",
        elevation: 3,
    },
    totalMoney: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderLeftWidth: 2,
        borderColor: "#D9D9D9",
        marginLeft: 100,
        padding: 15,
    },
    paymentMethod: {
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 20,
        marginLeft: 15,
        fontFamily: "Roboto", // Added font family
    },
    total: {
        color: COLORS.primary,
        fontWeight: "bold",
        fontSize: 16,
        fontFamily: "Roboto", // Added font family
    },
    points: {
        color: "red",
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    expiry: {
        color: "red",
        fontFamily: "Roboto", // Added font family
    },
    barcodeContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    barcode: {
        paddingVertical: 20,
        width: "100%",
        height: 100,
        resizeMode: "contain",
    },
    barcodeText: {
        fontSize: 16,
        marginTop: 5,
        fontFamily: "Roboto", // Added font family
    },
    note: {
        textAlign: "center",
        color: "red",
        fontSize: 12,
        fontWeight: "600",
        marginTop: 30,
        fontFamily: "Roboto", // Added font family
    },
});

export default TicketDetail;
