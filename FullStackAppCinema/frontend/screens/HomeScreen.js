import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavBar from '../components/Navbar';
import TabBar from '../components/TabBar';
import SearchBar from '../components/Searchbar';
import MovieList from '../components/MovieList';
import { getMovies, getMoviesUpcoming } from '../service/APIservice';
import COLORS from '../assets/color';


const HomeScreen = ({ navigation }) => {
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-300))[0]; // Menu trượt từ phải vào
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Đang Chiếu");
    const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
    const [filteredMovies, setFilteredMovies] = useState([]); // Danh sách phim sau khi lọc
    const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal tìm kiếm
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger để refresh ticket count

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    console.log('HomeScreen: User loaded from AsyncStorage:', parsedUser);
                    setUser(parsedUser);
                } else {
                    console.log('HomeScreen: No user data in AsyncStorage');
                    setUser(null);
                }
            } catch (error) {
                console.error('HomeScreen: Error loading user:', error);
                setUser(null);
            }
        };
        fetchUser();

    }, []);

    // Listen for navigation focus để refresh ticket count
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setRefreshTrigger(prev => prev + 1);
        });

        return unsubscribe;
    }, [navigation]);



    useEffect(() => {
        const fetchMovies = async () => {
            const showingMovies = await getMovies();
            const upcoming = await getMoviesUpcoming();
            setMovies(showingMovies);
            setUpcomingMovies(upcoming);
        };

        fetchMovies();

    }, []);

    // Xử lý tìm kiếm
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredMovies([]); // Nếu không có từ khóa, không hiển thị kết quả
            setIsModalVisible(false); // Ẩn modal
        } else {
            const results = movies.filter(movie =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMovies(results);
            setIsModalVisible(true); // Hiển thị modal khi có kết quả
        }
    }, [searchQuery, movies]);




    const toggleMenu = () => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: -300, // Ẩn menu
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0, // Hiện menu
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: false,
            }).start();
        }
    };

    const closeMenuIfNeeded = () => {
        if (menuVisible) {
            toggleMenu(); // Đóng menu nếu đang mở
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user"); // Xoá thông tin tài khoản
        navigation.replace("Home"); // Chuyển về màn hình đăng nhập
    };

    return (
        <TouchableWithoutFeedback onPress={closeMenuIfNeeded}>
            <View style={styles.container}>
                <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
                <NavBar user={user} refreshTrigger={refreshTrigger} />

                <TabBar tabs={["Sắp Chiếu", "Đang Chiếu"]} onTabSelect={(tab) => setSelectedTab(tab)} styles={styles} />

                {/* Thanh tìm kiếm */}
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} styles={styles} />

                {isModalVisible && (
                    <View style={styles.searchModal}>
                        <FlatList
                            data={filteredMovies}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsModalVisible(false); // Đóng modal
                                        navigation.navigate('MovieDetail', { movie: item });
                                    }}
                                    style={styles.searchResultItem}
                                >
                                    <Text numberOfLines={1} style={styles.searchResultText}>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
                {/* Danh sách phim */}
                <MovieList
                    movies={selectedTab === "Đang Chiếu" ? movies : upcomingMovies}
                    navigation={navigation}
                    banner={require("../assets/img/banner.png")}
                    styles={styles}

                />





            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        flex: 1,
        backgroundColor: '#F6F6F6',
        justifyContent: "center",
        width: "100%",
    },
    header: {
        width: "100%",
        fontSize: 20, fontWeight: 'bold',
        fontFamily: "Roboto",
    },
    navBar: {
        flexDirection: 'row', justifyContent: 'space-around',
        backgroundColor: "#FFFFFF",
        width: "100%",
        fontFamily: "Roboto",
    },
    navItem: {
        fontSize: 16, color: '#888',
        padding: 10,
        paddingVertical: 20,
        fontFamily: "Roboto",
    },
    active: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontFamily: "Roboto",
    },
    tab: {
        width: "50%",
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
        justifyContent: "center",
        alignItems: "center"
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    searchBar: {
        backgroundColor: '#FFFFFF', padding: 10, borderRadius: 20,
        width: "90%",
        margin: 20,
    },
    banner: {
        width: "95%",
        marginHorizontal: "auto",
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20
    },
    movieItem: {
        flex: 1, alignItems: 'center', margin: 5,
    },
    movieImage: { width: 100, height: 150, borderRadius: 8, resizeMode: 'cover' },
    movieTitle: {
        fontSize: 14, fontWeight: 'bold', textAlign: 'center',
        fontFamily: "Roboto",
    },
    movieDuration: { fontSize: 12, color: '#666', fontFamily: "Roboto", },
    searchModal: {
        position: "absolute",
        top: 170, // Hiển thị ngay dưới thanh tìm kiếm
        left: 20,
        right: 20,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 5,
        zIndex: 1000,
        maxHeight: 200, // Giới hạn chiều cao
    },
    searchResultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    searchResultText: {
        fontSize: 16,
        fontFamily: "Roboto",
    },
});

export default HomeScreen;
