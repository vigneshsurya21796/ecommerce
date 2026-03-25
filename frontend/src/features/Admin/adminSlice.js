import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosAuth } from "../Auth/authService";

const getToken = (thunkAPI) => thunkAPI.getState().auth.user?.token;
const headers  = (token) => ({ Authorization: `Bearer ${token}` });

// ── Thunks ────────────────────────────────────────────────
export const fetchStats   = createAsyncThunk("admin/fetchStats",   async (_, api) => (await axiosAuth.get("/admin/stats",   { headers: headers(getToken(api)) })).data);
export const fetchOrders  = createAsyncThunk("admin/fetchOrders",  async (_, api) => (await axiosAuth.get("/admin/orders",  { headers: headers(getToken(api)) })).data);
export const fetchUsers   = createAsyncThunk("admin/fetchUsers",   async (_, api) => (await axiosAuth.get("/admin/users",   { headers: headers(getToken(api)) })).data);
export const fetchAdminProducts = createAsyncThunk("admin/fetchProducts", async (_, api) => (await axiosAuth.get("/admin/products", { headers: headers(getToken(api)) })).data);

export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus", async ({ id, data }, api) => {
  return (await axiosAuth.put(`/admin/orders/${id}/status`, data, { headers: headers(getToken(api)) })).data;
});

export const toggleUserRole = createAsyncThunk("admin/toggleUserRole", async (id, api) => {
  return (await axiosAuth.put(`/admin/users/${id}/role`, {}, { headers: headers(getToken(api)) })).data;
});

export const createProduct = createAsyncThunk("admin/createProduct", async (data, api) => {
  return (await axiosAuth.post("/admin/products", data, { headers: headers(getToken(api)) })).data;
});

export const updateProduct = createAsyncThunk("admin/updateProduct", async ({ id, data }, api) => {
  return (await axiosAuth.put(`/admin/products/${id}`, data, { headers: headers(getToken(api)) })).data;
});

export const deleteProduct = createAsyncThunk("admin/deleteProduct", async (id, api) => {
  await axiosAuth.delete(`/admin/products/${id}`, { headers: headers(getToken(api)) });
  return id;
});

// ── Helpers ───────────────────────────────────────────────
const pending  = (state) => { state.isLoading = true; state.error = null; };
const rejected = (state, action) => { state.isLoading = false; state.error = action.error.message; };

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null, orders: [], users: [], products: [],
    isLoading: false, error: null,
  },
  reducers: { clearError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      // stats
      .addCase(fetchStats.pending,   pending)
      .addCase(fetchStats.rejected,  rejected)
      .addCase(fetchStats.fulfilled, (s, a) => { s.isLoading = false; s.stats = a.payload; })
      // orders
      .addCase(fetchOrders.pending,   pending)
      .addCase(fetchOrders.rejected,  rejected)
      .addCase(fetchOrders.fulfilled, (s, a) => { s.isLoading = false; s.orders = a.payload; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        s.orders = s.orders.map((o) => o._id === a.payload._id ? a.payload : o);
      })
      // users
      .addCase(fetchUsers.pending,   pending)
      .addCase(fetchUsers.rejected,  rejected)
      .addCase(fetchUsers.fulfilled, (s, a) => { s.isLoading = false; s.users = a.payload; })
      .addCase(toggleUserRole.fulfilled, (s, a) => {
        s.users = s.users.map((u) => u._id === a.payload._id ? a.payload : u);
      })
      // products
      .addCase(fetchAdminProducts.pending,   pending)
      .addCase(fetchAdminProducts.rejected,  rejected)
      .addCase(fetchAdminProducts.fulfilled, (s, a) => { s.isLoading = false; s.products = a.payload; })
      .addCase(createProduct.fulfilled, (s, a) => { s.products.unshift(a.payload); })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.products = s.products.map((p) => p._id === a.payload._id ? a.payload : p);
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.products = s.products.filter((p) => p._id !== a.payload);
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
