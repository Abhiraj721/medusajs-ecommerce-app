import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

export default function Button({ handlePress, title, buttonStyle,textStyle }) {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={handlePress}>
      <Text style={[styles.buttonText,textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 7,
    width: 110,
    elevation: 3,
    backgroundColor: "black",
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
