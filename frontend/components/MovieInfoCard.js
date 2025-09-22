// components/MovieInfoCard.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { format, parseISO } from 'date-fns';

const MovieInfoCard = ({ movie, selectedDay, selectedTime, selectedSeats, price }) => (
    <View style={styles.card}>
        <Image source={{ uri: movie.image }} style={styles.movieImage} />
        <View style={styles.movieInfo}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.text}>Ngày            {selectedDay}</Text>
            <Text style={styles.text}>Thời lượng  {movie.duration} phút</Text>
            <Text style={styles.text}>Giờ chiếu     {selectedTime.split(':').slice(0, 2).join(':')}</Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                <Text style={styles.text}>Ghế ngồi      </Text>
                {selectedSeats.map((seat, index) => (
                    <Text key={index} style={styles.text}>
                        {seat}{index !== selectedSeats.length - 1 ? ", " : ""}
                    </Text>
                ))}
            </View>

            <Text style={styles.totalPrice}>
                Tổng thanh toán: {price.toLocaleString()}đ
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 10,
        elevation: 3,
    },
    movieImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    movieInfo: {
        flex: 1,
        marginLeft: 10,
    },
    movieTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Roboto",
    },
    text: {
        fontSize: 14,
        color: "#555",
        paddingVertical: 5,
        fontFamily: "Roboto",
    },
    totalPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red",
        marginTop: 5,
        fontFamily: "Roboto",
    },
});

export default MovieInfoCard;
