import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TabBar = ({ tabs, onTabSelect, styles }) => {
    const [selectedTab, setSelectedTab] = useState(tabs[1]); // Mặc định chọn tab đầu tiên

    const handleTabPress = (tab) => {
        setSelectedTab(tab);
        onTabSelect(tab); // Gọi callback để cập nhật dữ liệu
    };

    return (
        <View style={styles.navBar}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    style={[styles.tab, selectedTab === tab && styles.activeTab]}
                    onPress={() => handleTabPress(tab)}
                >
                    <Text style={[styles.navItem, selectedTab === tab && styles.active]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TabBar;