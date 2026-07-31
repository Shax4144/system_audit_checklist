// features/reports/reports.api.js
import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/publish-checklists"

export const reportsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["Reports"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchReports: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["Reports"],
			}),

			fetchReportById: builder.query({
				query: (id) => ({
					url: `${BASE_ENDPOINT}/${id}`,
					method: "GET",
				}),
				providesTags: (result, error, id) => [{ type: "Reports", id }],
			}),
		}),
	})

export const {
  useFetchReportsQuery,
  useFetchReportByIdQuery
} = reportsApi
