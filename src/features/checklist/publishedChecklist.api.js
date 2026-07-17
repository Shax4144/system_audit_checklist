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
		}),
	})

export const {
  useFetchPublishedQuery,
  useLazyFetchPublishedQuery
} = publishedApi
