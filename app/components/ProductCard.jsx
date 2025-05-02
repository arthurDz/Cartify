import React from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SIZES, horizontalScale, verticalScale} from '../utils/Theme';
import { price } from '../utils/price';

export default function ProductCard({item}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('ProductDetailsScreen', {product: item})
      }>
      <Image
        source={{uri: item.images[0]}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.price}>{price(item.price)}</Text>
        <Text numberOfLines={1} style={styles.category}>
          {item.category?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const CARD_WIDTH = (horizontalScale(375) - horizontalScale(36)) / 2;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS['primary-purple-800'],
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: verticalScale(12),
    marginRight: horizontalScale(12),
  },
  image: {width: '100%', height: verticalScale(110)},
  meta: {padding: horizontalScale(8)},
  title: {
    fontSize: SIZES.small,
    color: COLORS['Neutrals/neutrals-1'],
    fontWeight: '500',
  },
  price: {fontSize: SIZES.small, color: COLORS['primary-blue-50'], marginTop: 2},
  category: {
    fontSize: SIZES.xSmall,
    color: COLORS['Neutrals/neutrals-5'],
    marginTop: 2,
  },
});