import { baseApi } from "../users/base.api"

const BASE_ENDPOINT = "api/logout"

export const logoutApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		logout: builder.mutation({
			query: () => ({
				url: BASE_ENDPOINT,
				method: "POST",
			}),
		}),
	}),
})

export const { useLogoutMutation } = logoutApi