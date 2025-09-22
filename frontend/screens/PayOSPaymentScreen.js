import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPaymentLink } from '../service/payosService';

const PayOSPaymentScreen = ({ navigation, route }) => {
  const { movie, selectedDay, selectedTime, selectedSeats, selectedSeatIds, showtimeId, price } = route.params;
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState(movie?.title || 'Vé xem phim');
  const [amount, setAmount] = useState(price?.toString() || '50000');
  const [description, setDescription] = useState('Vé xem phim');

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const amountNum = parseInt(amount, 10);
      if (!amountNum || amountNum < 1000) {
        Alert.alert('Lỗi', 'Số tiền phải >= 1000 VND');
        return;
      }

      console.log('Starting PayOS payment...', { productName, amount: amountNum, description });
      console.log('Booking data:', { selectedSeatIds, showtimeId, price });

      // Lấy user_id từ AsyncStorage
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
        navigation.navigate('Login');
        return;
      }
      
      const user = JSON.parse(userData);
      console.log('Current user:', user);
      
      // Tạo booking data với user_id thực
      const bookingData = {
        user_id: parseInt(user.id), // User ID thực từ login
        suat_chieu_id: showtimeId,
        ghe_ids: selectedSeatIds || [385], // Ghế mẫu nếu không có
        tong_gia: amountNum
      };

                  // Lưu booking data vào route params để PayOSSuccessScreen sử dụng
                  const bookingParams = {
                    movie: movie,
                    selectedDay: selectedDay,
                    selectedTime: selectedTime,
                    selectedSeats: selectedSeats,
                    selectedSeatIds: selectedSeatIds,
                    showtimeId: showtimeId,
                    price: amountNum
                  };
                  
                  // Tạo payment link với booking data mới
                  const result = await createPaymentLink({
                    productName: productName,
                    price: amountNum,
                    description: description,
                    returnUrl: `http://192.168.1.11:8000/api/v1/payos/return`,
                    cancelUrl: `http://192.168.1.11:8000/api/v1/payos/return`,
                    userId: bookingData.user_id,
                    showtimeId: bookingData.suat_chieu_id,
                    seatIds: bookingData.ghe_ids,
                    totalPrice: bookingData.tong_gia
                  });

      if (result.error !== 0) {
        throw new Error(result.message);
      }

      // Mở WebView giống demo
      const checkoutUrl = result.data.checkout_url || result.data.checkoutUrl;
      console.log('✅ Payment link created, checkoutUrl:', checkoutUrl);

      if (!checkoutUrl) {
        throw new Error('Không có checkout URL từ PayOS');
      }

      const supported = await Linking.canOpenURL(checkoutUrl);
      if (supported) {
        await Linking.openURL(checkoutUrl);
      } else {
        throw new Error('Cannot open PayOS checkout URL');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Lỗi thanh toán', error.message || 'Đã xảy ra lỗi khi tạo link thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Thanh toán PayOS</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tên sản phẩm:</Text>
          <Text style={styles.value}>{productName}</Text>
          
          <Text style={styles.label}>Số tiền:</Text>
          <Text style={styles.value}>{amount} VND</Text>
          
          <Text style={styles.label}>Mô tả:</Text>
          <Text style={styles.value}>{description}</Text>
          
          <Text style={styles.label}>Ghế đã chọn:</Text>
          <Text style={styles.value}>{selectedSeats?.join(', ') || 'N/A'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Thanh toán PayOS</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PayOSPaymentScreen;
