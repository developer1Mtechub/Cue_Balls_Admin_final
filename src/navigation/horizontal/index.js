import { Mail, Home, PieChart, Users, UserMinus, MessageSquare, Lock, FileText, Link } from "react-feather";
import poolImage from "../../assets/images/pages/pool.png"
export default [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <PieChart size={20} />,
    navLink: "/home",
  },
  {
    id: "games",
    title: "All Games",
    icon: <img src={poolImage} width="20px" height="20px" />,
    navLink: "/games",
  },
  {
    id: "users",
    title: "All Users",
    icon: <Users size={20} />,
    navLink: "/users",
  },
  {
    id: "deleted_users",
    title: "Deleted Users",
    icon: <UserMinus size={20} />,
    navLink: "/deleted_users",
  },
  {
    id: "feedbacks",
    title: "Feedbacks",
    icon: <MessageSquare size={20} />,
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
