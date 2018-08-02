import React from 'react';
import { Redirect } from 'react-router';
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Logout from "@material-ui/icons/ExitToApp";
import Unarchive from "@material-ui/icons/Unarchive";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import UserProfile from "views/UserProfile/UserProfile.jsx";
// import TableList from "views/TableList/TableList.jsx";
// import NotificationsPage from "views/Notifications/Notifications.jsx";
import LogoutPage from 'views/Auth/Logout.jsx';
import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.jsx";
import Valve from "views/Valve/Valve.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/user",
    sidebarName: "Account",
    navbarName: "Account",
    icon: Person,
    component: UserProfile
  },
  // {
  //   path: "/table",
  //   sidebarName: "Devices",
  //   navbarName: "Devices",
  //   icon: ContentPaste,
  //   component: TableList
  // },
  // {
  //   path: "/notifications",
  //   sidebarName: "Notifications",
  //   navbarName: "Notifications",
  //   icon: Notifications,
  //   component: NotificationsPage
  // },
  {
      path: "/logout",
      sidebarName: "Logout",
      navbarName: "Logout",
      icon: Logout,
      component: LogoutPage,
  },
  {
    path: "/upgrade-to-pro",
    sidebarName: "Upgrade To PRO",
    navbarName: "Upgrade To PRO",
    icon: Unarchive,
    component: UpgradeToPro
  },
  {
    path: "/valves/:id",
    root: "/valves",
    navbarName: "Valve Detail",
    component: Valve,
    invisible: true,
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
