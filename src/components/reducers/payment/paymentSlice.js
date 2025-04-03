import { createSlice } from "@reduxjs/toolkit";
import { initiatePayment, approvePayment } from "./paymentThunk";

const initialState = {
  paymentUrl: null,
  loading: false,
  error: null,
  paymentSuccess: false, // Track payment approval
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.paymentUrl = null;
      state.error = null;
      state.paymentSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initiate Payment
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.next_redirect_pc_url;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve Payment
      .addCase(approvePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvePayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentSuccess = true;
      })
      .addCase(approvePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentSuccess = false;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
