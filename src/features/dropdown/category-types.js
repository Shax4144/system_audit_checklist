import { baseApi } from "../users/base.api";

const BASE_ENDPOINT = "api/dropdown/category-types";

export const dropdownCategoriesApi = baseApi
	// .enhanceEndpoints({
	// 	addTagTypes: ["Categories"],
	// })
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchDropdownCategories: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["Categories"],
			}),
		}),
	})

export const {
	useFetchDropdownCategoriesQuery,
	useLazyFetchDropdownCategoriesQuery,
} = dropdownCategoriesApi