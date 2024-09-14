import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/pages/404";
import App from "@/App.tsx";
import Dashboard from "@/pages/dashboard";
import SignIn from "./pages/signin";

const routerConfig = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            }
        ]
    },
    {
        path: '/signin',
        element: <SignIn />
    },
    {
        path: '*',
        element: <NotFound />
    }
];

const router = createBrowserRouter(routerConfig);

export const Router = () => {
    return (
        <RouterProvider router={router} />
    )
}