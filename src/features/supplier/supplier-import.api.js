import { baseApi } from "../users/base.api" 

const BASE_ENDPOINT = "api/suppliers/import"

export const importSuppliersApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["Suppliers"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			importSupplier: builder.mutation({
				query: (body) => ({
					url: BASE_ENDPOINT,
					method: "POST",
					body,
				}),
				invalidatesTags: ["Suppliers"],
			}),
		}),
	})

export const {
  useImportSupplierMutation
} = importSuppliersApi