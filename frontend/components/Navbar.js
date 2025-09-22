import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Modal, Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from '../assets/color';
import { ticket } from "../service/APIservice";

const MENU_WIDTH = 200;

const NavBar = ({ user, refreshTrigger }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [ticketCount, setTicketCount] = useState(0);
    const slideAnim = useRef(new Animated.Value(MENU_WIDTH)).current; // Bắt đầu ngoài màn hình
    const navigation = useNavigation();
    
    console.log('Navbar rendered with user:', user, 'refreshTrigger:', refreshTrigger);

    useEffect(() => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: MENU_WIDTH,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [menuVisible]);

    const fetchTickets = async () => {
        if (user && user.id) {
            try {
                console.log('Navbar fetching tickets for user ID:', user.id);
                const result = await ticket(user.id);
                console.log('Navbar ticket result:', result);
                
                // Xử lý response từ API
                if (result && result.success && Array.isArray(result.data)) {
                    setTicketCount(result.data.length);
                    console.log('Navbar ticket count set to:', result.data.length);
                    console.log('Navbar tickets:', result.data.map(t => t.ten_phim));
                } else if (Array.isArray(result)) {
                    setTicketCount(result.length);
                    console.log('Navbar ticket count set to (array):', result.length);
                } else {
                    setTicketCount(0);
                    console.log('Navbar ticket count set to 0 (no data)');
                }
            } catch (error) {
                console.error('Error fetching tickets for navbar:', error);
                setTicketCount(0);
            }
        } else {
            console.log('Navbar: No user or user.id, setting ticket count to 0');
            setTicketCount(0);
        }
    };

    useEffect(() => {
        console.log('Navbar useEffect triggered - user:', user, 'refreshTrigger:', refreshTrigger);
        fetchTickets();
    }, [user, refreshTrigger]);

    const handleUserPress = () => {
        if (user) {
            navigation.navigate("Account", { user: user });
        } else {
            navigation.navigate("Login");
        }
    };

    const handleTicketPress = () => {
        if (user) {
            navigation.navigate("PurchasedTicket", { user: user });
        } else {
            navigation.navigate("Login");
        }
    };

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const closeMenuIfNeeded = () => {
        setMenuVisible(false);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        navigation.replace("Home");
    };

    return (
        <>
            <View style={styles.navicon}>
                <TouchableOpacity onPress={handleUserPress} style={styles.userContainer}>
                    {user ? (
                        <>
                            <Image source={require("../assets/img/avt-icon.png")} style={styles.avatar} />
                            <Text style={styles.username}>{user.name}</Text>
                        </>
                    ) : (
                        <Icon name="user-alt" size={30} color={COLORS.primary} style={styles.icon} />
                    )}
                </TouchableOpacity>
                <View style={styles.naviconright}>
                    <TouchableOpacity onPress={handleTicketPress} style={styles.iconButton}>
                        <Icon name="ticket-alt" size={30} color={COLORS.primary} style={styles.icon} />
                        {user && ticketCount > 0 && (
                            <Text style={styles.numberTicket}>{ticketCount}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
                        <Icon name="bars" size={30} color={COLORS.primary} style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={menuVisible}
                transparent
                animationType="none"
                onRequestClose={closeMenuIfNeeded}
            >
                <TouchableWithoutFeedback onPress={closeMenuIfNeeded}>
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0)" }}>
                        <Animated.View
                            style={[
                                styles.menuContainer,
                                {
                                    width: MENU_WIDTH,
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                    transform: [{ translateX: slideAnim }]
                                }
                            ]}
                        >
                            <TouchableOpacity style={styles.menuItem}>
                                <Icon name="bell" size={24} color="gray" />
                                <Text style={styles.menuText}>Thông báo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleUserPress}>
                                <Icon name="user" size={24} color="gray" />
                                <Text style={styles.menuText}>Tài khoản</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={handleTicketPress}>
                                <Icon name="ticket-alt" size={24} color="gray" />
                                <Text style={styles.menuText}>Vé</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem}>
                                <Icon name="cog" size={24} color="gray" />
                                <Text style={styles.menuText}>Cài đặt</Text>
                            </TouchableOpacity>
                            {user && (
                                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                    <Icon name="sign-out-alt" size={24} color="red" />
                                    <Text style={[styles.menuText, { color: "red" }]}>Đăng xuất</Text>
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    navicon: {
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 4,
    },
    naviconright: {
        flexDirection: "row",
        alignItems: "center",
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    username: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: "Roboto",
        fontWeight: 'bold',
        marginLeft: 8,
    },
    icon: {
        margin: 8,
        paddingHorizontal: 0
    },
    iconButton: {
        position: "relative",
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        marginHorizontal: 2,
    },
    avatar: {
        width: 35,
        height: 35,
        margin: 8,
        paddingHorizontal: 0,
        borderRadius: 17.5,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    menuContainer: {
        backgroundColor: "rgba(255,255,255,0.95)",
        paddingTop: 60,
        paddingHorizontal: 25,
        paddingLeft: "15%",
        shadowColor: '#000',
        shadowOffset: {
            width: -2,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 8,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 2,
    },
    menuText: {
        color: "#2C3E50",
        fontSize: 16,
        marginLeft: 15,
        fontFamily: "Roboto",
        fontWeight: '500',
    },
    numberTicket: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#E74C3C",
        color: "white",
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        textAlign: "center",
        lineHeight: 24,
        fontSize: 12,
        fontWeight: "bold",
        borderWidth: 2,
        borderColor: 'white',
    }
});

export default NavBar;
