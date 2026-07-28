import { api, API_TAGS } from "../../api";

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export type CreateAddressPayload = Omit<Address, "id" | "isDefault"> & {
  isDefault?: boolean;
};

export const addressApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),
      providesTags: [API_TAGS.ADDRESSES],
    }),
    createAddress: builder.mutation<Address, CreateAddressPayload>({
      query: (data) => ({
        url: "/addresses",
        method: "POST",
        data,
      }),
      invalidatesTags: [API_TAGS.ADDRESSES],
    }),
    deleteAddress: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [API_TAGS.ADDRESSES],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
