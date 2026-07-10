// components/CategoryDropdown.jsx
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import { useFetchCategoriesQuery } from "../../features/category/category.api"

const CategoryDropdown = ({ value, onChange, open, triggerClassName }) => {
	const { data: categoriesResponse, isFetching } = useFetchCategoriesQuery(
		{ pagination: "none" },
		{ skip: !open},
	)

	const categoriesData = categoriesResponse?.data ?? []

	return (
		<Select value={value} onValueChange={onChange} disabled={isFetching}>
			<SelectTrigger className={triggerClassName}>
				<SelectValue placeholder={isFetching ? "Loading..." : "Category"} />
			</SelectTrigger>
			<SelectContent position="popper">
				{categoriesData.map((category) => (
					<SelectItem key={category.id} value={category.name}>
						{category.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default CategoryDropdown
