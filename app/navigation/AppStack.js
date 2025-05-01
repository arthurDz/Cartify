import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ProductListScreen from '../screens/Products/ProductListScreen';
import SearchScreen from '../screens/Products/SearchScreen';
import ProductDetailsScreen from '../screens/Products/ProductDetailsScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductDetailsScreen"
        component={ProductDetailsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}