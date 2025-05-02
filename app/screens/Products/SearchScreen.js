import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  COLORS,
  horizontalScale,
  moderateScale,
  SIZES,
  SolidIcons,
  verticalScale,
} from '../../utils/Theme';
import {api} from '../../api/client';
import ProductCard from '../../components/ProductCard';
import {useNavigation} from '@react-navigation/native';
import useDebounce from '../../hooks/useDebounce';
import { useSelector } from 'react-redux';

const PAGE_SIZE = 20;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {categories} = useSelector(state => state.products);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCat, setSelectedCat] = useState(null);
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const cancelRef = useRef(null);

  const buildParams = (q, off = 0) => {
    const params = {title: q.trim(), offset: off, limit: PAGE_SIZE};
    if (selectedCat) params.categoryId = selectedCat.id;
    if (minPrice) params.price_min = Number(minPrice);
    if (maxPrice) params.price_max = Number(maxPrice);
    return params;
  };

  const fetchPage = useCallback(async (q, off = 0) => {
    if (!q.trim()) {
      setProducts([]);
      setHasMore(false);
      return;
    }
    try {
      setLoading(true);
      if (cancelRef.current) cancelRef.current.cancel();
      cancelRef.current = axios.CancelToken.source(); 

      const {data} = await api.get('/products', {
        params: buildParams(q, off),
        cancelToken: cancelRef.current.token,
      })

      setProducts(prev => (off === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      if (!axios.isCancel(err)) console.warn(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchPage(debouncedQuery, 0);
  }, [debouncedQuery, fetchPage]);

  const loadNext = () => {
    if (!loading && hasMore) {
      const next = offset + PAGE_SIZE;
      fetchPage(debouncedQuery, next);
      setOffset(next);
    }
  };

  const renderProduct = ({item}) => <ProductCard item={item} />;

  const renderCatItem = cat => (
    <TouchableOpacity
      key={cat.id}
      style={[
        styles.catItem,
        cat.id === selectedCat?.id && styles.catItemActive,
      ]}
      onPress={() => {
        setSelectedCat(cat.id === selectedCat?.id ? null : cat);
        setShowCatDropdown(false);
      }}>
      <Text
        style={[
          styles.catText,
          cat.id === selectedCat?.id && styles.catTextActive,
        ]}>
        {cat.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, {paddingBottom: insets.bottom}]}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <SolidIcons.ArrowLeftIcon
            color={COLORS['Neutrals/neutrals-6']}
            size={SIZES.large}
          />
        </TouchableOpacity>
        <TextInput
          autoFocus
          placeholder="Search products…"
          placeholderTextColor={COLORS['Neutrals/neutrals-6']}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filters}>
        <TextInput
          placeholder="Min Price"
          placeholderTextColor={COLORS['Neutrals/neutrals-6']}
          value={minPrice}
          onChangeText={setMinPrice}
          style={styles.filterInput}
          returnKeyType="done"
          keyboardType="number-pad"
          maxLength={6}
        />
        <TextInput
          placeholder="Max Price"
          placeholderTextColor={COLORS['Neutrals/neutrals-6']}
          value={maxPrice}
          onChangeText={setMaxPrice}
          style={styles.filterInput}
          returnKeyType="done"
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.catButton}
          onPress={() => setShowCatDropdown(p => !p)}
          activeOpacity={0.7}>
          <Text style={styles.catButtonText}>
            {selectedCat ? selectedCat.name : 'Categories'}
          </Text>
          <SolidIcons.ChevronDownIcon
            color={COLORS['Neutrals/neutrals-6']}
            size={SIZES.medium}
          />
        </TouchableOpacity>
      </View>

      {showCatDropdown && (
        <View style={styles.catDropdown}>
          <ScrollView>{categories.map(renderCatItem)}</ScrollView>
        </View>
      )}

      {products.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={i => String(i.id)}
          renderItem={renderProduct}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            {paddingBottom: verticalScale(20), marginTop: verticalScale(12)},
          ]}
          onEndReached={loadNext}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{marginVertical: 16}} /> : null
          }
          initialNumToRender={10}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS['primary-black']},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: horizontalScale(12),
    paddingHorizontal: horizontalScale(12),
    backgroundColor: COLORS['Neutrals/neutrals-8'],
    borderRadius: 8,
  },
  input: {
    flex: 1,
    height: verticalScale(42),
    marginLeft: horizontalScale(8),
    fontSize: SIZES.medium,
    color: COLORS['Neutrals/neutrals-1'],
  },
  list: {paddingHorizontal: horizontalScale(12)},
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  emptyText: {color: COLORS['Neutrals/neutrals-6'], fontSize: SIZES.medium},
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(20),
    paddingHorizontal: horizontalScale(12),
  },
  filterInput: {
    height: verticalScale(30),
    width: horizontalScale(80),
    borderWidth: 1,
    borderColor: COLORS['Neutrals/neutrals-6'],
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(8),
    color: COLORS['Neutrals/neutrals-6'],
    fontSize: moderateScale(12)
  },
  catButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS['Neutrals/neutrals-6'],
    borderRadius: moderateScale(8),
    paddingHorizontal: horizontalScale(8),
    height: verticalScale(32),
  },
  catButtonText: {
    color: COLORS['Neutrals/neutrals-6'],
    marginRight: 4,
    fontSize: SIZES.small,
  },

  catDropdown: {
    position: 'absolute',
    top: verticalScale(160),
    right: horizontalScale(70),
    maxHeight: verticalScale(220),
    width: horizontalScale(90),
    backgroundColor: COLORS['primary-black'],
    borderWidth: 1,
    borderColor: COLORS['Neutrals/neutrals-6'],
    borderRadius: 8,
    zIndex: 20,
    paddingVertical: verticalScale(6),
  },
  catItem: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
  },
  catItemActive: {backgroundColor: COLORS['primary-500']},
  catText: {color: COLORS['Neutrals/neutrals-6'], fontSize: SIZES.small},
  catTextActive: {color: COLORS['Neutrals/neutrals-1']},
});
