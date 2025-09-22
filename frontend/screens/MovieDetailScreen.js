

// export default MovieDetail;
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert } from "react-native"; // Import Alert để hiển thị thông báo
import axios from 'axios';
import Header from '../components/Header';
import MovieInfo from '../components/MovieInfor';
import BookingModal from '../components/BookingModal';
import { getMovieDetails } from '../service/APIservice';
import COLORS from '../assets/color'; // Import màu sắc từ file color.js


const MovieDetail = ({ route, navigation }) => {
    const { movie } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const [data, setData] = useState(null);
    const [button, setButton] = useState(false);



    useEffect(() => {
        const fetchMovieDetails = async () => {
            console.log(movie.id);
            const response = await getMovieDetails(movie.id);
            console.log(response);
            setData(response); // Cập nhật data

        };

        fetchMovieDetails();

    }, [movie.id]); // Chỉ gọi lại khi movie.id thay đổi

    useEffect(() => {
        console.log(movie);
        if (data) {  // Kiểm tra xem data đã có chưa
            loadCurrentUser();
            // loadReviews();
            generateWeek();
            console.log(data.hinh_anh)
        }
    }, [data]); // Thực hiện khi data được set




    // Lấy thông tin user hiện tại
    const loadCurrentUser = async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            if (userData) {
                setCurrentUser(JSON.parse(userData));
            }
        } catch (error) {
            console.error("Lỗi khi tải thông tin user:", error);
        }
    };




    // Lấy danh sách đánh giá từ API với axios





    const handleSelect = async (time) => {

        try {
            const userData = await AsyncStorage.getItem("user");
            console.log(userData)

            if (!userData) {
                // Nếu chưa đăng nhập, hiển thị cảnh báo và chuyển sang trang đăng nhập
                Alert.alert(
                    "Thông báo",
                    "Bạn cần đăng nhập để đặt vé.",
                    [
                        { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
                        { text: "Hủy", style: "cancel" }
                    ]
                );
                return;
            }

            // Tìm id của suất chiếu tương ứng với ngày và giờ đã chọn
            console.log(time)
            const foundDate = data.lich_chieu.find(d => d.ngay_chieu === selectedDay);
            console.log(foundDate)
            const foundShowtime = foundDate ? foundDate.suat_chieu.find(sc => sc.gio_bat_dau === time) : null;

            if (!foundShowtime) {
                Alert.alert("Lỗi", "Không tìm thấy suất chiếu phù hợp!");
                return;
            }

            console.log("Suất chiếu:", foundShowtime.id);

            // Chuyển sang màn hình chọn ghế và truyền thêm id của suất chiếu
            setModalVisible(false);
            navigation.navigate("SelectSeat", {
                movie: movie,
                selectedDay: selectedDay,
                selectedTime: time,
                showtimeId: foundShowtime.id,  // Thêm ID suất chiếu vào params
            });
        } catch (error) {
            console.error("Lỗi khi kiểm tra đăng nhập:", error);
        }
    };



    // Tạo danh sách ngày trong tuần
    const generateWeek = () => {
        const today = new Date('2025-04-13');
        let weekDays = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            let formattedDate = currentDate.toISOString().split('T')[0]; // Lấy định dạng YYYY-MM-DD

            weekDays.push({
                day: getWeekday(currentDate.getDay()), // Lấy tên thứ
                date: formattedDate,
                hasMovie: data.lich_chieu.some(d => d.ngay_chieu === formattedDate) // Kiểm tra xem có phim không
            });


        }


        setAvailableDates(weekDays);
        // Mặc định chọn ngày đầu tiên có phim
        const firstAvailableDate = weekDays.find(d => d.hasMovie);
        if (firstAvailableDate) {
            setSelectedDay(firstAvailableDate.date);
            updateTimes(firstAvailableDate.date);
        }
    };

    // Lấy tên thứ trong tuần
    const getWeekday = (dayIndex) => {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return days[dayIndex];
    };

    // Cập nhật giờ chiếu khi chọn ngày
    const updateTimes = (selectedDate) => {
        const foundDate = data.lich_chieu.find(d => d.ngay_chieu === selectedDate);
        setSelectedTimes(foundDate ? foundDate.suat_chieu.map(sc => sc.gio_bat_dau) : []);


    };


    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <Header title="Chi Tiết Phim" navigation={navigation} />

            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: movie.image }} 
                    style={styles.movieImage}
                    onError={() => console.log('Error loading movie image')}
                    onLoad={() => console.log('Movie image loaded successfully')}
                />
            </View>

            <MovieInfo movie={movie} data={data} setModalVisible={setModalVisible} />

            {/* Modal đặt vé */}
            <BookingModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                movie={movie}
                availableDates={availableDates}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                updateTimes={updateTimes}
                selectedTimes={selectedTimes}
                handleSelect={handleSelect}
                styles={styles}
            />
        </ScrollView >
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
    backButton: {
        padding: 15,
    },
    backButtonText: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
        fontFamily: "Roboto",

    },
    imageContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    movieImage: {
        width: '100%',
        height: 400,
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    modalContainer: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: "Roboto",
        color: '#2C3E50',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    dayItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        marginHorizontal: 4,
    },
    activeDayItem: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    dayText: {
        fontSize: 12,
        fontFamily: "Roboto",

    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: "Roboto",

    },
    activeDateText: {
        color: 'white',
        fontFamily: "Roboto",


    },
    dateTimeText: {
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
        fontFamily: "Roboto",

    },
    timesContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    timeButton: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    timeText: {
        fontSize: 14,
        fontFamily: "Roboto",

    },
    closeButton: {
        backgroundColor: '#E74C3C',
        width: "100%",
        padding: 18,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 15,
        position: "absolute",
        bottom: 20,
        left: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    closeButtonText: {
        fontWeight: 'bold',
        fontFamily: "Roboto",
        color: 'white',
        fontSize: 16,
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: 'red',
        borderRadius: 3,
        position: 'absolute',
        bottom: 1,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    ratingCount: {
        marginLeft: 10,
        fontSize: 14,
        color: "gray",
    },
    starContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },
    commentInput: {
        height: 60,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "white",
    },
    submitButton: {
        backgroundColor: "#98FB98",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    submitText: {
        fontWeight: "bold",
    },
    reviewItem: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    currentUserReview: {
        backgroundColor: "#f0f8ff",
        borderWidth: 1,
        borderColor: "#98FB98",
    },
    userText: {
        fontWeight: "bold",
        fontSize: 14,
    },
    commentText: {
        fontSize: 14,
        marginVertical: 5,
    },
    noReviews: {
        fontSize: 14,
        color: "gray",
    },
});

export default MovieDetail;
