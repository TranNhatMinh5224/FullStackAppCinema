import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import COLORS from "../assets/color";

const Header = ({ title, navigation, onBack }) => {
  return (
    <TouchableOpacity style={styles.header} onPress={() => (onBack ? onBack() : navigation.goBack())}>
      <Icon name="chevron-left" size={20} color={COLORS.primary} />
      <Text style={styles.headerTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
  },
  headerTitle: {
    flex: 1,
    paddingLeft: 20,
    fontSize: 18,
    fontFamily: "Roboto", // Added font family
  },
});

export default Header;
