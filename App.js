import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Products from './components/Screen/Products';
import ProductInfo from './components/Screen/ProductInfo';
import { useState } from 'react';
import Cart from './components/Screen/Cart';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
 
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="ProductInfo" component={ProductInfo} />
      <Stack.Screen name="Cart" component={Cart} />      
    </Stack.Navigator>
  </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
