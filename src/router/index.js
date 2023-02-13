import Vue from "vue";
import VueRouter from "vue-router";

import Login from "../views/Login/Resident_Login.vue";
import Admin from "../components/Sidebar.vue";

import Dashboard from "../views/Admin/Dashboard.vue";
import Analytics from "../views/Admin/Analytics.vue";
import Barangay_Officials from "../views/Admin/Barangay_Officials.vue";
import Blotter from "../views/Admin/Blotter.vue";
import Covid19 from "../views/Admin/Covid19.vue";
import Resident_Information from "../views/Admin/Resident_Information.vue";
import Revenues from "../views/Admin/Revenues.vue";
import Barangay_Certificates from "../views/Admin/Barangay_Certificates.vue";
import General_Setting from "../views/Admin/General_Setting.vue";
import Barangay_Information from "../views/Admin/Settings/Barangay_Information.vue";
import Households from "../views/Admin/Settings/Households.vue";
import Position from "../views/Admin/Settings/Positions.vue";
import Chairmanship from "../views/Admin/Settings/Chairmanship.vue";
import User from "../views/Admin/Settings/User.vue";
import RequestCertification from "../views/Admin/Request_Certification.vue";
import Create_Certificates from "../views/Admin/Create_Certificates.vue";
import EditProfile from "../views/Admin/EditProfile.vue";
import EditResidentProfile from "../views/Admin/EditResidentProfile.vue";
import EditAdminProfile from "../views/Admin/EditAdminProfile.vue";
import Announcement from "../views/Admin/Announcement.vue";
import Hotline from "../views/Admin/Hotline.vue";
import Reports from "../views/Admin/Reports/Reports.vue";
import ReportList from "../views/Admin/Reports/ReportList.vue";
import Logs from "../views/Admin/Logs.vue";

import Certificate from "../views/Admin/Certificates/Barangay_Certificates.vue";
import Clearance from "../views/Admin/Certificates/Barangay_Clearance.vue";
import Indigency from "../views/Admin/Certificates/Indigency.vue";
import BlotterCertificate from "../views/Admin/Certificates/Blotter.vue";
import Business_Clearance from "../views/Admin/Certificates/Business_Clearance.vue";
import ResidentDetails from "../views/Admin/Certificates/ResidentDetails.vue";
import ResidentRegistration from "../views/Admin/ResidentRegistration.vue";
import UserManagement from "../views/Admin/UserManagement.vue";

import UserInformation from "../views/Admin/Registration/UserInformation.vue";
import UserInformation2 from "../views/Admin/Registration/UserInformation2.vue";
import UserInformation3 from "../views/Admin/Registration/UserInformation3.vue";
import UserInformation4 from "../views/Admin/Registration/UserInformation4.vue";
import UserInformation5 from "../views/Admin/Registration/UserInformation5.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Login",
        component: Login,
        alias: "/L",
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem("token");
            if (to.name != "Login" && token == null) {
                next({ path: "/", replace: true });
            } else if (to.name == "Login" && token != null) {
                next({ path: "/dashboard", replace: true });
            } else {
                next();
            }
        },
    },
    {
        path: "/register/user-information",
        name: "UserInformation",
        component: UserInformation,
    },
    {
        path: "/register/user-resident-information",
        name: "UserInformation2",
        component: UserInformation2,
    },
    {
        path: "/register/user-profile-information",
        name: "UserInformation3",
        component: UserInformation3,
    },
    {
        path: "/register/user-profile-picture",
        name: "UserInformation4",
        component: UserInformation4,
    },
    {
        path: "/register/confirmation",
        name: "UserInformation5",
        component: UserInformation5,
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem("token");
            if (to.name != "Login" && token == null) {
                next({ path: "/", replace: true });
            } else if (to.name == "Login" && token != null) {
                next({ path: "/admin", replace: true });
            } else {
                next();
            }
        },
        children: [
            {
                path: "/dashboard",
                name: "Dashboard",
                component: Dashboard,
            },
            {
                path: "/resident_registration",
                name: "ResidentRegistration",
                component: ResidentRegistration,
            },
            {
                path: "/analytics",
                name: "Analytics",
                component: Analytics,
            },
            {
                path: "/announcement",
                name: "Announcement",
                component: Announcement,
            },
            {
                path: "/hotline",
                name: "Hotline",
                component: Hotline,
            },
            {
                path: "/logs",
                name: "Logs",
                component: Logs,
            },
            {
                path: "/barangay_officials",
                name: "Barangay_Officials",
                component: Barangay_Officials,
            },
            {
                path: "/blotter",
                name: "Blotter",
                component: Blotter,
            },
            {
                path: "/covid",
                name: "Covid19",
                component: Covid19,
            },
            {
                path: "/covid/:ids",
                name: "Covid19",
                component: Covid19,
                props: true,
            },
            {
                path: "/resident_information",
                name: "Resident_Information",
                component: Resident_Information,
            },
            {
                path: "/user_management",
                name: "UserManagement",
                component: UserManagement,
            },
            {
                path: "/revenues",
                name: "Revenues",
                component: Revenues,
            },
            {
                path: "/reports",
                name: "Reports",
                component: Reports,
            },
            {
                path: "/reports/list/:id",
                name: "ReportList",
                component: ReportList,
                props: true,
            },
            {
                path: "/barangay_certificates",
                name: "Barangay_Certificates",
                component: Barangay_Certificates,
            },
            {
                path: "/request_certification",
                name: "RequestCertification",
                component: RequestCertification,
            },
            {
                path: "/general_setting",
                name: "General_Setting",
                component: General_Setting,
            },
            {
                path: "/settings/barangay_information",
                name: "Barangay_Information",
                component: Barangay_Information,
            },
            {
                path: "/settings/position",
                name: "Position",
                component: Position,
            },
            {
                path: "/settings/chairmanship",
                name: "Chairmanship",
                component: Chairmanship,
            },
            {
                path: "/settings/households",
                name: "Households",
                component: Households,
            },
            {
                path: "/settings/user",
                name: "User",
                component: User,
            },
            {
                path: "/create-certificate",
                name: "Create_Certificates",
                component: Create_Certificates,
                props: true,
            },
            {
                path: "/resident_details/:id",
                name: "ResidentDetails",
                component: ResidentDetails,
                props: true,
            },
            {
                path: "/certificate/barangay_certificates/:id",
                name: "Barangay_Certificate",
                component: Certificate,
                props: true,
            },
            {
                path: "/certificate/barangay_clearance/:id",
                name: "Barangay_Clearance",
                component: Clearance,
                props: true,
            },
            {
                path: "/certificate/indigency/:id",
                name: "Indigency",
                component: Indigency,
                props: true,
            },
            {
                path: "/certificate/blotter/:id",
                name: "Blotter",
                component: BlotterCertificate,
                props: true,
            },
            {
                path: "/certificate/business_clearance/:id",
                name: "Business_Clearance",
                component: Business_Clearance,
                props: true,
            },
            {
                path: "/edit_profile/",
                name: "Edit_Profile",
                component: EditProfile,
                props: true,
            },
            {
                path: "/edit_resident_profile/",
                name: "Edit_Resident_Profile",
                component: EditResidentProfile,
                props: true,
            },
            {
                path: "/edit_admin_profile/",
                name: "Edit_Admin_Profile",
                component: EditAdminProfile,
                props: true,
            },
        ],
    },
];

const router = new VueRouter({
    mode: "history",
    routes,
});

// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem("token");

//     if (to.name == "Login" && token !== null) {
//         next({ path: "/admin", replace: true });
//     } else if (
//         to.name !== "Login" &&
//         token == null &&
//         to.name != "UserInformation"
//     ) {
//         next({ path: "/", replace: true });
//     } else {
//         next();
//     }
// });

export default router;
