import { createBrowserRouter } from "react-router-dom";
import { LandingPagelayouts } from "../layouts";
import LandingPage from "../Pages/LandingPage";
import SearchPage from "../Pages/SearchPage";
import PackagesPage from "../Pages/PackagesPage";
import AuthPage from "../Pages/AuthPage";
import NotFoundPage from "../Pages/NotFoundPage";
import HospitalDetails from "../Pages/HospitalDetails";

const routerData = createBrowserRouter([
    {
        path: "/",
        element: <LandingPagelayouts />,
        children: [
            {
                path: "",
                element: <LandingPage />,
            },
            {
                path: "search",
                element: <SearchPage />,
            },
            {
                path: "details",
                element: <HospitalDetails />
            },
            {
                path: "packages",
                element: <PackagesPage />,
            },
            {
                path: "login",
                element: <AuthPage />
            }
        ],
    },
    {
        path: "*",
        element: <NotFoundPage />
    }


])

export default routerData;
