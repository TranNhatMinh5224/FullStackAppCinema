import React from "react";
import { TextInput, View, FlatList, TouchableOpacity, Text } from "react-native";


const Searchbar = ({ searchQuery, setSearchQuery, styles }) => {
    return (
        <View>
            <TextInput
                style={styles.searchBar}
                placeholder="Tìm tên phim..."
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery} // Cập nhật từ khóa tìm kiếm
            />
        </View>
    );
};

export default Searchbar;
