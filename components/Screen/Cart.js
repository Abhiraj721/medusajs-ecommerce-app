import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseurl from "../constants/Baseurl";
import axios from "axios";
import CartItem from "../CartItem";
import IconWithText from "../IconWithText";
import Button from "../Button";
export default function Cart({ navigation }) {
  const [cartID, setCartID] = useState("");
  const [cartItemsData, setCartItemsData] = useState([]);
  const [cartData, setCartData] = useState([]);
  useLayoutEffect(() => {
    const fetchData = async () => {
      await isCartAvailable();
    };

    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (cartID) {
      getCartProducts();
    }
  }, [cartID]);

  async function isCartAvailable() {
    try {
      const cartCheck = await AsyncStorage.getItem("isCartAvailable");

      if (cartCheck === null) {
        console.log("Cart information not found. Using default value.");
        await createCart();
      } else {
        const storedCartID = await AsyncStorage.getItem("cartID");
        setCartID(storedCartID);
      }
    } catch (error) {
      console.error("Error checking cart availability:", error);
    }
  }
  async function applyDiscount() {
    try {
      const cartId = await AsyncStorage.getItem("cartID");
  console.log(cartId)
      const requestBody = {
        discounts: [
          {
            code: "WINTER101"
          }
        ],
        region_id: 'reg_01HHETBCX4BRPXANFQ6NXVD8RN'
      };
  
      const response = await fetch(`${baseurl}/store/carts/${cartId}`, {
        method: 'POST', // You can change the HTTP method if needed
        headers: {
          'Content-Type': 'application/json'
          // Add any other headers if required
        },
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      const data = await response.json();
      console.log('Success:', data);
      // Handle the successful response here
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here
    }
    // fetchCart();
    // getCartProducts()
  }
  
  async function printit() {
    console.log(cartID);
  }

  async function createCart() {
    const response = await axios.post(`${baseurl}/store/carts`);
    const newCartID = response.data.cart.id;
    setCartID(newCartID);
    await AsyncStorage.setItem("isCartAvailable", "true");
    await AsyncStorage.setItem("cartID", newCartID);
  }

  async function remove() {
    console.log("Removing cart data");
    await AsyncStorage.removeItem("cartID");
    await AsyncStorage.removeItem("isCartAvailable");
  }

  function getCartProducts() {
    axios
      .get(`${baseurl}/store/carts/${cartID}`)
      .then((response) => {
        console.log(response.data.cart.items);
        setCartData(response.data.cart);
        setCartItemsData(response.data.cart.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      {cartData.length!=0 &&cartItemsData.length == 0 && (
          <IconWithText
            iconName={"shopping-cart"}
            description={"Your Cart is Empty"}
          />
      )}
      {cartData.length!=0 && cartItemsData.length == 0 && (
        <View style={styles.shopMore}>
          <Button title={"Shop our products"} handlePress={()=>navigation.navigate('Products')} buttonStyle={{width:300,marginTop:9,height:56}} />
        </View>
      )}
      <Text onPress={applyDiscount}>click me</Text>
      {cartItemsData.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          cartItemData={cartItem}
          getCartProducts={getCartProducts}
        />
      ))}
 {cartItemsData.length != 0  &&  <View style={styles.totalContainer}>
        <View style={styles.totalSection}>
          <Text>Total</Text>
        </View>
        <View style={styles.totalSection}>{<Text>{cartData.total}</Text>}</View>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  totalContainer: {
    display: "flex",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  emptyCart: {
    height: 97,
    
  },
  shopMore:{
    flex:1,
    height:123,
    alignItems: 'center',
  }
});
