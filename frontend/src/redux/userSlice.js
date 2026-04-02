import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    address: null,
    shopsInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.city = action.payload;
    },
    setCurrentState: (state, action) => {
      state.state = action.payload;
    },
    setcurrentAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id == cartItem.id,
      );

      if (existingItem) {
        // const item = {
        //   id: existingItem.id,
        //   name: existingItem.name,
        //   price: existingItem.price,
        //   quantity: existingItem.quantity + cartItem.quantity,
        //   shop: existingItem.shop,
        // };

        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      );
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.cartItems.find((i) => i.id === id);

      if (item) {
        item.quantity = quantity;

        state.totalAmount = state.cartItems.reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        );
      }
    },
    deleteCartItem: (state, action) => {
      const { id } = action.payload;
      state.cartItems = state.cartItems.filter((i) => i.id !== id);
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.quantity * item.price,
        0,
      );
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, shopOrder: updatedShopOrder, status } =
        action.payload;

      const order = state.myOrders.find((o) => o._id === orderId);

      if (!order) return;

      const shopOrder = order.shopOrder?.find(
        (so) => String(so.shop?._id || so.shop) === shopId,
      );

      if (shopOrder && updatedShopOrder) {
        Object.assign(shopOrder, updatedShopOrder);
      } else if (shopOrder) {
        shopOrder.status = status;
      }
    },
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setcurrentAddress,
  setShopInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  deleteCartItem,
  setMyOrders,
  addMyOrder,
  updateOrderStatus,
} = userSlice.actions;
export default userSlice.reducer;
