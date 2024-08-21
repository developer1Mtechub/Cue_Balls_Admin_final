// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import TwoStepsCover from "../../views/OTPVerification";
import Dashboard from "../../views/Dashboard";
import Games from "../../views/Games";
import Users from "../../views/Users";
import DeletedUsers from "../../views/Deletedusers";
import Feedbacks from "../../views/Feedbacks";
import ResetPassword from "../../views/ResetPassword";
import ChangePasswordProfile from "../../views/ChangePasswordProfile";
import PrivacyPolicy from "../../views/PrivacyPolicy";
import TermsConditions from "../../views/TermsCondition";
import SocialLinks from "../../views/SocialLinks";
import UserDetails from "../../views/UserDetails";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/home";

const Home = lazy(() => import("../../views/Home"));
const Login = lazy(() => import("../../views/Login"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const Error = lazy(() => import("../../views/Error"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  
  {
    path: "/change_password_profile",
    element: <ChangePasswordProfile />,
  },
  {
    path: "/games",
    element: <Games />,
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/deleted_users",
    element: <DeletedUsers />,
  },
  {
    path: "/feedbacks",
    element: <Feedbacks />,
  },
  {
    path: "/privacy_policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms_and_conditions",
    element: <TermsConditions />,
  },
  {
    path: "/social_links",
    element: <SocialLinks />,
  },
  {
    path: "/user_details",
    element: <UserDetails/>,
  },
 
  {
    path: "/verifyEmail",
    element: <TwoStepsCover />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  //   meta: {
  //     layout: "blank",
  //   },
  // },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
   
  },
  {
    path: "/terms-conditions",
    element: <TermsConditions />,
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
