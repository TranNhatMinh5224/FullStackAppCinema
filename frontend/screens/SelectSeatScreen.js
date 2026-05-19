import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { getSeat, postSeat, deleteSeat } from "../service/APIservice";
import { API_BASE_URL } from "../service/APIpath";
import COLORS from "../assets/color";
import Header from "../components/Header";
import { ActivityIndicator } from "react-native";

const SelectSeat = ({ route, navigation }) => {
    const { movie, selectedDay, selectedTime, showtimeId } = route.params;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatData, setSeatData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current; // Animation value for sliding
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const ws = useRef(null);
    const proceededToCheckout = useRef(false);

    const selectedSeatsRef = useRef(selectedSeats);
    const seatDataRef = useRef(seatData);
    const userIdRef = useRef(userId);

    // Đồng bộ giá trị hiện tại của state vào refs để sử dụng an toàn trong hàm cleanup unmount
    useEffect(() => {
        selectedSeatsRef.current = selectedSeats;
    }, [selectedSeats]);

    useEffect(() => {
        seatDataRef.current = seatData;
    }, [seatData]);

    useEffect(() => {
        userIdRef.current = userId;
    }, [userId]);

    // Lấy thông tin user từ bộ nhớ cục bộ
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const user = JSON.parse(userData);
                    setUserId(parseInt(user.id));
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin user từ AsyncStorage:", error);
            }
        };
        fetchUser();
    }, []);

    // Lấy dữ liệu ghế ban đầu
    useEffect(() => {
        const fetchSeatData = async () => {
            setIsLoading(true);
            try {
                const response = await getSeat(showtimeId);
                setSeatData(response || []);
            } catch (error) {
                console.error("Lỗi lấy danh sách ghế:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSeatData();
    }, [showtimeId]);

    // Khởi tạo kết nối WebSocket
    useEffect(() => {
        if (!showtimeId || !userId) return;

        const wsUrl = `${API_BASE_URL.replace(/^http/, "ws")}/ws/${showtimeId}/${userId}`;
        console.log("Đang kết nối WebSocket tới:", wsUrl);

        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log("WebSocket đã kết nối!");
        };

        ws.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log("Tin nhắn WebSocket nhận được:", message);

                if (message.event === "SEATS_LOCKED") {
                    const { ghe_ids, user_id: lockingUserId } = message;
                    // Cập nhật sơ đồ ghế: Ghế của người khác khóa sẽ chuyển màu đỏ (dang_giu)
                    setSeatData((prevData) =>
                        prevData.map((seat) => {
                            if (ghe_ids.includes(seat.id)) {
                                if (lockingUserId !== userId) {
                                    return { ...seat, trang_thai: "dang_giu" };
                                }
                            }
                            return seat;
                        })
                    );
                } else if (message.event === "SEATS_RELEASED") {
                    const { ghe_ids } = message;
                    // Mở khóa ghế về trống
                    setSeatData((prevData) =>
                        prevData.map((seat) => {
                            if (ghe_ids.includes(seat.id)) {
                                return { ...seat, trang_thai: "trong" };
                            }
                            return seat;
                        })
                    );
                } else if (message.event === "ERROR") {
                    Alert.alert("Thông báo", message.message);
                    // Đồng bộ lại sơ đồ ghế thực tế từ server
                    getSeat(showtimeId).then((freshData) => {
                        if (freshData) setSeatData(freshData);
                    });
                }
            } catch (err) {
                console.error("Lỗi parse tin nhắn socket:", err);
            }
        };

        ws.current.onerror = (error) => {
            console.log("Lỗi kết nối WebSocket:", error.message);
        };

        ws.current.onclose = () => {
            console.log("WebSocket đã đóng");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [showtimeId, userId]);

    // Tự động giải phóng ghế qua REST API nếu người dùng hủy/quay lại
    useEffect(() => {
        return () => {
            if (!proceededToCheckout.current && selectedSeatsRef.current.length > 0 && userIdRef.current) {
                const idsToRelease = selectedSeatsRef.current.map((seat) => {
                    const info = seatDataRef.current.find((s) => s.so_ghe === seat);
                    return info ? info.id : null;
                }).filter((id) => id !== null);

                if (idsToRelease.length > 0) {
                    console.log("Giải phóng ghế bằng HTTP trước khi unmount:", idsToRelease);
                    deleteSeat({
                        suat_chieu_id: showtimeId,
                        ghe_ids: idsToRelease,
                        user_id: userIdRef.current,
                    });
                }
            }
        };
    }, [showtimeId]);

    const toggleSeat = (seat) => {
        const seatInfo = seatData.find((s) => s.so_ghe === seat);
        if (!seatInfo) return;

        if (seatInfo.trang_thai === "da_ban") return;
        if (seatInfo.trang_thai === "dang_giu") return;

        const isCurrentlySelected = selectedSeats.includes(seat);
        let updatedSeats;

        if (isCurrentlySelected) {
            updatedSeats = selectedSeats.filter((s) => s !== seat);
            // Hủy giữ ghế qua socket
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(
                    JSON.stringify({
                        action: "RELEASE_SEAT",
                        ghe_ids: [seatInfo.id],
                    })
                );
            }
        } else {
            updatedSeats = [...selectedSeats, seat];
            // Chiếm giữ ghế qua socket
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(
                    JSON.stringify({
                        action: "CHOOSE_SEAT",
                        ghe_ids: [seatInfo.id],
                    })
                );
            }
        }

        setSelectedSeats(updatedSeats);

        if (updatedSeats.length > 0 && !isModalVisible) {
            setIsModalVisible(true);
            slideInModal();
        } else if (updatedSeats.length === 0 && isModalVisible) {
            slideOutModal();
        }
    };

    const slideInModal = () => {
        Animated.timing(slideAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const slideOutModal = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsModalVisible(false));
    };

    const getSeatPrice = (seat) => {
        const seatInfo = seatData.find((s) => s.so_ghe === seat);
        return seatInfo ? seatInfo.gia : 0;
    };

    const totalPrice = selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);

    const selectedSeatIds = selectedSeats.map((seat) => {
        const seatInfo = seatData.find((s) => s.so_ghe === seat);
        return seatInfo ? seatInfo.id : null;
    }).filter((id) => id !== null);


    // Function to organize seats into rows for display
    const organizeSeatsIntoRows = () => {
        // If no data, return empty array
        if (!seatData || seatData.length === 0) return [];

        // Grouping seats into chunks of 8 for display
        const allSeats = [...seatData];
        const seatsPerRow = 8;
        const rows = [];

        for (let i = 0; i < allSeats.length; i += seatsPerRow) {
            rows.push(allSeats.slice(i, i + seatsPerRow));
        }

        return rows;
    };

    const renderSeats = () => {
        const rows = organizeSeatsIntoRows();

        return rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
                {row.map((seatInfo, index) => {
                    const seat = seatInfo.so_ghe;
                    const seatType = seatInfo.loai_ghe;
                    const seatStatus = seatInfo.trang_thai;

                    const isSelected = selectedSeats.includes(seat);
                    const isOccupied = seatStatus === "da_ban";
                    const isHolding = seatStatus === "dang_giu"; // Ghế đang giữ
                    const isVIP = seatType === "VIP";

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.seat,
                                isOccupied ? styles.occupiedSeat :
                                    isSelected ? styles.selectedSeat :
                                        isHolding ? styles.isHolding :
                                            styles.regularSeat,
                            ]}
                            onPress={() => toggleSeat(seat)}
                            disabled={isOccupied}
                        >

                            <Text style={[
                                styles.seatText,
                                isVIP && !isSelected ? styles.vipSeatText : null
                            ]}>{seat}</Text>

                        </TouchableOpacity>
                    );
                })}
            </View>
        ));
    };
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
                <Text style={{ marginBottom: 10 }}>Đang tải danh sách ghế...</Text>
                <ActivityIndicator size="large" color={COLORS.primary || "blue"} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="white" barStyle="dark-content" />

            {/* Header */}
            <Header title="Chọn ghế" navigation={navigation} />

            {/* Screen */}
            <View style={styles.screen}>
                <Text style={styles.screenText}>Màn hình</Text>
            </View>

            {/* Seats */}
            <ScrollView contentContainerStyle={styles.seatContainer}>{renderSeats()}</ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
                <View>
                    <View style={styles.legendItem}>
                        <View style={[styles.box, { backgroundColor: COLORS.ghe_trong }]} />
                        <Text style={styles.legendText}>Ghế trống</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.box, { backgroundColor: COLORS.ghe_dang_dat }]} />
                        <Text style={styles.legendText}>Ghế đang đặt</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.legendItem}>
                        <View style={[styles.box, { backgroundColor: COLORS.ghe_bi_chiem }]} />
                        <Text style={styles.legendText}>Ghế đã đặt</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.box, { backgroundColor: COLORS.ghe_dang_giu }]} />
                        <Text style={styles.legendText}>Ghế bị chiếm</Text>
                    </View>

                </View>
            </View>

            {/* Animated Modal */}
            {isModalVisible && (
                <Animated.View
                    style={[
                        styles.animatedModal,
                        {
                            transform: [
                                {
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [300, 0], // Slide from bottom to top
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalText}>
                            <View style={styles.modalTitle}>
                                <View style={styles.modalMovie}>
                                    <Text style={styles.movieTitle}>{movie.title}</Text>
                                    <Text style={styles.movieSubtitle}>{selectedDay} {selectedTime}</Text>
                                </View>
                                <View style={styles.selectedSeatsContainer}>
                                    {selectedSeats.map((seat, index) => (
                                        <View key={index} style={styles.seatTag}>
                                            <Text style={styles.seatTagText}>{seat}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <Text style={styles.price}>{totalPrice.toLocaleString()} đ</Text>
                            <Text style={styles.ticketCount}>{selectedSeats.length} ghế</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={slideOutModal}>
                            <Icon name="times" size={20} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={() => {
                                slideOutModal();
                                proceededToCheckout.current = true; // Đánh dấu chuyển sang trang checkout để bỏ qua cleanup giải phóng ghế
                                navigation.navigate("Checkout", {
                                    movie: movie,
                                    selectedDay: selectedDay,
                                    selectedTime: selectedTime,
                                    selectedSeats: selectedSeats,
                                    selectedSeatIds: selectedSeatIds, // Truyền danh sách `id` ghế
                                    showtimeId: showtimeId,
                                    price: totalPrice,
                                });
                            }}
                        >
                            <Text style={styles.bookButtonText}>Đặt vé</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 0,
        paddingHorizontal: 0,
        marginTop: 30,
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        color: "white",
        paddingLeft: 10,
        fontFamily: "Roboto", // Added font family
    },
    screen: {
        height: 30,
        backgroundColor: "gray",
        margin: 20,
        marginHorizontal: 50,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 30,  // Bo góc trái trên
        borderTopRightRadius: 30,  // Bo góc phải trên
    },
    screenText: {
        color: "white",
        fontSize: 14,
        fontFamily: "Roboto", // Added font family
    },
    seatContainer: {
        alignItems: "center",
        zIndex: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 5,
    },
    seat: {
        width: 30,
        height: 30,
        backgroundColor: COLORS.ghe_trong,
        alignItems: "center",
        justifyContent: "center",
        margin: 3,
        borderRadius: 5,
    },
    selectedSeat: {
        backgroundColor: COLORS.ghe_dang_dat,
    },
    sweetBoSeat: {
        backgroundColor: "#FF4081",
    },
    occupiedSeat: {
        backgroundColor: COLORS.ghe_bi_chiem,
    },
    isHolding: {
        backgroundColor: COLORS.ghe_dang_giu,
    },
    seatText: {
        fontSize: 12,
        color: COLORS.white,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    legend: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 100,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
    },
    box: {
        width: 60,
        height: 60,
        marginRight: 5,
        borderRadius: 3,
    },
    legendText: {
        color: "black",
        fontSize: 12,
        fontFamily: "Roboto", // Added font family
    },
    modalContainer: {
        flex: 1,
        zIndex: 5,
        justifyContent: "flex-end",
        pointerEvents: "box-none", // Cho phép bấm vào nút chọn ghế
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 5
    },
    modalTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: "bold",
        flexWrap: "wrap",
        fontFamily: "Roboto", // Added font family
    },
    movieSubtitle: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
        fontFamily: "Roboto", // Added font family
    },
    selectedSeatsContainer: {
        flexDirection: "row",
        flexWrap: "wrap", // Allow wrapping to the next line
        justifyContent: "center",
        alignItems: "center",

    },
    seatTag: {
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        padding: 5,
        margin: 2,
    },
    seatTagText: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.white,
        fontFamily: "Roboto", // Added font family
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        fontFamily: "Roboto", // Added font family
    },
    ticketCount: {
        fontSize: 14,
        color: "gray",
        fontFamily: "Roboto", // Added font family
    },
    bookButton: {
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        paddingVertical: 10,
        marginRight: 20,
        position: "absolute",
        right: 10,
    },
    bookButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        paddingHorizontal: 30,
        fontFamily: "Roboto", // Added font family
    },
    closeButton: {
        position: "absolute",
        top: -5,
        right: 10,
        padding: 0,
    },
    animatedModal: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 5,
    },
});

export default SelectSeat;
