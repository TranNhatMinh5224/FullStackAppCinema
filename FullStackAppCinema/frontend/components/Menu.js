import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const Menu = ({ slideAnim, menuVisible, handleUserPress, navigation, handleLogout, styles }) => {
    if (!menuVisible) return null;
    return (
        <Animated.View style={[styles.menuContainer, { right: slideAnim }]}>
            <TouchableOpacity style={styles.menuItem}>
                <Icon name="bell" size={24} color="gray" />
                <Text style={styles.menuText}>Thông báo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleUserPress}>
                <Icon name="user" size={24} color="gray" />
                <Text style={styles.menuText}>Tài khoản</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("PurchasedTicket")}>
                <Icon name="ticket-alt" size={24} color="gray" />
                <Text style={styles.menuText}>Vé</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
                <Icon name="cog" size={24} color="gray" />
                <Text style={styles.menuText}>Cài đặt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Icon name="sign-out-alt" size={24} color="red" />
                <Text style={[styles.menuText, { color: "red" }]}>Đăng xuất</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default Menu;
