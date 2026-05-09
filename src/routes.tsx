import { createBrowserRouter } from "react-router-dom";
import ReactExample from "./Day0/ReactExample";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ReactExample />,
  },
  {
    path: "/day-0",
    element: <ReactExample />,
  },
  // Add future days here:
  // { path: "/day-1", element: <Day1Component /> },
]);

export default router;
