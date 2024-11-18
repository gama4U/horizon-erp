import Layout from "@/components/layout";
import Dashboard from "@/pages/admin/dashboard";
import Clients from "@/pages/admin/clients";
import Memorandum from "@/pages/admin/memorandum";
import MemorandumDetails from "@/pages/admin/memorandum/details";
import Profile from "@/pages/admin/profile";
import PurchaseRequests from "@/pages/admin/purchase-request";
import PurchaseRequestDetails from "@/pages/admin/purchase-request/details";
import SalesAgreements from "@/pages/admin/sales-agreement";
import SalesAgreementDetails from "@/pages/admin/sales-agreement/details";
import Transactions from "@/pages/admin/transactions";
import ManageTransaction from "@/pages/admin/transactions/details";
import Users from "@/pages/admin/users";
import { RouteObject } from "react-router-dom";
import Suppliers from "@/pages/admin/suppliers";
import DocumentTransactions from "@/pages/admin/document-transactions";
import DocumentTransactionDetails from "@/pages/admin/document-transactions/details";
import Packages from "@/pages/admin/packages";
import PackageDetails from "@/pages/admin/packages/details";

const adminRouter: RouteObject = {
  path: '/admin',
  element: <Layout />,
  children: [
    {
      path: '',
      element: <Dashboard />
    },
    {
      path: 'transactions',
      element: <Transactions />
    },
    {
      path: 'transactions/:id/',
      element: <ManageTransaction />
    },
    {
      path: 'users',
      element: <Users />
    },
    {
      path: 'clients',
      element: <Clients />
    },
    {
      path: 'suppliers',
      element: <Suppliers />
    },
    {
      path: 'purchase-requests',
      element: <PurchaseRequests />
    },
    {
      path: 'purchase-requests/:id',
      element: <PurchaseRequestDetails />
    },
    {
      path: 'memorandum',
      element: <Memorandum />
    },
    {
      path: 'memorandum/:id',
      element: <MemorandumDetails />
    },
    {
      path: 'document-transactions',
      element: <DocumentTransactions />
    },
    {
      path: 'document-transactions/:id',
      element: <DocumentTransactionDetails />
    },

    {
      path: 'sales-agreements',
      element: <SalesAgreements />
    },
    {
      path: 'sales-agreements/:id',
      element: <SalesAgreementDetails />
    },
    {
      path: 'packages',
      element: <Packages />
    },
    {
      path: 'packages/:id',
      element: <PackageDetails />
    },
    {
      path: 'profile',
      element: <Profile />
    }
  ]
}

export default adminRouter;
