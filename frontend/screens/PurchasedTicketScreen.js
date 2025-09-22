import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from "axios";
import { ticket } from "../service/APIservice";
import Header from "../components/Header"; // Import Header component
import TabTicket from "../components/TabTicket"; // Import TabTicket component
import TicketList from "../components/TicketList";
import COLORS from "../assets/color";
import { UserContext } from "../context/UserContext";





const MyTicketsScreen = ({ route, navigation }) => {
    const { user } = useContext(UserContext);
    const [selectedTab, setSelectedTab] = useState("upcoming"); // "upcoming" hoặc "watched"
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        console.log('User from AsyncStorage:', user);
        const fetchTickets = async () => {
            try {
                console.log('Fetching tickets for user ID:', user?.id);
                const response = await ticket(user?.id);
                console.log('Tickets fetched:', response);
                
                // Lấy data từ response
                if (response && response.success && response.data) {
                    setTickets(response.data);
                } else {
                    setTickets([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu vé:", error);
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [user]);


    // Hiển thị tất cả vé trong tab "Vé sắp xem"
    const upcomingTickets = Array.isArray(tickets) ? tickets : [];
    const watchedTickets = []; // Không có vé đã xem
    
    // Debug log
    console.log('PurchasedTicketScreen - Total tickets:', tickets.length);
    console.log('PurchasedTicketScreen - Upcoming tickets:', upcomingTickets.length);
    console.log('PurchasedTicketScreen - Watched tickets:', watchedTickets.length);

    // Nếu chưa đăng nhập, hiển thị thông báo
    if (!user) {
        return (
            <View style={styles.container}>
                <Header navigation={navigation} title="Vé của tôi" />
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Vui lòng đăng nhập để xem vé của bạn</Text>
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header navigation={navigation} title="Vé của tôi" />

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TabTicket
                    label="Vé sắp xem"
                    isActive={selectedTab === 'upcoming'}
                    onPress={() => setSelectedTab('upcoming')}
                    styles={styles}
                />
                <TabTicket
                    label="Vé đã xem"
                    isActive={selectedTab === 'watched'}
                    onPress={() => setSelectedTab('watched')}
                    styles={styles}
                />
            </View>

            {/* Danh sách vé */}
            <TicketList
                loading={loading}
                selectedTab={selectedTab}
                upcomingTickets={upcomingTickets}
                watchedTickets={watchedTickets}
                styles={styles}
                navigation={navigation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        marginTop: 30,
    },
    header: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: 'white',
        elevation: 2,
        borderBottomWidth: 1,
        borderColor: "#D9D9D9",
    },
    headerTitle: {
        flex: 1,
        paddingLeft: 20,
        fontSize: 18,
        fontFamily: "Roboto", // Added font family
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#fff",
        alignItems: "center",
    },
    tab: {
        width: "50%",
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    activeTab: {
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        fontSize: 16,
        color: "#888",
        fontFamily: "Roboto", // Added font family
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: "bold",
        fontFamily: "Roboto", // Added font family
    },
    ticketCard: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginVertical: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 3,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    ticketLeft: {
        marginHorizontal: 30,
        marginVertical: 20,
        flexShrink: 1, // Prevent text overflow
        maxWidth: "60%", // Limit width
    },
    ticketRight: {
        marginHorizontal: 30,
        borderLeftWidth: 2,
        borderColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
    },
    title: {
        width: "100%",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20,
        fontFamily: "Roboto", // Added font family
    },
    details: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Roboto", // Added font family
    },
    price: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.primary,
        marginVertical: 20,
        fontFamily: "Roboto", // Added font family
    },
    points: {
        fontSize: 14,
        color: "#ff9900",
        marginVertical: 10,
        fontFamily: "Roboto", // Added font family
    },
    expire: {
        fontSize: 12,
        color: "red",
        paddingLeft: 10,
        fontFamily: "Roboto", // Added font family
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "#888",
        marginTop: 20,
        fontFamily: "Roboto", // Added font family
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyTicketsScreen;
