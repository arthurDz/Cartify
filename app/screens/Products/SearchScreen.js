import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  COLORS,
  horizontalScale,
  SIZES,
  SolidIcons,
  verticalScale,
} from '../../utils/Theme';
import {api} from '../../api/client';
import ProductCard from '../../components/ProductCard';
import {useNavigation} from '@react-navigation/native';
import useDebounce from '../../hooks/useDebounce';

const PAGE_SIZE = 20;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  /* ------------- UI / query state ------------- */
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const cancelRef = useRef(null); // for cancelling inflight axios calls

  /* ------------- helpers ------------- */
  const buildParams = (q, off = 0) => ({
    title: q.trim(),
    offset: off,
    limit: PAGE_SIZE,
  });

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

  /* ------------- refetch on new query ------------- */
  useEffect(() => {
    setOffset(0);
    fetchPage(debouncedQuery, 0);
  }, [debouncedQuery, fetchPage]);

  /* ------------- pagination ------------- */
  const loadNext = () => {
    if (!loading && hasMore) {
      const next = offset + PAGE_SIZE;
      fetchPage(debouncedQuery, next);
      setOffset(next);
    }
  };

  /* ------------- renderers ------------- */
  const renderProduct = ({item}) => <ProductCard item={item} />;

  return (
    <SafeAreaView style={[styles.container, {paddingBottom: insets.bottom}]}>
      {/* Header with back arrow */}
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

      {/* Results */}
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
            {paddingBottom: verticalScale(20)},
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
});
