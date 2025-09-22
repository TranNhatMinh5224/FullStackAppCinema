import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NavBar from '../components/Navbar';
import TabBar from '../components/TabBar';
import SearchBar from '../components/Searchbar';
import MovieList from '../components/MovieList';
import { getMovies, getMoviesUpcoming } from '../service/APIservice';
import COLORS from '../assets/color';
import { UserContext } from '../context/UserContext';


const HomeScreen = ({ navigation }) => {
    const { user, setUser } = useContext(UserContext);
    const [movies, setMovies] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(-300))[0]; // Menu trượt từ phải vào
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Đang Chiếu");
    const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
    const [filteredMovies, setFilteredMovies] = useState([]); // Danh sách phim sau khi lọc
    const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal tìm kiếm
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger để refresh ticket count


    // Listen for navigation focus để refresh ticket count
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Chỉ refresh khi user đã đăng nhập và chưa refresh gần đây
            if (user) {
                setRefreshTrigger(prev => prev + 1);
            }
        });

        return unsubscribe;
    }, [navigation, user]);

    // Reset refreshTrigger khi user thay đổi
    useEffect(() => {
        if (!user) {
            setRefreshTrigger(0);
        }
    }, [user]);



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
        setUser(null); // Xoá thông tin tài khoản từ UserContext
        navigation.replace("Home"); // Chuyển về màn hình đăng nhập
    };

    return (
        <TouchableWithoutFeedback onPress={closeMenuIfNeeded}>
            <View style={styles.container}>
                <StatusBar translucent={false} backgroundColor="#F6F6F6" barStyle="dark-content" />
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
        flex: 1,
        backgroundColor: '#F6F6F6',
        paddingTop: 0,
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
        backgroundColor: '#FFFFFF', 
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderRadius: 25,
        marginHorizontal: 20,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    banner: {
        width: "95%",
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    movieItem: {
        flex: 1, 
        alignItems: 'center', 
        margin: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    movieImage: { 
        width: 110, 
        height: 160, 
        borderRadius: 12, 
        resizeMode: 'cover',
        marginBottom: 8,
    },
    movieTitle: {
        fontSize: 14, 
        fontWeight: 'bold', 
        textAlign: 'center',
        fontFamily: "Roboto",
        color: '#2C3E50',
        marginBottom: 4,
    },
    movieDuration: { 
        fontSize: 12, 
        color: '#7F8C8D', 
        fontFamily: "Roboto",
        textAlign: 'center',
    },
    searchModal: {
        position: "absolute",
        top: 200,
        left: 20,
        right: 20,
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 8,
        zIndex: 1000,
        maxHeight: 250,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    searchResultItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
    },
    searchResultText: {
        fontSize: 16,
        fontFamily: "Roboto",
        color: '#2C3E50',
    },
});

export default HomeScreen;
