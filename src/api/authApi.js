import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_REACT_APP_LOCAL_PORT_1,
	}),
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "api/login",
				method: "POST",
				body: credentials,
			}),
			transformResponse: (response) => response.data,
		}),
	}),
})

export const { useLoginMutation } = authApi
