import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { authenticate } from "./features/auth/auth.slice";
import { setUserDetails } from "./features/users/users.slice";

const ONE_LOGIN_FALLBACK_URL = "https://pretest-one.rdfmis.com/";

const Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();

  const hasHandled = useRef(false);

  const getDestination = (user) => {
    const permissions = user?.permissions ?? [];

    if (permissions.includes("Masterlist")) {
      return "/masterlist/user-accounts";
    }

    if (permissions.includes("Report")) {
      return "/workspace/reports";
    }

    if (permissions.includes("Dashboard")) {
      return "/dashboard";
    }

    return "/accessdenied";
  };

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const rawData = new URLSearchParams(search).get("data");

    const fail = (reason) => {
      console.error("[Redirect] failed:", reason);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (import.meta.env.VITE_REACT_APP_PRETEST_PORT) {
        window.location.href = ONE_LOGIN_FALLBACK_URL;
      }
    };

    if (!rawData) {
      fail('missing "data" query parameter');
      return;
    }

    try {
      // URLSearchParams already decodes the query parameter.
      const payload = JSON.parse(rawData);

      console.log("[Redirect] payload:", payload);

      // Actual structure:
      //
      // payload
      //   └── data
      //       ├── user
      //       └── token

      const authData = payload?.data;

      if (!authData) {
        throw new Error("Missing authentication data");
      }

      const user = authData?.user;
      const token = authData?.token;

      if (!token) {
        throw new Error("Payload missing token");
      }

      if (!user) {
        throw new Error("Payload missing user");
      }

      console.log("[Redirect] user:", user);
      console.log("[Redirect] token received");

      // Store authentication
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Update Redux
      dispatch(setUserDetails(user));
      dispatch(authenticate());

      // Redirect based on permissions
      navigate(getDestination(user), {
        replace: true,
        state: {
          default_password: false,
        },
      });
    } catch (error) {
      fail(error);
    }
  }, [search, dispatch, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Signing you in...
    </div>
  );
};

export default Redirect;
