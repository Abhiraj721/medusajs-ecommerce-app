import { View, Text, Image, StyleSheet, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import IconWithText from "../IconWithText";
import axios from "axios";
import baseurl from "../constants/Baseurl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import iconData from "../constants/IconsArr";
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
export default function ProductInfo({ route }) {
  const { productInfo} = route.params;
  const [productData, setProductData] = useState([]);
  const [currImageIndex, setCurrImageIndex] = useState(0);
  const [productImages, setProductImages] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    setProductData(JSON.parse(JSON.stringify(productInfo)));
    productImageProcess();
  }, []);

  function productImageProcess() {
    const urls = productInfo.images.map((image) => image.url);
    setProductImages(urls);
  }

  function handleImageChange(slideDirection) {
    if (slideDirection == "left") {
      if (currImageIndex != 0) {
        setCurrImageIndex(currImageIndex - 1);
      } else {
        setCurrImageIndex(productImages.length - 1);
      }
    }
    if (slideDirection == "right") {
      if (currImageIndex != productImages.length - 1) {
        setCurrImageIndex(currImageIndex + 1);
      } else {
        setCurrImageIndex(0);
      }
    }
  }
  const isInStock = () => {
    let available = false;
    if (selectedVariant.length == 0) {
      productData.variants.map((variant) => {
        if (variant.inventory_quantity > 0) {
          available = true;
          return;
        }
      });
    } else {
      if (selectedVariant.inventory_quantity > 0) {
        available = true;
      } else available = false;
    }
    return available;
  };
  async function addProductToCart(){
    const requestData = {
      variant_id:selectedVariant.id,
      quantity: 1,
    };
    const cartID=await AsyncStorage.getItem("cartID")
    axios.post(`${baseurl}/store/carts/${cartID}/line-items`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Response:', response.data);
        // Handle the response as needed
      })
      .catch(error => {
        console.error('Error:', error.message);
        // Handle errors
      });
  }
  const handleAddToCart = () => {
    if (selectedVariant.length === 0) {
      Alert.alert(
        'Attention',
        'Please select any variant',
        [{ text: 'OK', style: 'cancel' }]
      );
    } else {
      if (selectedVariant.inventory_quantity <= 0) {
        Alert.alert(
          'Out of Stock',
          'Sorry, this variant is currently unavailable',
          [{ text: 'OK', style: 'cancel' }]
        );
      }
      else
      {
        Alert.alert(
          'Success',
          'Product added to cart!',
          [
            {
              text: 'View Cart',
              onPress: () => {
                addProductToCart()
                Alert.alert('View Cart', 'Implement your cart view logic here.');
              },
            },
            {
              text: 'Close',
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
      }
    }
  };
  

  return (
    <ScrollView>
    
      <Text onPress={()=>navigation.navigate("Cart")}>hello</Text>
      <Text
        style={styles.leftSliderBtn}
        onPress={() => handleImageChange("left")}
      >
        <Icon name="chevron-left" size={25} color="black" />
      </Text>
      <Image
        source={{ uri: productImages[currImageIndex] }}
        style={styles.container}
      />
      <Text
        style={styles.rightSliderBtn}
        onPress={() => handleImageChange("right")}
      >
        <Icon name="chevron-right" size={25} color="black" />
      </Text>
      <Text style={styles.productTitle}>
        {productData.title}
        {"\n"}
      </Text>
      <Text style={styles.description}>
        {productData.description}
        {"\n"}
      </Text>
      <Text> ⭐⭐⭐⭐ 527 reviews</Text>
      <View style={styles.variantsSection}>
        {productData.variants &&
          productData.variants.map((variant) => (
            <Button
              buttonStyle={{
                width: 78,
                borderWidth: selectedVariant.id === variant.id ? 4 : 0,
                borderColor:
                  selectedVariant.id === variant.id ? "#FFAB91" : "transparent",
                backgroundColor:
                  variant.inventory_quantity <= 0 ? "#9E9E9E" : "black",
              }}
              textStyle={{
                textDecorationLine:
                  variant.inventory_quantity <= 0 ? "line-through" : "none",
                color: variant.inventory_quantity <= 0 ? "#000000" : "#FFAB91",
              }}
              key={variant.id}
              title={variant.title}
              handlePress={() => setSelectedVariant(variant)}
            />
          ))}
      </View>

      {productData && productData.variants && (
        <View style={styles.priceTag}>
          <Text>
            Price : <Icon name={"inr"} size={22} />
            {"  "}
            <Text style={styles.priceAmount}>
              {selectedVariant.length === 0
                ? productData.variants[0].prices[1].amount
                : selectedVariant.prices[1].amount}
            </Text>
          </Text>
          <Text style={{ marginLeft: 72 }}>Inclusive of all taxes.</Text>

          <Text>
            Stock :{" "}
            {isInStock() ? (
              <Text style={{ color: "#009900" }}>
                <Icon name="circle" size={8} color="#009900" /> In stock
              </Text>
            ) : (
              <Text style={{ color: "#310769" }}>
                <Icon name="circle" size={8} color="#b366ff" /> Sold out
              </Text>
            )}
            {"\n"}
          </Text>
        </View>
      )}
      <Button
        title={selectedVariant.inventory_quantity<=0 ? "Sold out" :"Add To Cart"}
        buttonStyle={{ width: 230, marginLeft: "auto", marginRight: "auto",marginBottom:12,backgroundColor:selectedVariant.inventory_quantity<=0 ? "grey" :"black" }}
        textStyle={{ fontSize: 14 }}
        handlePress={handleAddToCart}
      />
      <View style={styles.iconsTextWrapper}>
        {
        iconData.map((icon) => {
        return <IconWithText iconName={icon.iconName} description={icon.iconDesciption}/>
        })
        }
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    position: "relative",
  },
  leftSliderBtn: {
    position: "absolute",
    zIndex: 1,
    top: 100,
    left: 14,
  },
  rightSliderBtn: {
    position: "absolute",
    zIndex: 1,
    top: 100,
    right: 14,
  },
  productTitle: {
    fontSize: 19,
    fontWeight: "bold",
    padding: 7,
  },

  variantsSection: {
    display: "flex",
    flexDirection: "row",
    padding: 7,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  description: {
    padding: 8,
  },
  priceTag: {
    marginLeft: 5,
  },
  priceAmount: {
    fontSize: 16,
  },
  iconsTextWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});
