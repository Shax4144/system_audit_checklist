import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute, RequirePermission } from "./components/ProtectedRoute";
import SuspenseWrapper from "./components/SuspenseWrapper";

import masterlistConfig from "./config/masterlist-routes.config";
import workspaceConfig from "./config/workspace-routes.config";

const Landing = lazy(() => import("./Landing"));
const Dashboard = lazy(() => import("./routes/workspace/Dashboard/Dashboard"));
const MyChecklistAnswer = lazy(
  () => import("./routes/workspace/Dashboard/MyChecklistAnswer"),
);

//OneRDF INTEGRATION
import ExternalRedirect from "./ExternalRedirect";
import Redirect from "./Redirect";

import { Toaster } from "@/components/ui/sonner";
import { SelectedRowProvider } from "./context/EditContext";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedRowProvider>
        <Router>
          <Routes>
            <Route
              exact
              path="/redirect"
              element={
                <SuspenseWrapper>
                  <Redirect />
                </SuspenseWrapper>
              }
            />
            {/* <Route
              exact
              path="/"
              element={
                <ExternalRedirect url="https://pretest-one.rdfmis.com/" />
              }
            />*/}
            {/* change to /adminlogin for ONE RDF */}
            <Route exact path="/" element={<Landing />} /> 
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role={["Admin", "Admin-Audit", "Audit"]} />
              }
            >
              <Route
                index
                exact
                element={
                  <SuspenseWrapper>
                    <Dashboard />
                  </SuspenseWrapper>
                }
              />
              <Route
                path="my-checklist/:id"
                element={
                  <SuspenseWrapper>
                    <MyChecklistAnswer />
                  </SuspenseWrapper>
                }
              />
            </Route>
            <Route
              exact
              path="/workspace"
              element={
                <ProtectedRoute role={["Admin", "Admin-Audit", "Audit"]} />
              }
            >
              {workspaceConfig.map(
                ({ path, component: Component, permissions }) => (
                  <Route
                    key={path}
                    exact
                    path={path}
                    element={
                      <RequirePermission permissions={permissions}>
                        <SuspenseWrapper>
                          <Component />
                        </SuspenseWrapper>
                      </RequirePermission>
                    }
                  />
                ),
              )}
            </Route>
            <Route
              exact
              path="/masterlist"
              element={<ProtectedRoute role={["Admin"]} />}
            >
              {masterlistConfig.map(
                ({ path, component: Component, permissions }) => (
                  <Route
                    key={path}
                    exact
                    path={path}
                    element={
                      <RequirePermission permissions={permissions}>
                        <SuspenseWrapper>
                          <Component />
                        </SuspenseWrapper>
                      </RequirePermission>
                    }
                  />
                ),
              )}
            </Route>
          </Routes>
        </Router>
        <Toaster richColors position="top-right" />
      </SelectedRowProvider>
    </QueryClientProvider>
  );
}
