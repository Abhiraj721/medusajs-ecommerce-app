import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default function IconWithText({ iconName, description }) {
  return (
    <View style={styles.container}>
      <Icon style={styles.icon} name={iconName} size={23} />
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    borderColor:"black",
    borderRadius: 2,
    borderWidth:1,
    color: "transparent",
    marginLeft: 5,
    alignItems: "center",
  },
  icon: {
    color: "#003926",
  },
  text: {
    color: "black",
    fontSize:13,
    fontWeight:'bold',
  },
});
