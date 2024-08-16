const auth = [
  {
    path: '/auth',
    component: () => import('@views/home/index.vue'),
    children: [
      {
        path: '/login',
        name: 'LoginPage',
        component: () => import('@views/auth/login/index.vue')
      },
      {
        path: '/register',
        name: 'RegisterPage',
        component: () => import('@views/auth/register/index.vue')
      },
      {
        path: '/forgot-password',
        name: 'ForgotPasswordPage',
        component: () => import('@views/auth/forgot-password/index.vue')
      },

      {
        path: '/expired-reset-password',
        name: 'ExpiredResetPassword',
        component: () => import('@views/auth/expired-reset-password/index.vue')
      },
      {
        path: '/create-new-password',
        name: 'CreateNewPassword',
        component: () => import('@views/auth/create-new-password/index.vue')
      }
    ]
  }
]

export default auth
