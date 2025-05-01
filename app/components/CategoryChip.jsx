import React, { useState } from 'react';
import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native';
import {COLORS, SIZES, horizontalScale, moderateScale, pixelPerfect, verticalScale} from '../utils/Theme';

export default function CategoryChip({item, selected, onPress}) {
  const [imageError, setImageError] = useState(false);
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.chip}>
        <Image
          source={{
            uri:
              !imageError && item?.image
                ? item?.image
                : 'https://placehold.jp/eeeeee/cccccc/60x60.png?text=No%20Image',
          }}
          style={styles.categoryImg}
          onError={() => setImageError(true)}
        />
        <Text style={styles.categoryName}>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    gap: verticalScale(8),
    width: horizontalScale(80),
  },
  categoryImg: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
  },
  categoryName: {
    fontSize: SIZES.small,
    color: COLORS['primary-blue-600'],
    fontWeight: '400',
    textAlign: 'center',
  },
});
