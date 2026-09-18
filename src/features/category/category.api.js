import { baseApi } from "../users/base.api" 

const BASE_ENDPOINT = "api/category-types"

export const categoriesApi = baseApi
	// .enhanceEndpoints({
	// 	addTagTypes: ["Categories"],
	// })
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchCategories: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["Categories"],
			}),
			postCategory: builder.mutation({
				query: (body) => ({
					url: BASE_ENDPOINT,
					method: "POST",
					body,
				}),
				invalidatesTags: ["Categories"],
			}),
			updateCategory: builder.mutation({
				query: ({ id, ...body }) => ({
					url: `${BASE_ENDPOINT}/${id}`,
					method: "PUT",
					body,
				}),
				invalidatesTags: ["Categories"],
			}),
			archiveCategory: builder.mutation({
				query: (id) => ({
					url: `${BASE_ENDPOINT}/${id}`,
					method: "DELETE",
				}),
				invalidatesTags: ["Categories"],
			}),
		}),
	})

export const {
	useFetchCategoriesQuery,
	useLazyFetchCategoriesQuery,
	usePostCategoryMutation,
	useUpdateCategoryMutation,
	useArchiveCategoryMutation,
} = categoriesApi