// components/CategoryDropdown.jsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFetchUserAccountsQuery } from "../../features/user-accounts/users.api";

const UserAccountsDropdown = ({
  value,
  onChange,
  open,
  triggerClassName,
  disabledValues = [],
}) => {
  const { data: userAccountResponse, isFetching } = useFetchUserAccountsQuery(
    { pagination: "none" },
    { skip: !open },
  );

  const userAccountData = userAccountResponse?.data ?? [];

  return (
    <Select value={value} onValueChange={onChange} disabled={isFetching}>
      <SelectTrigger
        className={`
          ${triggerClassName ?? ""}
          [&>svg]:transition-transform
          [&>svg]:duration-200
          data-[state=open]:[&>svg]:rotate-180
        `}
      >
        <SelectValue placeholder={isFetching ? "Loading..." : "User"} />
      </SelectTrigger>
      <SelectContent position="popper">
        {userAccountData.map((user) => {
          const isDisabled = disabledValues.includes(String(user.id));
          return (
            <SelectItem
              key={user.id}
              value={String(user.id)}
              disabled={isDisabled}
            >
              {user.first_name} {user.last_name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default UserAccountsDropdown;
