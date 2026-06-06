import { createBrowserRouter } from "react-router-dom";
import routes from "./route.config";
import { Suspense } from "react";
import SplashLoading from "@/components/lib/SplashLoading";
import { Spinner } from "@heroui/react";
import ProtectedRoute from "./ProtectedRoute";
import HomeRedirect from "./HomeRedirect";

// Full-screen splash — only for the initial layout/app load.
const LayoutLoadable = (Component: any) => (props: any) => (
  <Suspense fallback={<SplashLoading />}>
    <Component {...props} />
  </Suspense>
);

// Lightweight in-content fallback for page transitions, so the sidebar/header
// stay mounted instead of being covered by the full-screen splash.
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner color="primary" size="lg" />
  </div>
);

const PageLoadable = (Component: any) => (props: any) => (
  <Suspense fallback={<PageFallback />}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRedirect />,
  },
  ...routes.map((group) => {
    const Layout = LayoutLoadable(group.layout);

    return {
      element: <Layout />,
      children: group.pages.map((page: any) => {
        const PageComponent = PageLoadable(page.component);
        // Pages declaring a permission are wrapped in ProtectedRoute. Pages
        // without one (login, agent-portal pages) render directly; their auth
        // is enforced by the surrounding layout.
        const element = page.permission ? (
          <ProtectedRoute permission={page.permission}>
            <PageComponent />
          </ProtectedRoute>
        ) : (
          <PageComponent />
        );
        return {
          path: page.path,
          element,
        };
      }),
    };
  }),
]);

export default router;
