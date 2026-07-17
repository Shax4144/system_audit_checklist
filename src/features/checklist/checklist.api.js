import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/checklists"

export const checklistsApi = baseApi
	.enhanceEndpoints({
		addTagTypes: ["Checklists"],
	})
	.injectEndpoints({
		endpoints: (builder) => ({
			fetchChecklists: builder.query({
				query: (params) => ({
					url: BASE_ENDPOINT,
					method: "GET",
					params,
				}),
				providesTags: ["Checklists"],
			}),
			postChecklist: builder.mutation({
				query: (body) => ({
					url: BASE_ENDPOINT,
					method: "POST",
					body,
				}),
				invalidatesTags: ["Checklists"],
			}),
			updateChecklist: builder.mutation({
				query: ({ id, ...body }) => ({
					url: `${BASE_ENDPOINT}/${id}`,
					method: "PUT",
					body,
				}),
				invalidatesTags: ["Checklists"],
			}),
			archiveChecklist: builder.mutation({
				query: (id) => ({
					url: `${BASE_ENDPOINT}/${id}`,
					method: "DELETE",
				}),
				invalidatesTags: ["Checklists"],
			}),
			publishChecklist: builder.mutation({
				query: ({ id, ...body }) => ({
					url: `${BASE_ENDPOINT}/${id}/publish`,
					method: "POST",
					body,
				}),
				invalidatesTags: ["Checklists"],
			}),
		}),
	})

export const {
	useFetchChecklistsQuery,
	useLazyFetchChecklistsQuery,
	usePostChecklistMutation,
	useUpdateChecklistMutation,
	useArchiveChecklistMutation,
	usePublishChecklistMutation,
} = checklistsApi
