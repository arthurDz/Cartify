import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {api} from '../../api/client';

const PAGE_SIZE = 20;

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, {rejectWithValue}) => {
    try {
      const {data} = await api.get('/categories');
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({offset = 0, categoryId}, {rejectWithValue}) => {
    try {
      const params = {offset, limit: PAGE_SIZE};
      if (categoryId) params.categoryId = categoryId;
      const {data} = await api.get('/products', {params});
      console.log(">>> data", data);
      return {items: data, offset};
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const initialState = {
  categories: [],
  categoriesLoading: false,
  categoriesError: null,

  products: [],
  productsLoading: false,
  productsError: null,
  hasMore: true,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProducts(state) {
      state.products = [];
      state.hasMore = true;
    },
  },
  extraReducers: builder => {
    // categories
    builder
      .addCase(fetchCategories.pending, s => {
        s.categoriesLoading = true;
        s.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (s, {payload}) => {
        s.categoriesLoading = false;
        s.categories = payload;
      })
      .addCase(fetchCategories.rejected, (s, {payload}) => {
        s.categoriesLoading = false;
        s.categoriesError = payload;
      })
    // products
      .addCase(fetchProducts.pending, s => {
        s.productsLoading = true;
        s.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (s, {payload}) => {
        s.productsLoading = false;
        const {items, offset} = payload;
        if (offset === 0) s.products = items;
        else s.products.push(...items);
        if (items.length < PAGE_SIZE) s.hasMore = false;
      })
      .addCase(fetchProducts.rejected, (s, {payload}) => {
        s.productsLoading = false;
        s.productsError = payload;
      });
  },
});

export const {resetProducts} = productSlice.actions;
export default productSlice.reducer;
export const PAGE_LIMIT = PAGE_SIZE;