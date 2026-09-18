import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/count-checklists"

export const dashboardCountApi = baseApi
	// .enhanceEndpoints({
	// 	addTagTypes: ["Counts"],
	// })
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchDashboardCount: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["Counts"],
      }),
		}),
	})

export const {
  useFetchDashboardCountQuery,
} = dashboardCountApi
