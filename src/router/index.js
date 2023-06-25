import LoginPage from "@/components/LoginPage.vue";
import HomePage from "@/components/HomePage.vue";
import ProfilePage from "@/components/ProfilePage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import RegisterRecruiter from "@/components/RegisterRecruiter.vue";
import RegisterRequestsPage from "@/components/RegisterRequestsPage.vue";
import JobPage from "@/components/JobPage.vue";
import ManageJobPage from "@/components/ManageJobPage.vue";
import ApplicantsPage from "@/components/ApplicantsPage.vue";
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
          {
            path: "/login",
            component: LoginPage,
            props: (route) => ({
              redirected: route.query.redirected || false,
            }),
          },
          {
            path: "/home",
            component: HomePage,
          },
          {
            path: "/myprofile",
            component: ProfilePage,
          },
          {
            path: "/profile/:id",
            component: ProfilePage,
            props: true,
          },
          {
            path: "/register",
            component: RegisterPage,
          },
          {
            path: "/recruiter/register",
            component: RegisterRecruiter,
          },
          {
            path: "/register-requests",
            component: RegisterRequestsPage,
          },
          {
            path: '/jobs',
            component: HomePage,
          },
          {
            path: "/jobs/:id",
            component: JobPage,
            props: true,
          },
          {
            path: "/jobs/:id/applicants",
            component: ApplicantsPage,
            props: true,
          },
          {
            path: "/jobs/manage",
            component: ManageJobPage,
          },
          {
            path: '/:catchAll(.*)',
            component: HomePage,
          },
    ],
  });

  
  export default router;
  