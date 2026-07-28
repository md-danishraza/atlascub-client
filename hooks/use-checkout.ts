"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/store";
import { clearCart } from "@/lib/store/features/cartSlice";
import {
  useInitiateCheckoutMutation,
  mapCartItemsToCheckout,
  useGetOrderByIdQuery,
} from "@/lib/store/apis/checkout-api";

import { toast } from "sonner";
import { isApiError } from "@/lib/store/apis/checkout-api";
import apiClient from "@/lib/store/apis/axios-client";

export interface CheckoutState {
  orderId: string | null;
  razorpayOrderId: string | null;
  orderNumber: string | null;
  amount: number | null;
  keyId: string | null;
  isSubmitting: boolean;
  isProcessing: boolean;
  error: string | null;
  step: "shipping" | "payment" | "success" | "failed";
}

export function useCheckout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [state, setState] = useState<CheckoutState>({
    orderId: null,
    razorpayOrderId: null,
    orderNumber: null,
    amount: null,
    keyId: null,
    isSubmitting: false,
    isProcessing: false,
    error: null,
    step: "shipping",
  });

  const [initiateCheckout, { isLoading: isInitiating }] =
    useInitiateCheckoutMutation();

  const resetCheckout = useCallback(() => {
    setState({
      orderId: null,
      razorpayOrderId: null,
      orderNumber: null,
      amount: null,
      keyId: null,
      isSubmitting: false,
      isProcessing: false,
      error: null,
      step: "shipping",
    });
  }, []);

  const handlePaymentSuccess = useCallback(
    async (response: any) => {
      setState((prev) => ({ ...prev, isProcessing: true }));

      try {
        dispatch(clearCart());
        router.push(`/checkout/success?orderNumber=${state.orderNumber}`);
        toast.success("Payment successful! Your order has been placed.");
      } catch (error) {
        console.error("Payment success handling error:", error);
        toast.error(
          "Payment was successful but we couldn't redirect. Please check your orders."
        );
        setState((prev) => ({ ...prev, step: "failed", isProcessing: false }));
      }
    },
    [dispatch, router, state.orderNumber]
  );

  const handlePaymentFailure = useCallback((error?: any) => {
    const errorMessage =
      error?.message ||
      error?.description ||
      "Payment process was interrupted or declined. Please try again.";

    setState((prev) => ({
      ...prev,
      step: "failed",
      error: errorMessage,
      isSubmitting: false,
      isProcessing: false,
    }));

    toast.error(errorMessage);
  }, []);

  const handlePlaceOrder = useCallback(
    async (
      addressId: string,
      paymentMethodSelected: "PREPAID" | "COD" = "PREPAID"
    ) => {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty. Please add some items.");
        return;
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: true,
        error: null,
        step: "payment",
      }));

      try {
        // Map the frontend payment methodology to the correct backend format
        const backendPaymentMethod =
          paymentMethodSelected === "COD" ? "COD" : "razorpay";

        const payload = {
          cartItems: mapCartItemsToCheckout(cartItems),
          addressId,
          paymentMethod: backendPaymentMethod,
        };

        // 🛡️ STEP 1: Create the Order in the Database
        const orderResult = (await initiateCheckout(
          payload as any
        ).unwrap()) as any;

        // 🛡️ STEP 2: Branch logic based on COD vs PREPAID selection
        if (paymentMethodSelected === "COD") {
          dispatch(clearCart());
          setState((prev) => ({
            ...prev,
            orderId: orderResult.id,
            orderNumber: orderResult.orderNumber || orderResult.id,
            isSubmitting: false,
            isProcessing: false,
            step: "success",
          }));

          toast.success("COD Order requested successfully!");
          router.push(
            `/checkout/success?orderNumber=${
              orderResult.orderNumber || orderResult.id
            }`
          );
          return;
        }

        // 🛡️ STEP 3: Request the Secure Razorpay Transaction ID (Prepaid Flow)
        const { data: paymentResult } = await apiClient.post(
          "/payments/create-order",
          {
            orderId: orderResult.id,
          }
        );

        // 🛡️ STEP 4: Save data to state to instantly trigger the Payment Modal
        setState((prev) => ({
          ...prev,
          orderId: orderResult.id,
          orderNumber: orderResult.orderNumber || orderResult.id,
          razorpayOrderId: paymentResult.razorpayOrderId,
          keyId: paymentResult.keyId,
          amount: paymentResult.amount,
          isSubmitting: false,
        }));
      } catch (error: any) {
        let errorMessage = "Failed to place order. Please try again.";

        if (isApiError(error)) {
          const backendMessage = error.data?.message || error.message;
          if (error.status === 400) {
            errorMessage = backendMessage || "Invalid request.";
          } else if (error.status === 401) {
            errorMessage = "Please sign in to place an order.";
          } else if (error.status === 404) {
            errorMessage =
              "Some products in your cart are no longer available.";
          }
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          step: "failed",
          error: errorMessage,
        }));

        toast.error(errorMessage);

        if (isApiError(error) && error.status === 401) {
          router.push("/sign-in");
        }
      }
    },
    [cartItems, initiateCheckout, router, dispatch]
  );

  const getOrderForSuccess = useCallback((orderNumber: string) => {
    return useGetOrderByIdQuery(orderNumber, { skip: !orderNumber });
  }, []);

  const orderData = useMemo(() => {
    if (
      state.orderId &&
      state.razorpayOrderId &&
      state.keyId &&
      state.amount !== null
    ) {
      return {
        orderId: state.orderId,
        orderNumber: state.orderNumber || state.orderId,
        razorpayOrderId: state.razorpayOrderId,
        keyId: state.keyId,
        amount: state.amount,
      };
    }
    return null;
  }, [
    state.orderId,
    state.razorpayOrderId,
    state.keyId,
    state.amount,
    state.orderNumber,
  ]);

  return {
    ...state,
    orderData,
    isSubmitting: state.isSubmitting,
    isProcessing: state.isProcessing,
    isInitiating,
    handlePlaceOrder,
    handlePaymentSuccess,
    handlePaymentFailure,
    resetCheckout,
    getOrderForSuccess,
    cartItems,
  };
}
