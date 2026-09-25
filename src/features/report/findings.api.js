import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/findings"
export const findingsApi = baseApi
  // .enhanceEndpoints({
  //   addTagTypes: ["Findings"],
  // })
  .injectEndpoints({
    endpoints: (builder) => ({
      postFinding: builder.mutation({
        query: (body) => ({
          url: `${BASE_ENDPOINT}`,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Findings", "Reports", "ReportCounts"],
      }),
    }),
  })

export const { usePostFindingMutation } = findingsApi
