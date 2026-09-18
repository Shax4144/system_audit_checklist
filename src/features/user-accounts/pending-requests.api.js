import { baseApi } from "../users/base.api";

const BASE_ENDPOINT = "/api/pending-users";

export const pendingRequestsApi = baseApi
  // .enhanceEndpoints({
  //   addTagTypes: ["PendingUsers"],
  // })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchPendingRequests: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["PendingUsers"],
        transformResponse: (response) => response,
      }),
    }),
  });

export const { useFetchPendingRequestsQuery } = pendingRequestsApi;