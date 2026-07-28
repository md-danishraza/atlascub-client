import { api, API_TAGS } from "../api";

export interface StoreSettings {
  id: string;
  isAcceptingOrders: boolean;
  freeShippingThreshold: number;
  shippingCost: number;
  taxRate: number;
  isTaxInclusive: boolean;
  updatedAt: string;
  isCodEnabled: boolean;
  codFee: number;
}

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<StoreSettings, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: [API_TAGS.SETTINGS],
    }),

    updateSettings: builder.mutation<StoreSettings, Partial<StoreSettings>>({
      query: (data) => ({
        url: "/settings",
        method: "PATCH",
        data,
      }),
      invalidatesTags: [API_TAGS.SETTINGS],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
