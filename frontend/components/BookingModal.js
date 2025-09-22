import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const BookingModal = ({
    modalVisible,
    setModalVisible,
    movie,
    availableDates,
    selectedDay,
    setSelectedDay,
    updateTimes,
    selectedTimes,
    handleSelect,
    styles,
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableOpacity
                style={{ height: 350 }}
                onPress={() => setModalVisible(false)}
            />
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{movie.title}</Text>

                    {/* Hiển thị danh sách ngày */}
                    <View style={styles.daysContainer}>
                        {availableDates.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dayItem,
                                    selectedDay === item.date ? styles.activeDayItem : null,
                                ]}
                                onPress={() => {
                                    setSelectedDay(item.date);
                                    updateTimes(item.date);
                                }}
                            >
                                <Text style={styles.dayText}>{item.day}</Text>
                                <Text
                                    style={[
                                        styles.dateText,
                                        selectedDay === item.date ? styles.activeDateText : null,
                                    ]}
                                >
                                    {item.date.split("-")[2]}
                                </Text>
                                {item.hasMovie && <View style={styles.dot} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.dateTimeText}>Ngày {selectedDay}</Text>

                    {/* Hiển thị giờ chiếu */}
                    <View style={styles.timesContainer}>
                        {selectedTimes.length > 0 ? (
                            selectedTimes.map((time, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.timeButton}
                                    onPress={() => handleSelect(time)}
                                >
                                    <Text style={styles.timeText}>{time.slice(0, 5)}</Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noShowtimes}>Không có suất chiếu</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
export default BookingModal;