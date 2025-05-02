import React, { useState } from 'react';
import {TouchableOpacity, Text, StyleSheet, Image, View} from 'react-native';
import {COLORS, SIZES, horizontalScale, moderateScale, verticalScale} from '../utils/Theme';

export default function CategoryChip({item, selected, onPress}) {
  const [imageError, setImageError] = useState(false);
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.chip}>
        <View style={[styles.imgWrapper, selected && styles.imgWrapperActive]}>
          <Image
            source={{
              uri:
                !imageError && item?.image
                  ? item.image
                  : 'https://placehold.jp/eeeeee/cccccc/60x60.png?text=No%20Image',
            }}
            style={styles.categoryImg}
            onError={() => setImageError(true)}
          />
        </View>
        <Text style={styles.categoryName}>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const IMG_SIZE = moderateScale(60);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    gap: verticalScale(8),
    width: horizontalScale(80),
  },
  imgWrapper: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: IMG_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWrapperActive: {
    borderWidth: 2,
    borderColor: COLORS['primary-purple-400'],
    borderRadius: IMG_SIZE / 2,
  },
  categoryImg: {
    width: '100%',
    height: '100%',
    borderRadius: IMG_SIZE / 2,
  },
  categoryName: {
    fontSize: SIZES.small,
    color: COLORS['primary-purple-400'],
    textAlign: 'center',
  },
  categoryNameActive: {
    color: COLORS['primary-500'],
    fontWeight: '600',
  },
});
