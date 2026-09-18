import { baseApi } from "../users/base.api" 

const BASE_ENDPOINT = "api/suppliers"

export const suppliersApi = baseApi
  // .enhanceEndpoints({
  //   addTagTypes: ["Suppliers"]
  // })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchSuppliers: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Suppliers"],
      }),
      postSupplier: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Suppliers"],
      }),
      updateSupplier: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Suppliers"],
      }),
      archiveSupplier: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Suppliers"],
      }),
    })
  })

export const {
  useFetchSuppliersQuery,
  useLazyFetchSuppliersQuery,
  usePostSupplierMutation,
  useUpdateSupplierMutation,
  useArchiveSupplierMutation,
} = suppliersApi