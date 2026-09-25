import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/publish-checklists/status-count"

export const reportCountApi = baseApi
	// .enhanceEndpoints({
	// 	addTagTypes: ["Counts"],
	// })
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchReportCount: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["ReportCounts"],
      }),
		}),
	})

export const {
  useFetchReportCountQuery,
} = reportCountApi
