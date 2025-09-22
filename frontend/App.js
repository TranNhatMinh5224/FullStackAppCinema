import React, { useCallback, useEffect, useState, useContext } from 'react';
import { View, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen'; // Import SplashScreen
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import MovieDetailScreen from './screens/MovieDetailScreen';
import AccountScreen from './screens/Account/AccountScreen';
import AccountInfoScreen from './screens/Account/AccountInfoScreen';
import ChangePasswordScreen from './screens/Account/ChangePasswordScreen';
import SelectSeatScreen from './screens/SelectSeatScreen';
import PurchasedTicketScreen from "./screens/PurchasedTicketScreen";
import TicketDetailScreen from './screens/TicketDetailScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import AccountMemberScreen from './screens/Account/AccountMemberScreen';
import AccountPointScreen from './screens/Account/AccountPointScreen';
import AccountGiftScreen from './screens/Account/AccountGiftScreen';
import PayOSPaymentScreen from './screens/PayOSPaymentScreen';
import PaymentSuccessScreen from './screens/PaymentSuccessScreen';
import PaymentFailScreen from './screens/PaymentFailScreen';
import { UserProvider, UserContext } from './context/UserContext';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

const AppContent = () => {
  const [fontsLoaded] = useFonts({
    'Roboto': require('./assets/fonts/Roboto/static/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto/static/Roboto-Bold.ttf'),
    'Roboto-Italic': require('./assets/fonts/Roboto/static/Roboto-Italic.ttf'),
  });

  const { isLoading: userLoading } = useContext(UserContext);
  const [appIsReady, setAppIsReady] = useState(false);
  const [navigationRef, setNavigationRef] = useState(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Giữ màn hình Splash hiển thị cho đến khi app sẵn sàng
        await SplashScreen.preventAutoHideAsync();
        // Tải các tài nguyên cần thiết (nếu có)
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  // Xử lý deep link từ PayOS
  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log('Deep link received:', event);
      
      // Extract URL from event
      let url = '';
      if (typeof event === 'string') {
        url = event;
      } else if (event && event.url) {
        url = event.url;
      } else if (event && typeof event === 'object' && event.nativeEvent) {
        url = event.nativeEvent.url || '';
      }
      
      console.log('URL string:', url);
      
      if (url && typeof url === 'string' && url.includes('PaymentSuccess')) {
        try {
          const params = new URLSearchParams(url.split('?')[1]);
          const ma_giao_dich = params.get('ma_giao_dich');
          const amount = params.get('amount');
          const movieName = params.get('movieName');
          
          console.log('Navigating to PaymentSuccess:', { ma_giao_dich, amount, movieName });
          
          if (navigationRef) {
            navigationRef.navigate('PaymentSuccess', {
              ma_giao_dich,
              amount: amount ? parseInt(amount) : 0,
              movieName: movieName || 'Phim không xác định'
            });
          }
        } catch (error) {
          console.error('Error parsing PaymentSuccess URL:', error);
        }
      } else if (url && typeof url === 'string' && url.includes('PaymentFail')) {
        try {
          const params = new URLSearchParams(url.split('?')[1]);
          const errorMessage = params.get('errorMessage');
          
          console.log('Navigating to PaymentFail:', { errorMessage });
          
          if (navigationRef) {
            navigationRef.navigate('PaymentFail', {
              errorMessage: errorMessage || 'Có lỗi xảy ra'
            });
          }
        } catch (error) {
          console.error('Error parsing PaymentFail URL:', error);
        }
      }
    };

    // Handle initial URL when app opens
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
        handleDeepLink(url);
      }
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription?.remove();
  }, [navigationRef]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && appIsReady) {
      // Ẩn màn hình Splash khi app đã sẵn sàng
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appIsReady]);

  if (!fontsLoaded || !appIsReady || userLoading) {
    return null; // Hiển thị màn hình Splash cho đến khi app sẵn sàng
  }

  return (
    <NavigationContainer ref={setNavigationRef}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SelectSeat" component={SelectSeatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PurchasedTicket" component={PurchasedTicketScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AccountMember" component={AccountMemberScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AccountPoint" component={AccountPointScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AccountGift" component={AccountGiftScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PayOSPayment" component={PayOSPaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PaymentFail" component={PaymentFailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
