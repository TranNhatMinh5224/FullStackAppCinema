import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from "axios"; // ✅ Thêm axios để gọi API
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkout } from "../service/APIservice";
import Header from "../components/Header"; // Import Header component

import MovieInfoCard from "../components/MovieInfoCard";
import InfoRow from "../components/InfoRow";
import COLORS from "../assets/color";
import { deleteSeat } from '../service/APIservice'; // Import deleteSeat function




const CheckoutScreen = ({ route, navigation }) => {
    const { movie, selectedDay, selectedTime, selectedSeats, selectedSeatIds, showtimeId, price } = route.params;
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('payos'); // 'momo' or 'payos'


    const handlePayment = async () => {
        if (paymentMethod === 'payos') {
            // Chuyển đến màn hình thanh toán PayOS
            navigation.navigate('PayOSPayment', {
                movie: movie,
                selectedDay: selectedDay,
                selectedTime: selectedTime,
                selectedSeats: selectedSeats,
                selectedSeatIds: selectedSeatIds,
                showtimeId: showtimeId,
                price: price
            });
            return;
        }

        // Xử lý thanh toán MOMO (code cũ)
        setLoading(true);
        const userData = await AsyncStorage.getItem("user");
        const user = JSON.parse(userData)

        try {
            const data = {
                suat_chieu_id: showtimeId,
                ghe_ids: selectedSeatIds,
                user_id: parseInt(user.id),
                phuong_thuc_thanh_toan: "MOMO",
                tong_gia: parseFloat(price),
            };
            console.log(data)
            // Gửi dữ liệu đặt vé lên MockAPI
            const response = await checkout(data);
            console.log(response.data);

            setLoading(false);
            Alert.alert("Thành công", response.trang_thai, [
                { text: "OK", onPress: () => navigation.navigate("Home") },
            ]);

        } catch (error) {
            setLoading(false);
            console.log("Lỗi thanh toán:", error);
            let errorMessage = "Đặt vé không thành công. Vui lòng thử lại.";
            if (error.response && error.response.data) {
                if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                } else if (error.response.data.trang_thai) {
                    errorMessage = error.response.data.trang_thai;
                }
            }
            Alert.alert("Đặt vé không thành công", errorMessage, [
                { text: "OK", onPress: () => navigation.navigate("Home") },
            ]);
        }
    };


    const ticketInfo = {


        discount: 0, // Giảm giá
        pointsUsed: 0,
        finalPrice: 250000,
    };


    const backDelete = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (!userData) {
                console.warn("No user data found, cannot delete seats");
                navigation.goBack();
                return;
            }

            const user = JSON.parse(userData);
            if (!user || !user.id) {
                console.warn("Invalid user data, cannot delete seats");
                navigation.goBack();
                return;
            }

            const data = {
                suat_chieu_id: showtimeId,
                ghe_ids: selectedSeatIds,
                user_id: parseInt(user.id),
            };

            console.log(data);

            const result = await deleteSeat(data);

            if (result) {
                navigation.goBack();
            } else {
                console.warn("Không thể xoá ghế. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error deleting seats:", error);
        }
    };

    const [secondsLeft, setSecondsLeft] = useState(120); // 2 phút = 120 giây

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Sử dụng setTimeout để tránh setState during render
                    setTimeout(() => {
                        backDelete();
                        navigation.navigate("Home");
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // cleanup
    }, []);



    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="white" barStyle="dark-content" />

            {/* Tiêu đề */}
            {/* <Header navigation={navigation} title="Thanh Toán" /> */}
            <TouchableOpacity style={styles.header} onPress={backDelete}>
                <Icon name="chevron-left" size={20} color={COLORS.primary} />
                <Text style={styles.headerTitle}>Thanh Toán</Text>
            </TouchableOpacity>

            {/* Thông tin phim */}
            <MovieInfoCard movie={movie} selectedDay={selectedDay} selectedTime={selectedTime} price={price} selectedSeats={selectedSeats} />

            {/* Thông tin vé */}

            <Text style={styles.sectionTitle}>THÔNG TIN VÉ</Text>

            <InfoRow label={"Số lượng"} value={selectedSeats.length} />

            <InfoRow label={"Tổng"} value={price.toLocaleString() + "đ"} />


            {/* Tổng kết */}

            <Text style={styles.sectionTitle}>TỔNG KẾT</Text>


            <InfoRow label={"Giảm giá"} value={ticketInfo.discount.toLocaleString() + "đ"} />

            <InfoRow label={"Tổng cộng"} value={price.toLocaleString() + "đ"} />

            {/* Chọn phương thức thanh toán */}
            <Text style={styles.sectionTitle}>PHƯƠNG THỨC THANH TOÁN</Text>

            <View style={styles.paymentMethodContainer}>
                <TouchableOpacity
                    style={[styles.paymentMethodOption, paymentMethod === 'momo' && styles.paymentMethodSelected]}
                    onPress={() => setPaymentMethod('momo')}
                >
                    <View style={styles.paymentMethodContent}>
                        <Icon name="mobile-alt" size={24} color={paymentMethod === 'momo' ? COLORS.primary : '#666'} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'momo' && styles.paymentMethodTextSelected]}>
                            MOMO
                        </Text>
                    </View>
                    {paymentMethod === 'momo' && <Icon name="check-circle" size={20} color={COLORS.primary} />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.paymentMethodOption, paymentMethod === 'payos' && styles.paymentMethodSelected]}
                    onPress={() => setPaymentMethod('payos')}
                >
                    <View style={styles.paymentMethodContent}>
                        <Icon name="account-balance" size={24} color={paymentMethod === 'payos' ? COLORS.primary : '#666'} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'payos' && styles.paymentMethodTextSelected]}>
                            PayOS
                        </Text>
                    </View>
                    {paymentMethod === 'payos' && <Icon name="check-circle" size={20} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>

            {/* Nút thanh toán */}
            <Text style={{
                textAlign: 'center',
                fontSize: 14,
                color: COLORS.ghe_bi_chiem,
                marginTop: 10,
                fontWeight: 'bold',
            }}>
                {`Thời gian giữ ghế: ${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0')}`}
            </Text>

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
                <Text style={styles.payButtonText}>{loading ? "Đang thanh toán..." : "Thanh Toán"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        paddingLeft: 20,
        fontSize: 20,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        elevation: 3,
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    movieInfo: {
        flex: 1,
        marginLeft: 10,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    text: {
        fontSize: 14,
        color: "#555",
        paddingVertical: 5,
        fontFamily: "Roboto", // Added font family
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red",
        marginTop: 5,
        fontFamily: "Roboto", // Added font family
    },
    sectionTitle: {
        fontSize: 16,
        color: '#34495E',
        padding: 20,
        paddingBottom: 10,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 2,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 14,
        color: "#555",
        fontFamily: "Roboto", // Added font family
    },
    value: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    arrow: {
        color: "#007bff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    payButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 30,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    payButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Roboto",
        letterSpacing: 0.5,
    },
    paymentMethodContainer: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    paymentMethodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D9D9D9',
    },
    paymentMethodSelected: {
        backgroundColor: '#E3F2FD',
    },
    paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentMethodText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 15,
        fontFamily: "Roboto",
    },
    paymentMethodTextSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
