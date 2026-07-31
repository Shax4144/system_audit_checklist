import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/published-checklist/mine/response"

export const submitSectionApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["Submit"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			submitSection: builder.mutation({
				query: (body) => ({
					url: BASE_ENDPOINT,
					method: "POST",
					body,
				}),
				invalidatesTags: ["Submit"],
      }),
		}),
	})

export const { useSubmitSectionMutation } = submitSectionApi