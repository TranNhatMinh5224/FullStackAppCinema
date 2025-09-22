import React, { useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AccountAvatar from '../../components/account/AccountAvatar';
import AccountListItem from '../../components/account/AccountListItem';
import Separator from '../../components/account/Separator';
import Header from '../../components/Header';
import { UserContext } from '../../context/UserContext';


const AccountScreen = ({ route, navigation }) => {
    const { user } = route.params;
    const { setUser } = useContext(UserContext);

    const handleLogout = async () => {
        await setUser(null); // Sử dụng UserContext để đăng xuất
        navigation.replace("Home");
    };

    return (
        <View style={styles.container}>
            <Header navigation={navigation} title="Tài khoản" />

            {/* Danh sách tài khoản */}

            <ScrollView>
                <AccountAvatar username={user?.name} />

                <AccountListItem icon="id-card" label="Thông tin tài khoản" onPress={() => navigation.navigate('AccountInfo', { user })} />
                <AccountListItem icon="lock" label="Thay đổi mật khẩu" onPress={() => navigation.navigate('ChangePassword', { user })} />
                <AccountListItem icon="wallet" label="Thẻ thành viên" onPress={() => navigation.navigate('AccountMember')} />

                <Separator />

                <AccountListItem icon="coins" label="Tích điểm" onPress={() => navigation.navigate('AccountPoint')} />
                <AccountListItem icon="credit-card" label="Thẻ quà tặng" onPress={() => navigation.navigate('AccountGift')} />

                <Separator />

                <AccountListItem label="Lịch sử giao dịch" onPress={() => navigation.navigate('PurchasedTicket', { user })} />

                <Separator />

                <AccountListItem icon="sign-out-alt" label="Đăng xuất" iconColor="red" textColor="red" onPress={handleLogout} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        marginTop: 30,
    },
});

export default AccountScreen;
