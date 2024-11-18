import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages";
import SignIn from "../pages/auth/sign-in";
import employeeRouter from "./employee.router";
import adminRouter from "./admin.router";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/auth/sign-in',
    element: <SignIn />
  },
  {...adminRouter},
  {...employeeRouter}
]);

export default router;
