import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, horizontalScale, moderateScale, OutlineIcons, SIZES, SolidIcons, verticalScale } from '../../utils/Theme';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  fetchProducts,
  resetProducts,
  PAGE_LIMIT,
} from '../../store/slices/productSlice';
import CategoryChip from '../../components/CategoryChip';
import ProductCard from '../../components/ProductCard';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CARD_HEIGHT = verticalScale(200);

const ProductListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const {categories, categoriesLoading, products, productsLoading, hasMore} =
    useSelector(state => state.products);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({offset: 0, categoryId: selectedCategory?.id}));
    setOffset(0);
  }, [dispatch, selectedCategory]);

  const loadNext = () => {
    if (!productsLoading && hasMore) {
      const nextOffset = offset + PAGE_LIMIT;
      dispatch(
        fetchProducts({offset: nextOffset, categoryId: selectedCategory?.id}),
      );
      setOffset(nextOffset);
    }
  };

  const onSelectCategory = useCallback(
    cat => {
      if (cat?.id === selectedCategory?.id) {
        setSelectedCategory(null);
      } else {
        setSelectedCategory(cat);
      }
      dispatch(resetProducts());
    },
    [selectedCategory, dispatch],
  );

  const handleClear = () => {
    setSelectedCategory(null);
  }

  const renderCategory = ({item}) => (
    <CategoryChip
      item={item}
      selected={item.id === selectedCategory?.id}
      onPress={onSelectCategory}
    />
  );
  
  const renderProduct = ({item}) => <ProductCard item={item} />;

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Cartify</Text>

          <TouchableOpacity>
            <SolidIcons.ShoppingCartIcon
              color={COLORS['Neutrals/neutrals-6']}
              size={SIZES.xxLarge}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchBarBtn}
          onPress={() => navigation.navigate('SearchScreen')}>
          <OutlineIcons.MagnifyingGlassIcon
            color={COLORS['Neutrals/neutrals-6']}
            size={SIZES.large}
          />
          <Text style={styles.searchTxt}>Search</Text>
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.title}>Categories</Text>
            {selectedCategory && <Text style={styles.clearTxt} onPress={handleClear}>Clear</Text>}
          </View>
          <FlatList
            data={categories}
            keyExtractor={i => String(i.id)}
            renderItem={renderCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              marginBottom: verticalScale(12),
              gap: horizontalScale(5),
            }}
            ListEmptyComponent={
              categoriesLoading ? (
                <ActivityIndicator style={{marginVertical: 8}} />
              ) : null
            }
          />

          <FlatList
            data={products}
            keyExtractor={i => String(i.id)}
            renderItem={renderProduct}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.productList,
              {paddingBottom: CARD_HEIGHT + insets.bottom - verticalScale(24)},
            ]}
            scrollIndicatorInsets={{bottom: insets.bottom}}
            onEndReached={loadNext}
            onEndReachedThreshold={0.4}
            contentInsetAdjustmentBehavior="automatic"
            ListFooterComponent={
              productsLoading ? (
                <ActivityIndicator style={{marginVertical: 16}} />
              ) : null
            }
            initialNumToRender={10}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

export default ProductListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS['primary-black'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: horizontalScale(12),
    alignItems: 'center',
  },
  headerText: {
    fontSize: SIZES.xxLarge,
    color: COLORS['Neutrals/neutrals-6'],
    fontWeight: '600',
  },
  searchBarBtn: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    borderWidth: 1,
    borderRadius: moderateScale(6),
    borderColor: COLORS['Neutrals/neutrals-6'],
    marginHorizontal: horizontalScale(12),
  },
  searchTxt: {
    fontSize: SIZES.medium,
    color: COLORS['Neutrals/neutrals-6'],
    fontWeight: '400',
  },
  body: {
    paddingHorizontal: horizontalScale(12),
  },
  title: {
    fontSize: SIZES.medium,
    color: COLORS['Neutrals/neutrals-6'],
    fontWeight: '600',
    marginVertical: verticalScale(12),
  },
  clearTxt: {
    fontSize: SIZES.medium,
    color: COLORS['Neutrals/neutrals-6'],
    fontWeight: '600',
  },
  productList: {
    marginTop: verticalScale(16),
  },
});