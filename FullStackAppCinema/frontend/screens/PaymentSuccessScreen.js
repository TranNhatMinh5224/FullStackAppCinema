import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { confirmPayOSPayment } from '../service/payosService';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { paymentMethod, success, movie, selectedSeatIds, showtimeId, price, orderCode } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);

  // Xử lý đặt vé khi PayOS thành công
  useEffect(() => {
    if (paymentMethod === 'PayOS' && success === 'true') {
      handlePayOSSuccess();
    } else {
      // Nếu không phải PayOS, hiển thị ngay
      setLoading(false);
    }
  }, [paymentMethod, success]);

  const handlePayOSSuccess = async () => {
    try {
      setLoading(true);
      
      // Lấy orderCode từ URL params
      const orderCode = route.params?.orderCode;
      
      if (!orderCode) {
        Alert.alert("Lỗi", "Thiếu order code");
        return;
      }
      
      console.log('PayOS success, confirming order:', orderCode);
      
      // Gọi PayOS confirm API
      const result = await confirmPayOSPayment(orderCode);
      
      if (result.error === 0) {
        console.log('✅ PayOS booking confirmed:', result);
        setBookingData(result.data);
        
        Alert.alert("Thành công", "Vé đã được đặt và thanh toán thành công!", [
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]);
      } else {
        console.log('❌ PayOS confirm failed:', result);
        Alert.alert("Lỗi", result.message || "Không thể xác nhận đặt vé.");
      }
    } catch (error) {
      console.error('Error confirming PayOS booking:', error);
      Alert.alert("Lỗi", "Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleViewTickets = () => {
    navigation.navigate('PurchasedTicket');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Đang xử lý thanh toán...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={80} color="#4CAF50" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <Text style={styles.subtitle}>Cảm ơn bạn đã sử dụng dịch vụ</Text>

        {/* Order Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Chi tiết giao dịch:</Text>
          <Text style={styles.detailText}>Phương thức: PayOS</Text>
          <Text style={styles.detailText}>Số tiền: 50,000 VND</Text>
          <Text style={styles.detailText}>Trạng thái: Đã thanh toán</Text>
          {bookingData && bookingData.success && (
            <Text style={styles.detailText}>Vé đã được tạo thành công!</Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleViewTickets}>
            <Icon name="ticket-alt" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Xem vé sắp xem</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
            <Icon name="home" size={20} color="#007bff" />
            <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  secondaryButtonText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentSuccessScreen;

