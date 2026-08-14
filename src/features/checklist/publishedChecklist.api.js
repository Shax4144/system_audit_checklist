import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/published-checklist/mine"

export const publishedApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["Published"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchPublished: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["Published"],
      }),

			fetchPublishedById: builder.query({
				query: (id) => ({
					url: `${BASE_ENDPOINT}/${id}`,
					method: "GET",
				}),
				providesTags: ["Published"],
			}),
		}),
	})

export const {
  useFetchPublishedQuery,
  useFetchPublishedByIdQuery,
  useLazyFetchPublishedQuery,
  useLazyFetchPublishedByIdQuery,
} = publishedApi
