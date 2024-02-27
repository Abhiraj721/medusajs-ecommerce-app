import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Button from "./Button";
import baseurl from "./constants/Baseurl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartItem({ cartItemData, getCartProducts }) {
  const [itemQuantity, setItemQuantity] = useState(cartItemData.quantity);
  const [isQuantityChanged, setIsQuantityChanged] = useState(true);

  async function handleQuantityChange(action) {
    setIsQuantityChanged(false);
    await changeQuantity(action);
    await getCartProducts();
    setIsQuantityChanged(true);
  }

  async function handleRemoveItem(item_id) {
    try {
      await removeItem(item_id);
      await getCartProducts();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }

  async function removeItem(item_id) {
    const cartID = await AsyncStorage.getItem("cartID");
    console.log(item_id);
    try {
      const response = await axios.delete(
        `${baseurl}/store/carts/${cartID}/line-items/${item_id}`
      );
      console.log(response.data);
    } catch (error) {
      console.log("Error removing item:", error);
      throw error; // Propagate the error to handleRemoveItem
    }
  }

  async function changeQuantity(action) {
    if (cartItemData.quantity === 1 && action === "decrease") return;
    let num = action === "increase" ? 1 : -1;
    const requestData = {
      variant_id: cartItemData.variant.id,
      quantity: num,
    };

    const cartID = await AsyncStorage.getItem("cartID");

    try {
      const response = await axios.post(
        `${baseurl}/store/carts/${cartID}/line-items`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setItemQuantity(itemQuantity + num);

      // console.log(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.cartItemImage} source={{ uri: cartItemData.thumbnail }} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>
          {cartItemData.title} ({cartItemData.description})
        </Text>
        <Text style={styles.priceText}>
          <Icon name="inr" size={12} color="black" /> {cartItemData.unit_price}
        </Text>
        <View style={styles.quantityChange}>
          <Button
            textStyle={{ color: "black" }}
            buttonStyle={styles.quantityButton}
            title={"-"}
            handlePress={() => {
              if (isQuantityChanged) handleQuantityChange("decrease");
            }}
          />
          <Text style={styles.quantityNum}>{cartItemData.quantity}</Text>
          <Button
            textStyle={{ color: "black" }}
            buttonStyle={styles.quantityButton}
            title={"+"}
            handlePress={() => {
              if (isQuantityChanged) handleQuantityChange("increase");
            }}
          />
        </View>
        <Button
          buttonStyle={{ backgroundColor: "white", borderWidth: 1, borderColor: "grey", marginTop: 5 }}
          textStyle={{ color: "black" }}
          title={"remove"}
          handlePress={() => handleRemoveItem(cartItemData.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "nowrap",
    paddingHorizontal: 16,
    backgroundColor: "white",
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartItemImage: {
    height: 113,
    width: 113,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  priceText: {
    color: "#F3933F",
  },
  quantityChange: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 34,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 8,
  },
  quantityNum: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 9,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
