import { Mail, Home, PieChart, Users, UserMinus, MessageSquare, Lock, FileText, Link } from "react-feather";
import poolImage from "../../assets/images/pages/pool.png"
import dashboardImage from "../../assets/images/pages/dashboard.png"
import usertab from "../../assets/images/pages/usertab.png"
import deleteuser from "../../assets/images/pages/deleteuser.png"
import feedback from "../../assets/images/pages/feedback.png"

export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <img src={dashboardImage} width="20px" height="20px" style={{marginRight:'20px'}} />,
    navLink: "/home",
  },
  {
    id: "games",
    title: "All Games",
    icon: <img src={poolImage} width="25px" height="20px" style={{marginRight:'18px'}} />,
    navLink: "/games",
  },
  {
    id: "users",
    title: "All Users",
    icon: <img src={usertab} width="20px" height="20px" style={{marginRight:'20px'}} />,
    navLink: "/users",
  },
  {
    id: "deleted_users",
    title: "Deleted Users",
    icon: <img src={deleteuser} width="20px" height="20px" style={{marginRight:'20px'}} />,
    navLink: "/deleted_users",
  },
  {
    id: "feedbacks",
    title: "Feedbacks",
    icon: <img src={feedback} width="20px" height="20px" style={{marginRight:'20px'}} />,
    navLink: "/feedbacks",
  },
  {
    id: "privacy_policy",
    title: "Privacy Policy",
    icon: <Lock size={20} />,
    navLink: "/privacy_policy",
  },
  {
    id: "terms_and_conditions",
    title: "Terms and Conditions",
    icon: <FileText size={20} />,
    navLink: "/terms_and_conditions",
  },
  {
    id: "social_links",
    title: "Social Links",
    icon: <Link size={20} />,
    navLink: "/social_links",
  },
  // {
  //   id: "home",
  //   title: "Home",
  //   icon: <Home size={20} />,
  //   navLink: "/home",
  // },
  // {
  //   id: "secondPage",
  //   title: "Second Page",
  //   icon: <Mail size={20} />,
  //   navLink: "/second-page",
  // },
];
