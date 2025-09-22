import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const MovieItem = ({ movie, navigation, styles }) => {
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('MovieDetail', { movie })}
            style={styles.movieItem}
        >
            <Image source={{ uri: movie.image }} style={styles.movieImage} />
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.movieDuration}>{movie.duration} phút</Text>
        </TouchableOpacity>
    );
};

export default MovieItem;
