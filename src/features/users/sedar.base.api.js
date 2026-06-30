import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const sedarToken = import.meta.env.VITE_REACT_APP_SEDAR_KEY
const sedarBaseUrl = "https://rdfsedar.com"

export const sedarBaseApi = createApi({
	reducerPath: "sedarBaseApi",
	baseQuery: fetchBaseQuery({
		baseUrl: sedarBaseUrl,
		withCredentials: false,
		prepareHeaders: (headers) => {
			headers.set("Accept", "application/json")
			headers.set("Authorization", `Bearer ${sedarToken}`)
			// headers.set('X-Auth-Token', `Bearer ${sedarToken}`);

			return headers
		},
		paramsSerializer: (params) => {
			return queryString.stringify(params, {
				skipNull: true,
				skipEmptyString: true,
			})
		},
	}),
	endpoints: () => ({}),
})
