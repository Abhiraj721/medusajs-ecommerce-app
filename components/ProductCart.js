import { View, Text, StyleSheet, Dimensions, Image,TouchableOpacity } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
const windowWidth = Dimensions.get("window").width;

const ProductCart = ({ productInfo,navigation }) => {
  const isAvailable = () => {
    let available = false;
    productInfo.variants.map((variant) => {
      if (variant.inventory_quantity > 0) {
        available = true;
        return;
      }
    });
    return available;
  };
  return (
    <TouchableOpacity onPress={()=>{navigation.navigate('ProductInfo',{productInfo:productInfo})}}  style={styles.container}>

      <Image source={{ uri: productInfo.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.titleText}>{productInfo.title}</Text>
      <Text style={styles.priceText}>
        {productInfo.variants[0].prices[1].amount} <Icon name="inr" size={12} color="black" />
      </Text>
      <Text style={styles.stockStatus}>{isAvailable() ? <Text style={{color:"#009900"}}> <Icon name="circle" size={8} color="#009900" /> In stock</Text> : <Text style={{color:"#b366ff"}}><Icon name="circle" size={8} color="#b366ff" /> Sold out</Text>}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    // alignItems:"center",
    width: windowWidth / 2 - 8,
    padding:5,
    backgroundColor:"#e4e4e4",
    marginBottom: 4,
  },
  titleText: {
    marginLeft: 12,
  },
  thumbnail: {
    height: 120,
  },
  priceText: {
    marginLeft: 12,
  },
  stockStatus:{
    marginLeft: 12,

  }
});
export default ProductCart;
