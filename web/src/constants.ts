import { TypeOfClient } from "./interfaces/sales-agreement.interface";
import { PermissionType, UserType } from "./interfaces/user.interface";

export type SidebarItemsType = {
  label: string;
  icon: string;
  link: string;
}

const AdminSidebarItems: Array<SidebarItemsType> = [
  { label: "Dashboard", icon: "Dashboard", link: "/admin" },
  { label: "Transaction Vouchers", icon: "Transactions", link: "/admin/transactions" },
  { label: "Proposals", icon: "Packages", link: "/admin/packages" },
  { label: "Sales Agreements", icon: "Purchase", link: "/admin/sales-agreements" },
  { label: "Purchase Requests", icon: "Sales", link: "/admin/purchase-requests" },
  { label: "Clients", icon: "Leads", link: "/admin/clients" },
  { label: "Suppliers", icon: "Suppliers", link: "/admin/suppliers" },
  { label: "Memorandums", icon: "Memorandum", link: "/admin/memorandum" },
  { label: "Document Transactions", icon: "Documents", link: "/admin/document-transactions" },
  { label: "Users", icon: "Users", link: "/admin/users" },
  { label: "Profile", icon: "Profile", link: "/admin/profile" },
]

const EmployeeSidebarItems: Array<SidebarItemsType> = [
  { label: "Transactions Vouchers", icon: "Transactions", link: "/employee" },
  { label: "Proposals", icon: "Packages", link: "/employee/packages" },
  { label: "Sales Agreements", icon: "Purchase", link: "/employee/sales-agreements" },
  { label: "Purchase Requests", icon: "Sales", link: "/employee/purchase-requests" },
  { label: "Clients", icon: "Leads", link: "/employee/clients" },
  { label: "Suppliers", icon: "Suppliers", link: "/employee/suppliers" },
  // { label: "Memorandums", icon: "Memorandum", link: "/employee/memorandum" },
  { label: "Document Transactions", icon: "Documents", link: "/employee/document-transactions" },
  { label: "Profile", icon: "Profile", link: "/employee/profile" },
]

const SupplierCategories = [
  'Power and Electricity Suppliers',
  'Water Supply',
  'Waste Management',
  "Telecommunications",
  'Internet Service Providers',
  'Medical Supplies',
  'Pharmaceuticals',
  'Personal Protective Equipment (PPE)',
  'Laboratory Equipment',
  'Sterilization Products',
  'Credit Card',
]

const ContainerVariants = {
  close: {
    width: "4rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "18rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
}

const VersionNumber: string = '0.1.0'
const NoTopbarPaths = [
  "/admin/transactions"
]

const ClientTypesMap: Record<TypeOfClient, string> = {
  WALK_IN: 'Walk in',
  CORPORATE: 'Corporate',
  GOVERNMENT: 'Government',
  GROUP: 'Group',
  INDIVIDUAL: 'Individual',
}

const UserRedirectRoute: Record<UserType, string> = {
  ADMIN: '/admin',
  EMPLOYEE: '/employee'
}

const PermissionsCanDelete = [PermissionType.SUPER_ADMIN];
const PermissionsCanEdit = [PermissionType.SUPER_ADMIN, PermissionType.ACCOUNTING, PermissionType.SUPERVISOR];
const PermissionsCanApprove = [PermissionType.SUPER_ADMIN, PermissionType.ACCOUNTING, PermissionType.SUPERVISOR];

const GovernmentDepartments = ['Security', 'Education'];
const CorporateDepartments = ['Information Technology', 'Tourism', 'Accounting', 'Human Resource'];

const Disbursements = [
  {
    type: "Cost of Sales",
    classifications: [
      {
        label: "Ticketing",
        types: [
          { label: "Domestic", code: "DOMTKT" },
          { label: "International", code: "INTTKT" }
        ]
      },
      {
        label: "Tour Packages",
        types: [
          { label: "Local", code: "LCLPKG" },
          { label: "International", code: "INTPKG" }
        ]
      },
      {
        label: "Documentation",
        types: [
          { label: "VISA", code: "VISDOC" },
          { label: "Passport", code: "PPTDOC" },
          { label: "Immigration", code: "IMGDOC" }
        ]
      },
      {
        label: "Accommodation",
        types: [
          { label: "Hotel", code: "ACCHTL" },
          { label: "Resorts", code: "ACCRST" },
          { label: "Online", code: "ACCONL" }
        ]
      },
      {
        label: "Transportation",
        types: [
          { label: "Transpo Rental", code: "TRNSPO" },
        ]
      },
      {
        label: "Others",
        types: [
          { label: "Documentation", code: "OTHDOC" },
          { label: "Restaurant", code: "OTHRES" },
          { label: "Entertainment", code: "OTHENT" },
          { label: "Professional Fees", code: "OTHPRO" },
          { label: "Miscellaneous", code: "OTHMIS" },
          { label: "Other's Not Listed", code: "OTHNON" },
        ]
      },
    ]
  },
  {
    type: "Expenses",
    classifications: [
      {
        label: "Operating Expenses",
        types: [
          { label: "Employee Salaries", code: "SALOPX" },
          { label: "Rental", code: "RENTOPX" },
          { label: "Communication and Data", code: "COMPOPX" },
          { label: "Condo Dues", code: "CDOOPX" },
          { label: "Electricity", code: "ELCOPX" },
          { label: "Gasoline", code: "GASOPX" },
          { label: "Repairs and Maintainance", code: "RPROPX" },
        ]
      },
      {
        label: "MKT and Advertising",
        types: [
          { label: "Print", code: "MKTPRT" },
          { label: "Digital / Social Med", code: "MKTDGT" },
          { label: "Professional Fees and Training", code: "MKTPRO" },
          { label: "Events", code: "MKTEVE" },
        ]
      },
      {
        label: "Administrative Exp",
        types: [
          { label: "Travel", code: "ADMTRV" },
          { label: "Representation", code: "ADMREP" },
          { label: "Trainings", code: "ADMTRN" },
          { label: "Professional Services", code: "ADMPRO" },
        ]
      },
      {
        label: "Depreciation",
        types: [
          { label: "Furniture", code: "DEPFUR" },
          { label: "Equipment", code: "DEPEQP" },
          { label: "Improvements", code: "DEPIMP" },
        ]
      },
      {
        label: "Taxes",
        types: [
          { label: "Permits", code: "TXSCTY" },
          { label: "BIR", code: "TXSBIR" },
        ]
      },
      {
        label: "Travel",
        types: [
          { label: "Ticket", code: "TVLTKT" },
          { label: "Accommodation", code: "TVLHTL" },
          { label: "Meals", code: "TVLMLS" },
          { label: "Miscellaneous", code: "TVLMLS" },
        ]
      },
      {
        label: "Employee Benefits",
        types: [
          { label: "SSS", code: "BENSSS" },
          { label: "Phil Health", code: "BENPHL" },
          { label: "Pag Ibig", code: "BENPAG" },
          { label: "Insurance", code: "BENINS" },
          { label: "13 Months", code: "BEN13M" },
          { label: "Commissions/Incentives", code: "BENCOM" },
        ]
      },
    ]
  }
];

const CommonDocuments = [
  { value: "Passport", label: "Passport" },
  { value: "NBI Clearance", label: "NBI Clearance" },
  { value: "Birth Certificate", label: "Birth Certificate" },
  { value: "Marriage Certificate", label: "Marriage Certificate" },
  { value: "Business Permit", label: "Business Permit" },
  { value: "Tax Identification Number (TIN)", label: "Tax Identification Number (TIN)" },
  { value: "Philhealth Card", label: "PhilHealth Card" },
  { value: "SSS Card", label: "SSS Card" },
  { value: "Driver's License", label: "Driver's License" },
  { value: "Voter ID", label: "Voter ID" },
  { value: "Barangay Clearance", label: "Barangay Clearance" },
  { value: "Community Tax Certificate (Cedula)", label: "Community Tax Certificate (Cedula)" },
  { value: "Postal ID", label: "Postal ID" },
  { value: "Student ID", label: "Student ID" },
  { value: "Senior Citizen ID", label: "Senior Citizen ID" },
];

const PackageInclusions = [
  {
    value: "1night accommodation in Sapa based on twin sharing",
    label: "1night accommodation in Sapa based on twin sharing"
  },
  {
    value: "2night accommodation in Hanoi based on twin sharing",
    label: "2night accommodation in Hanoi based on twin sharing"
  },
  {
    value: "Daily Breakfast",
    label: "Daily Breakfast"
  },
  {
    value: "Private Roundtrip Airport Transfer (Airport to Hotel; vv)",
    label: "Private Roundtrip Airport Transfer (Airport to Hotel; vv)"
  },
  {
    value: "Private tour",
    label: "Private tour"
  },
  {
    value: "Local English Tour Guide",
    label: "Local English Tour Guide"
  },
  {
    value: "Sightseeing and all entrance as per itinerary",
    label: "Sightseeing and all entrance as per itinerary"
  },
  {
    value: "Meals: Lunch and Dinner as per itinerary",
    label: "Meals: Lunch and Dinner as per itinerary"
  },
  {
    value: "Tipping",
    label: "Tipping"
  },
  {
    value: "Drinking water everyday",
    label: "Drinking water everyday"
  },
  {
    value: "Roundtrip Airfare via Cebu Pacific",
    label: "Roundtrip Airfare via Cebu Pacific"
  },
  {
    value: "1 pc (20kg) Baggage Allowance",
    label: "1 pc (20kg) Baggage Allowance"
  },
  {
    value: "PH Travel Tax",
    label: "PH Travel Tax"
  },
  {
    value: "Travel Insurance 1.5M Coverage with covid protection",
    label: "Travel Insurance 1.5M Coverage with covid protection"
  }
];

const PackageExclusions = [
  {
    value: "Domestic Flight (Cebu-Manila)",
    label: "Domestic Flight (Cebu-Manila)"
  },
  {
    value: "Personal Expenses (laundry, phone calls, kayak)",
    label: "Personal Expenses (laundry, phone calls, kayak)"
  },
  {
    value: "Drinks and Beverages",
    label: "Drinks and Beverages"
  },
  {
    value: "Others not mentioned above nor specified above",
    label: "Others not mentioned above nor specified above"
  },
];

const HotelCategories = ['5 Star', '4 Star', '3 Star', '2 Star'];

const Constants = {
  VersionNumber,
  AdminSidebarItems,
  EmployeeSidebarItems,
  ContainerVariants,
  NoTopbarPaths,
  ClientTypesMap,
  UserRedirectRoute,
  PermissionsCanDelete,
  PermissionsCanEdit,
  PermissionsCanApprove,
  GovernmentDepartments,
  CorporateDepartments,
  Disbursements,
  CommonDocuments,
  SupplierCategories,
  HotelCategories,
  PackageInclusions,
  PackageExclusions
}

export default Constants
