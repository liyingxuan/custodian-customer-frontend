/*
 * **************************************************************************************
 *  Copyright © 2014-2018 Ontology Foundation Ltd.
 *  All rights reserved.
 *
 *  This software is supplied only under the terms of a license agreement,
 *  nondisclosure agreement or other written agreement with Ontology Foundation Ltd.
 *  Use, redistribution or other disclosure of any parts of this
 *  software is prohibited except in accordance with the terms of such written
 *  agreement with Ontology Foundation Ltd. This software is confidential
 *  and proprietary information of Ontology Foundation Ltd.
 *
 * **************************************************************************************
 *
 */

import Vue from "vue";
import Router from "vue-router";
import Layout from "../views/layout/Layout";
import LayoutNotLogin from "../views/layout/LayoutNotLogin";

const _import = file => () => import("@/views/" + file + ".vue");
Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    component: LayoutNotLogin,
    meta: { title: "Login", hidden: true },
    children: [
      {
        path: "",
        component: _import("login/index"),
        children: [
          {
            path: "",
            name: "login",
            component: _import("login/LoginForm"),
            meta: { title: "Login" },
          },
          {
            path: "ga-verify",
            name: "ga-verify",
            component: _import("login/GaVerify"),
            meta: { title: "GA Verify" },
          },
          {
            path: "wait-review",
            name: "wait-review",
            component: _import("login/WaitReview"),
            meta: { title: "Wait Review" },
          },
          {
            path: "email-activation",
            name: "email-activation",
            component: _import("login/EmailActivation"),
            meta: { title: "Email Activation" },
          },
        ],
      },
      {
        path: "set-ga",
        name: "set-ga",
        component: _import("login/SetGA"),
        meta: { title: "Set GA" },
      },
    ],
  },

  {
    path: "/join",
    component: LayoutNotLogin,
    meta: { title: "Join", hidden: true },
    children: [
      {
        path: "",
        name: "join",
        component: _import("join/index"),
        meta: { title: "Join" },
      },
      {
        path: "activate/:token",
        name: "activate-account",
        component: _import("join/index"),
        meta: { title: "Activate" },
      },
      {
        path: "submit-info",
        name: "submit-info",
        component: _import("join/index"),
        meta: { title: "Submit Information" },
      },
      {
        path: "upload-info",
        name: "upload-info",
        component: _import("join/index"),
        meta: { title: "Upload Information" },
      },
    ],
  },

  {
    path: "/password",
    redirect: "/password/forgot",
    component: LayoutNotLogin,
    meta: { title: "Password", hidden: true },
    children: [
      {
        path: "forgot",
        name: "forgot-password",
        component: _import("password/Forgot"),
        meta: { title: "Forgot Password" },
      },
      {
        path: "set/:token",
        name: "set-password",
        component: _import("password/Set"),
        meta: { title: "Set Password" },
      },
    ],
  },

  {
    path: "/dashboard",
    redirect: "/dashboard/",
    component: Layout,
    meta: { title: "Assets" },
    children: [
      {
        path: "",
        name: "dashboard",
        component: _import("dashboard/index"),
        meta: { title: "Dashboard" },
      },
      {
        path: "co-managed",
        name: "co-managed",
        component: _import("account/Co-managedAccount"),
        meta: { title: "Co-managed" },
      },
      {
        path: "escrow",
        name: "escrow",
        component: _import("account/EscrowAccount"),
        meta: { title: "Escrow" },
      },
      {
        path: "create-co-managed-address",
        name: "create-co-managed-address",
        component: _import("account/CreateCo-managedAddress"),
        meta: { title: "Create A Co-managed Address", hidden: true },
      },
      {
        path: "create-escrow-address",
        name: "create-escrow-address",
        component: _import("account/CreateEscrowAddress"),
        meta: { title: "Create An Escrow Address", hidden: true },
      },
      {
        path: "address-detail/:address/:coin_type",
        name: "address-detail",
        component: _import("account/AddressDetail"),
        meta: { title: "Address Detail", hidden: true },
      },
      {
        path: "notifications",
        name: "notifications",
        component: _import("dashboard/Notifications"),
        meta: { title: "Notifications", hidden: true },
      },
      {
        path: "notification-detail/:id",
        name: "notification-detail",
        component: _import("dashboard/NotificationDetail"),
        meta: { title: "Notification Detail", hidden: true },
      },
    ],
  },

  {
    path: "/actions",
    redirect: "/actions/",
    component: Layout,
    meta: { title: "Deposit & Withdraw" },
    children: [
      {
        path: "",
        name: "actions",
        component: _import("actions/Summary"),
        meta: { title: "Summary" },
      },
      {
        path: "deposit",
        name: "deposit",
        component: _import("actions/SelectAddress"),
        meta: { title: "Deposit" },
      },
      {
        path: "withdraw",
        name: "withdraw",
        component: _import("actions/SelectAddress"),
        meta: { title: "Withdraw" },
      },
      {
        path: "withdraw-confirmation/:address/:coin_type",
        name: "withdraw-confirmation",
        component: _import("actions/WithdrawConfirmation"),
        meta: { title: "Withdraw Confirmation", hidden: true },
      },
      {
        path: "deposit-confirmation/:address/:coin_type",
        name: "deposit-confirmation",
        component: _import("actions/DepositConfirmation"),
        meta: { title: "Deposit Confirmation", hidden: true },
      },
      {
        path: "transaction-detail/:tx_id",
        name: "transaction-detail",
        component: _import("actions/TransactionDetail"),
        meta: { title: "Transaction Detail", hidden: true },
      },
    ],
  },

  {
    path: "/workflow",
    redirect: "/workflow/",
    component: Layout,
    meta: { title: "Workflow" },
    children: [
      {
        path: "",
        name: "workflow",
        component: _import("workflow/List"),
        meta: { title: "Workflow", noBreadcrumb: true },
      },
      {
        path: "create-address/:tx_id/action",
        name: "create-address-action",
        component: _import("workflow/CreateAddress"),
        meta: { title: "Create Address", hidden: true },
      },
      {
        path: "create-address/:tx_id",
        name: "create-address-detail",
        component: _import("workflow/CreateAddress"),
        meta: { title: "Create Address", hidden: true },
      },
      {
        path: "withdraw-review/:tx_id/action",
        name: "withdraw-review-action",
        component: _import("workflow/WithdrawReview"),
        meta: { title: "Withdraw Review", hidden: true },
      },
      {
        path: "withdraw-review/:tx_id",
        name: "withdraw-review-detail",
        component: _import("workflow/WithdrawReview"),
        meta: { title: "Withdraw Review", hidden: true },
      },
      {
        path: "withdraw-operation/:tx_id/action",
        name: "withdraw-operation-action",
        component: _import("workflow/WithdrawOperation"),
        meta: { title: "Withdraw Operation", hidden: true },
      },
      {
        path: "withdraw-operation/:tx_id",
        name: "withdraw-operation-detail",
        component: _import("workflow/WithdrawOperation"),
        meta: { title: "Withdraw Operation", hidden: true },
      },
    ],
  },

  {
    path: "/setting",
    redirect: "/setting/",
    component: Layout,
    meta: { title: "System Setting" },
    children: [
      {
        path: "",
        name: "setting",
        component: _import("setting/Dashboard"),
        meta: { title: "Setting Dashboard" },
      },
      {
        path: "user-management",
        name: "user-management",
        component: _import("setting/UserManagement"),
        meta: { title: "User Management" },
      },
      {
        path: "user-information",
        name: "user-information",
        component: _import("setting/UserInformation"),
        meta: { title: "User Information", hidden: true },
      },
      {
        path: "add-user",
        name: "add-user",
        component: _import("setting/AddUser"),
        meta: { title: "Add User", hidden: true },
      },
      {
        path: "password",
        name: "password",
        component: _import("setting/Password"),
        meta: { title: "Change Password" },
      },
      {
        path: "approver",
        name: "approver",
        component: _import("setting/Approver"),
        meta: { title: "Approver Setting" },
      },
      {
        path: "google-authenticator",
        name: "google-authenticator",
        component: _import("setting/GoogleAuthenticator"),
        meta: { title: "Google Authenticator" },
      },
    ],
  },

  { path: "/404", component: _import("404"), meta: { hidden: true } },

  { path: "/", redirect: "/dashboard", meta: { hidden: true } },

  { path: "*", redirect: "/404", meta: { hidden: true } },
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: (to, from, savedPosition) => {
    return to.name === from.name ? savedPosition : { y: 0 };
  },
  routes: constantRouterMap,
});
