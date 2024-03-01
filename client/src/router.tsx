import { createBrowserRouter } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/chat",
        element: <Chat />
    }
]);

export default router;