import React from "react";
import { View, FlatList, Image, TouchableOpacity, Text, StyleSheet } from "react-native";

const MovieList = ({ movies, navigation, banner, styles }) => {
    return (
        <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            ListHeaderComponent={() =>
                banner && <Image source={banner} style={styles.banner} />
            }
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("MovieDetail", { movie: item })}
                    style={styles.movieItem}
                >
                    <Image source={{ uri: item.image }} style={styles.movieImage} />
                    <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
                    <Text style={styles.movieDuration}>{item.duration} phút</Text>
                </TouchableOpacity>
            )}
        />
    );
};


export default MovieList;
