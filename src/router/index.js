import { createRouter, createWebHistory } from 'vue-router'
// import { storeToRefs } from 'pinia'
// import { useAuthStore } from "@store";

import auth from './auth'
import admin from './admin'
// import { getAuthToken } from "@helpers/storage.helper";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...auth,
    ...admin,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@views/auth/login/index.vue')
    }
  ]
})

// router.beforeEach(async (to, from) => {
//   const ACCESSIBLE_URLS = [
//     "SignInDenied",
//     "LoginPage",
//     "RegisterPage",
//     "ForgotPasswordPage",
//     "CreateNewPassword",
//     "ExpiredResetPassword",
//     "Action",
//     "VerifyEmail",
//     "VerifyEmailDenied",
//     "VerifyEmailSucceed",
//     "VerifyEmailExpired",
//     "VerifyEmailInvalid",
//   ];
//   if (ACCESSIBLE_URLS.includes(to.name)) {
//     return true;
//   } else {
//     return true;
//     // if (getAuthToken()) return true;
//     // else {
//     //   await router.replace({ name: "SignInDenied" });
//     //   return false;
//     // }
//   }
// });

export default router
