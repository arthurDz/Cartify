import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS, horizontalScale, OutlineIcons, SIZES, verticalScale} from '../../utils/Theme';
import {api} from '../../api/client';
import ProductCard from '../../components/ProductCard';
import { useNavigation } from '@react-navigation/native';

const PAGE_SIZE = 10;

export default function ProductDetailsScreen({route}) {
  const {product} = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [related, setRelated] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getRelated = async (off = 0) => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const {data} = await api.get(`/products/${product.id}/related`, {
        params: {limit: PAGE_SIZE, offset: off},
      });
      setRelated(prev => (off === 0 ? data : [...prev, ...data]));
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    getRelated(0);
  }, [product.id]);

  const loadNext = () => {
    if (!loading && hasMore) {
      const next = offset + PAGE_SIZE;
      setOffset(next);
      getRelated(next);
    }
  };

  const renderRelated = ({item}) => <ProductCard item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <OutlineIcons.ArrowLeftCircleIcon 
            color={COLORS['Neutrals/neutrals-6']}
            size={SIZES.xxxLarge}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <FlatList
          data={product.images}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={({item}) => (
            <Image source={{uri: item}} style={styles.heroImage} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />

        <View style={styles.meta}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.category}>{product.category.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <Text style={styles.sectionHeading}>Related products</Text>
        <FlatList
          data={related}
          keyExtractor={i => String(i.id)}
          renderItem={renderRelated}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.relatedList,
            {paddingBottom: insets.bottom},
          ]}
          onEndReached={loadNext}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loading ? <ActivityIndicator style={{marginVertical: 16}} /> : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const HERO_HEIGHT = verticalScale(240);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS['primary-black']},
  header: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12)
  },
  heroImage: {
    width: horizontalScale(375),
    height: HERO_HEIGHT,
    resizeMode: 'cover',
  },
  meta: {padding: horizontalScale(12)},
  title: {
    fontSize: SIZES.large,
    color: COLORS['Neutrals/neutrals-1'],
    fontWeight: '600',
  },
  price: {
    marginTop: 4,
    fontSize: SIZES.medium,
    color: COLORS['primary-500'],
  },
  category: {
    marginTop: 2,
    fontSize: SIZES.small,
    color: COLORS['Neutrals/neutrals-5'],
  },
  description: {
    marginTop: 10,
    fontSize: SIZES.small,
    color: COLORS['Neutrals/neutrals-4'],
  },
  sectionHeading: {
    marginTop: 20,
    marginLeft: horizontalScale(12),
    marginBottom: 8,
    fontSize: SIZES.medium,
    color: COLORS['Neutrals/neutrals-1'],
    fontWeight: '500',
  },
  relatedList: {paddingHorizontal: horizontalScale(12)},
});
