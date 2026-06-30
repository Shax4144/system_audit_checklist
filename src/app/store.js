import { configureStore } from "@reduxjs/toolkit"
import { oneChargingBaseApi } from "../features/dropdown/one-charging-option"

export const store = configureStore({
	reducer: {
		[oneChargingBaseApi.reducerPath]: oneChargingBaseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(oneChargingBaseApi.middleware),
})
