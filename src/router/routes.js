import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
const Sensors = () => import(/* webpackChunkName: "sensors" */"@/pages/Sensors.vue");
const Details = () => import(/* webpackChunkName: "details" */"@/pages/Details.vue");
const Dashboard = () => import(/* webpackChunkName: "details" */"@/pages/Dashboard.vue");

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "sensors",
        name: "sensors",
        component: Sensors
      },
      {
        path: "details",
        name: "details",
        component: Details
      }
    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
