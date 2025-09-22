import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Image, StatusBar } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { getSeat, postSeat } from "../service/APIservice";
import COLORS from "../assets/color";
import Header from "../components/Header";
import { ActivityIndicator } from "react-native";
import wsService from '../service/WebSocketService';




const SelectSeat = ({ route, navigation }) => {
    const { movie, selectedDay, selectedTime, showtimeId } = route.params;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatData, setSeatData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current; // Animation value for sliding
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
    
    // Debug: Log movie data once
    useEffect(() => {
        console.log('SelectSeat - movie data:', movie);
        console.log('SelectSeat - movie.ten_phim:', movie?.ten_phim);
        console.log('SelectSeat - movie.title:', movie?.title);
    }, []);
    
    useEffect(() => {
        if (timeLeft <= 0) {
            // Hết giờ thì quay về màn hình chính
            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }], // tên màn hình chính trong stack navigator của bạn
            });
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);




    // Fetch seat data from API
    useEffect(() => {
        // For now, we'll use the static data
        console.log(showtimeId)


        // If you want to fetch from API later:
        const fetchSeatData = async () => {
            setIsLoading(true); // bắt đầu loading
            try {
                const response = await getSeat(showtimeId);
                const limited = (response || []).slice(0, 54); // <-- chỉ giữ 48 ghế
                setSeatData(limited);
            } catch (error) {
                console.error("Lỗi lấy ghế:", error);
            } finally {
                setIsLoading(false); // kết thúc loading
            }
        };

        const getUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                const user = JSON.parse(userData);
                setUserId(user.id);
            } catch (error) {
                console.error("Lỗi lấy user:", error);
            }
        };

        fetchSeatData();
        getUser();


    }, []);

    useEffect(() => {
        if (!userId || !showtimeId) return;

        // Connect WebSocket
        wsService.connect(showtimeId, userId);

        const handleMessage = (msg) => {
            console.log('WebSocket message:', msg);
            const type = msg.type;
            if (type === 'locked') {
                const seatId = msg.seatId;
                setSeatData(prev => prev.map(seat => 
                    seat.id == seatId ? { ...seat, trang_thai: 'dang_giu', owner: msg.userId } : seat
                ));
                // Nếu ghế này đang được chọn bởi user khác, bỏ chọn local
                if (String(msg.userId) !== String(userId)) {
                    setSelectedSeats(prev => prev.filter(s => {
                        const seatInfo = seatData.find(se => se.so_ghe === s);
                        return seatInfo && seatInfo.id != seatId;
                    }));
                }
            } else if (type === 'available') {
                const seatId = msg.seatId;
                setSeatData(prev => prev.map(seat => 
                    seat.id == seatId ? { ...seat, trang_thai: 'available', owner: null } : seat
                ));
            } else if (type === 'reserved') {
                const seatId = msg.seatId;
                setSeatData(prev => prev.map(seat => 
                    seat.id == seatId ? { ...seat, trang_thai: 'da_ban', owner: msg.userId } : seat
                ));
                setSelectedSeats(prev => prev.filter(s => {
                    const seatInfo = seatData.find(se => se.so_ghe === s);
                    return seatInfo && seatInfo.id != seatId;
                }));
            }
        };

        wsService.addListener(handleMessage);

        return () => {
            wsService.removeListener(handleMessage);
            wsService.disconnect();
        };
    }, [userId, showtimeId]);

    const toggleSeat = (seat) => {
        // Find the seat data
        const seatInfo = seatData.find(s => s.so_ghe === seat);

        // If seat is already sold, don't allow selection
        if (seatInfo && seatInfo.trang_thai === "da_ban") return;
        if (seatInfo && seatInfo.trang_thai === "dang_giu" && String(seatInfo.owner) !== String(userId)) return; // Nếu đang giữ bởi user khác
        if (!selectedSeats.includes(seat) && selectedSeats.length >= 5) {
            Alert.alert("Giới hạn", "Bạn chỉ được chọn tối đa 5 ghế.");
            return;
        }

        if (selectedSeats.includes(seat)) {
            // Unlock
            wsService.unlock(seatInfo.id);
            setSelectedSeats(prev => prev.filter(s => s !== seat));
        } else {
            // Lock
            wsService.lock(seatInfo.id);
            setSelectedSeats(prev => [...prev, seat]);
        }

        // Show modal if there are selected seats
        const updatedSeats = selectedSeats.includes(seat) ? selectedSeats.filter(s => s !== seat) : [...selectedSeats, seat];
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
        const seatInfo = seatData.find(s => s.so_ghe === seat);
        return seatInfo ? seatInfo.gia : 0;
    };

    const totalPrice = selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);

    // Lấy danh sách `id` của ghế đã chọn
    const selectedSeatIds = selectedSeats.map(seat => {
        const seatInfo = seatData.find(s => s.so_ghe === seat);
        return seatInfo ? seatInfo.id : null;
    }).filter(id => id !== null); // Loại bỏ các giá trị `null`

    const postghe = async (selectedSeatIds, showtimeId) => {
        const userData = await AsyncStorage.getItem("user");
        const user = JSON.parse(userData)
        const data = {
            suat_chieu_id: showtimeId,
            ghe_ids: selectedSeatIds,
            user_id: parseInt(user.id),

        };
        console.log(data)
        try {



            const response = await postSeat(data);
            console.log("Đặt ghế thành công:", response);







        } catch (error) {

            console.error("Lỗi đăt ghe:", error);

        }

    };

    // Function to organize seats into rows for display
    const organizeSeatsIntoRows = () => {
        // If no data, return empty array
        if (!seatData || seatData.length === 0) return [];

        // Grouping seats into chunks of 8 for display
        const allSeats = [...seatData];
        const seatsPerRow = 9;
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
                            disabled={isOccupied || (isHolding && String(seatInfo.owner) !== String(userId))}
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
                <Image source={require('../assets/ic-screen.png')} style={styles.screenImage} />
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
                                postghe(selectedSeatIds, showtimeId);
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
                        <View style={{
                            alignItems: "center", marginTop: 10, position: "absolute", position: "absolute",
                            bottom: 10,
                            right: 50
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: COLORS.primary }}>
                                {Math.floor(timeLeft / 60)
                                    .toString()
                                    .padStart(2, "0")}
                                :
                                {(timeLeft % 60).toString().padStart(2, "0")}
                            </Text>
                        </View>

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
        height: 40,
        // backgroundColor: "gray",
        width: "100%",
        marginVertical: 40,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 100,  // Bo góc trái trên
        borderTopRightRadius: 100,  // Bo góc phải trên
    },
    screenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
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
        width: 27,
        height: 27,
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
        flexDirection: "column",
        gap: 8,            // nếu RN chưa hỗ trợ gap thì bỏ
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
        flexWrap: "wrap",
        alignItems: "center",
        flexShrink: 1,        // tránh tràn khi nằm chung block
        maxWidth: "100%",

    },
    seatTag: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        margin: 2,
    },
    moreTag: {
        backgroundColor: "#E0E0E0",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        margin: 2,
    },
    moreTagText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#333",
        fontFamily: "Roboto",

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
