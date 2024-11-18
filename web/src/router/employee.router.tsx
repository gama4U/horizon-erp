import Layout from "@/components/layout";
import Clients from "@/pages/employee/clients";
import DocumentTransactions from "@/pages/employee/document-transactions";
import DocumentTransactionDetails from "@/pages/employee/document-transactions/details";
import Memorandum from "@/pages/employee/memorandum";
import MemorandumDetails from "@/pages/employee/memorandum/details";
import Packages from "@/pages/employee/packages";
import PackageDetails from "@/pages/employee/packages/details";
import Profile from "@/pages/employee/profile";
import PurchaseRequests from "@/pages/employee/purchase-request";
import PurchaseRequestDetails from "@/pages/employee/purchase-request/details";
import SalesAgreements from "@/pages/employee/sales-agreement";
import SalesAgreementDetails from "@/pages/employee/sales-agreement/details";
import Suppliers from "@/pages/employee/suppliers";
import Transactions from "@/pages/employee/transactions";
import ManageTransaction from "@/pages/employee/transactions/details";
import { RouteObject } from "react-router-dom";

const employeeRouter: RouteObject = {
  path: '/employee',
  element: <Layout />,
  children: [
    {
      path: '',
      element: <Transactions />
    },
    {
      path: 'transactions/:id/',
      element: <ManageTransaction />
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
      path: 'sales-agreements',
      element: <SalesAgreements />
    },
    {
      path: 'sales-agreements/:id',
      element: <SalesAgreementDetails />
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

export default employeeRouter;
