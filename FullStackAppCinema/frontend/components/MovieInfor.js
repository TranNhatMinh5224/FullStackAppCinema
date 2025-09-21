import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import COLORS from "../assets/color";
import { format, parseISO } from 'date-fns';


const MovieInfo = ({ movie, data, setModalVisible }) => {
    return (
        <View style={styles.infoContainer}>
            <View style={styles.head}>
                <Text style={styles.title}>{movie.title}</Text>
                {movie.trang_thai && (
                    <TouchableOpacity style={styles.confirm} onPress={() => setModalVisible(true)}>
                        <Text style={styles.confirmText}>ĐẶT VÉ</Text>
                    </TouchableOpacity>
                )}
            </View>

            {data ? (
                <>
                    {/* Đạo diễn */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.sectionTitle}>Đạo diễn</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.description}>{data.dao_dien}</Text>
                        </View>
                    </View>

                    {/* Diễn viên */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.sectionTitle}>Diễn viên</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.description}>{data.dien_vien}</Text>
                        </View>
                    </View>

                    {/* Thời lượng */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.sectionTitle}>Thời lượng</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.description}>{data.thoi_luong} phút</Text>
                        </View>
                    </View>

                    {/* Thể loại */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.sectionTitle}>Thể loại</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.description}>{data.the_loai}</Text>
                        </View>
                    </View>

                    {/* Ngày khởi chiếu */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.sectionTitle}>Ngày khởi chiếu</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.description}>{format(parseISO(data.ngay_khoi_chieu), 'dd-MM-yyyy')}</Text>
                        </View>
                    </View>

                    {/* Mô tả phim */}
                    <View style={styles.row}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.sectionTitle}>Mô tả phim</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.description}>{data.mo_ta}</Text>
                        </View>
                    </View>
                </>
            ) : (
                <ActivityIndicator size="large" color="#00ff00" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    infoContainer: {
        padding: 20,
    },
    head: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 5,
        fontFamily: "Roboto",
        flex: 1,
        flexWrap: "wrap",
        marginRight: 10,
    },
    confirm: {
        backgroundColor: COLORS.primary,
        width: 150,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    confirmText: {
        fontWeight: 'bold',
        fontFamily: "Roboto",
        color: 'white',

    },
    row: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
    },
    labelContainer: {
        width: '30%',
        paddingRight: 10,
    },
    contentContainer: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 800,
        fontFamily: "Roboto",
        color: 'black',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        fontFamily: "Roboto",
    },
});

export default MovieInfo;