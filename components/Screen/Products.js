import { Text, StyleSheet, ScrollView, View } from "react-native";
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import baseurl from "../constants/Baseurl";
import ProductCart from "../ProductCart";
export default function Products({ navigation }) {
  const [productData, setProductData] = useState([]);
  useEffect(() => {
    axios
      .get(`${baseurl}/store/products`)
      .then((response) => {
        setProductData(response.data.products);
      })
      .catch((error) => {
        console.log("Error " + error);
      });
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        {productData.map((product) => {
          return <ProductCart productInfo={product} navigation={navigation} />;
        })}
      </View>
      <Text>hi</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap", // Allow items to wrap onto the next line
    justifyContent: "space-between",
    alignItems: "center",
  },
});
