# 🚀 Development Handoff - Modern Minimalist POS

> **Complete technical specification for React/Electron implementation**

**Application:** Modern Minimalist POS System  
**Platform:** Electron Desktop (1920×1080)  
**Stack:** React + TypeScript + Tailwind CSS v4  
**Target:** Production-ready enterprise application  

---

## 📋 Table of Contents

1. [Route Map & Navigation](#route-map--navigation)
2. [Screen → Component Mapping](#screen--component-mapping)
3. [Naming Conventions](#naming-conventions)
4. [Folder Structure](#folder-structure)
5. [Theme Token Export](#theme-token-export)
6. [Component Usage Guide](#component-usage-guide)
7. [UI Event Flow Diagrams](#ui-event-flow-diagrams)
8. [Billing Flow Chart](#billing-flow-chart)
9. [Sync Center Flow](#sync-center-flow)
10. [Backend Integration Points](#backend-integration-points)
11. [State Management](#state-management)
12. [Data Models](#data-models)
13. [API Endpoints](#api-endpoints)
14. [Electron Integration](#electron-integration)

---

## 🗺️ Route Map & Navigation

### Application Routes

```typescript
// Route Configuration
const routes = {
  // Root
  '/': 'IndexPage',                        // Landing/Welcome
  
  // Main Dashboard
  '/dashboard': 'DashboardPage',            // Main dashboard with KPIs
  
  // Sales & Billing
  '/sales': 'SalesBillingPage',            // POS/Billing interface
  '/sales/hold-bills': 'HoldBillsPage',    // Held/parked bills
  '/sales/return': 'SalesReturnPage',      // Sales returns
  '/sales/receipt/:id': 'ReceiptPage',     // Print receipt
  
  // Inventory & Items
  '/items': 'ItemsListPage',               // Items list with search
  '/items/new': 'ItemFormPage',            // Add new item
  '/items/:id': 'ItemFormPage',            // Edit item
  '/items/categories': 'CategoriesPage',   // Manage categories
  '/items/batches': 'InventoryBatchesPage', // Batch management
  '/items/adjustment': 'StockAdjustmentPage', // Stock adjustment
  '/items/movement': 'StockMovementLogPage', // Stock movement log
  
  // Suppliers & Purchasing
  '/suppliers': 'SuppliersListPage',       // Suppliers list
  '/suppliers/:id/ledger': 'SupplierLedgerPage', // Supplier ledger
  '/grn/create': 'GRNCreatePage',          // Create GRN
  '/grn/approval': 'GRNApprovalPage',      // GRN approval queue
  
  // Customers
  '/customers': 'CustomersListPage',       // Customers list
  '/customers/:id': 'CustomerProfilePage', // Customer profile
  
  // Reports & Analytics
  '/reports': 'ReportsOverviewPage',       // Reports dashboard
  '/reports/daily-summary': 'DailySummaryPage', // Daily summary
  '/reports/profit-loss': 'ProfitLossPage', // P&L statement
  '/reports/cash-book': 'DailyCashBookPage', // Cash book
  '/reports/expenses': 'ExpenseEntryPage',  // Expense entry
  
  // HR & Operations
  '/attendance': 'EmployeeAttendancePage', // Employee attendance
  
  // Administration
  '/users': 'UserManagementPage',          // User management
  '/settings': 'SettingsPage',             // App settings
  '/sync': 'SyncCenterPage',               // Sync management
  
  // Utilities
  '/components': 'ComponentLibraryPage',   // Component library (dev)
  '/demo': 'DashboardDemo',                // Demo page (dev)
};
```

### Navigation Hierarchy

```
AppShell
├── Sidebar (240px fixed left)
│   ├── Logo/Branding
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Sales & Billing
│   │   │   ├── New Sale
│   │   │   ├── Hold Bills
│   │   │   └── Sales Return
│   │   ├── Items & Inventory
│   │   │   ├── Items List
│   │   │   ├── Categories
│   │   │   ├── Stock Adjustment
│   │   │   ├── Batches
│   │   │   └── Stock Movement
│   │   ├── Suppliers & GRN
│   │   │   ├── Suppliers
│   │   │   ├── Supplier Ledger
│   │   │   ├── Create GRN
│   │   │   └── GRN Approval
│   │   ├── Customers
│   │   │   ├── Customers List
│   │   │   └── Customer Profile
│   │   ├── Reports & Analytics
│   │   │   ├── Reports Overview
│   │   │   ├── Daily Summary
│   │   │   ├── Profit & Loss
│   │   │   ├── Daily Cash Book
│   │   │   └── Expenses
│   │   ├── Operations
│   │   │   └── Employee Attendance
│   │   ├── User Management
│   │   ├── Settings
│   │   └── Sync Status
│   └── User Profile (bottom)
│
├── Topbar (64px fixed top)
│   ├── Page Title (dynamic)
│   ├── Search (global)
│   ├── Notifications
│   ├── Theme Toggle
│   └── User Menu
│
└── Main Content Area
    └── Dynamic Page Component
```

### Route Implementation (React Router)

```typescript
// App.tsx - Route Setup
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Root */}
          <Route path="/" element={<IndexPage />} />
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Sales */}
          <Route path="/sales" element={<SalesBillingPage />} />
          <Route path="/sales/hold-bills" element={<HoldBillsPage />} />
          <Route path="/sales/return" element={<SalesReturnPage />} />
          <Route path="/sales/receipt/:id" element={<ReceiptPage />} />
          
          {/* Items */}
          <Route path="/items" element={<ItemsListPage />} />
          <Route path="/items/new" element={<ItemFormPage />} />
          <Route path="/items/:id" element={<ItemFormPage />} />
          <Route path="/items/categories" element={<CategoriesPage />} />
          <Route path="/items/batches" element={<InventoryBatchesPage />} />
          <Route path="/items/adjustment" element={<StockAdjustmentPage />} />
          <Route path="/items/movement" element={<StockMovementLogPage />} />
          
          {/* Suppliers */}
          <Route path="/suppliers" element={<SuppliersListPage />} />
          <Route path="/suppliers/:id/ledger" element={<SupplierLedgerPage />} />
          <Route path="/grn/create" element={<GRNCreatePage />} />
          <Route path="/grn/approval" element={<GRNApprovalPage />} />
          
          {/* Customers */}
          <Route path="/customers" element={<CustomersListPage />} />
          <Route path="/customers/:id" element={<CustomerProfilePage />} />
          
          {/* Reports */}
          <Route path="/reports" element={<ReportsOverviewPage />} />
          <Route path="/reports/daily-summary" element={<DailySummaryPage />} />
          <Route path="/reports/profit-loss" element={<ProfitLossPage />} />
          <Route path="/reports/cash-book" element={<DailyCashBookPage />} />
          <Route path="/reports/expenses" element={<ExpenseEntryPage />} />
          
          {/* Operations */}
          <Route path="/attendance" element={<EmployeeAttendancePage />} />
          
          {/* Admin */}
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sync" element={<SyncCenterPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
```

---

## 🎯 Screen → Component Mapping

### Complete Page Mapping

| Route | Page Component | Key Child Components | Data Dependencies |
|-------|---------------|---------------------|-------------------|
| `/` | `IndexPage` | Welcome screen | None |
| `/dashboard` | `DashboardPage` | KPICard, Charts, RecentSales | Dashboard stats, sales data, charts |
| `/sales` | `SalesBillingPage` | ItemSearch, CartTable, PaymentModal | Items, customers, payments |
| `/sales/hold-bills` | `HoldBillsPage` | DataTable, Badge | Held bills list |
| `/sales/return` | `SalesReturnPage` | SearchInvoice, ReturnItems, RefundModal | Invoices, return reasons |
| `/items` | `ItemsListPage` | PageFilters, DataTable, ItemDialog | Items, categories |
| `/items/categories` | `CategoriesPage` | CategoryTree, CategoryDialog | Categories |
| `/items/batches` | `InventoryBatchesPage` | BatchTable, ExpiryAlerts | Batches, stock |
| `/items/adjustment` | `StockAdjustmentPage` | AdjustmentForm, ReasonSelect | Items, reasons |
| `/items/movement` | `StockMovementLogPage` | MovementTable, Filters | Movement logs |
| `/suppliers` | `SuppliersListPage` | SupplierTable, SupplierDialog | Suppliers |
| `/suppliers/:id/ledger` | `SupplierLedgerPage` | LedgerTable, BalanceSummary | Transactions, payments |
| `/grn/create` | `GRNCreatePage` | POSelect, GRNItems, SaveGRN | POs, items, suppliers |
| `/grn/approval` | `GRNApprovalPage` | PendingGRNs, ApprovalDialog | GRNs, approvals |
| `/customers` | `CustomersListPage` | CustomerTable, CustomerDialog | Customers |
| `/customers/:id` | `CustomerProfilePage` | ProfileCard, PurchaseHistory | Customer, transactions |
| `/reports` | `ReportsOverviewPage` | ReportCards, QuickStats | Report metadata |
| `/reports/daily-summary` | `DailySummaryPage` | DailyKPIs, TransactionTable | Daily data |
| `/reports/profit-loss` | `ProfitLossPage` | PLTable, Charts | Financial data |
| `/reports/cash-book` | `DailyCashBookPage` | CashInOut, Balance | Cash transactions |
| `/reports/expenses` | `ExpenseEntryPage` | ExpenseForm, ExpenseList | Expenses, categories |
| `/attendance` | `EmployeeAttendancePage` | AttendanceGrid, CheckInOut | Employees, attendance |
| `/users` | `UserManagementPage` | UserTable, RoleManager | Users, roles |
| `/settings` | `SettingsPage` | SettingsPanels, ThemeToggle | Settings |
| `/sync` | `SyncCenterPage` | SyncStatus, SyncHistory | Sync logs |

### Component Breakdown by Page

#### DashboardPage
```tsx
<DashboardPage>
  ├── PageHeader (title, actions)
  ├── KPI Grid (4 columns)
  │   ├── KPICard (Total Sales)
  │   ├── KPICard (Today's Sales)
  │   ├── KPICard (Profit Margin)
  │   └── KPICard (Low Stock Items)
  ├── Charts Section (2 columns)
  │   ├── Card (Sales Trend - LineChart)
  │   └── Card (Top Categories - BarChart)
  └── Recent Activity
      ├── Card (Recent Sales - Table)
      └── Card (Top Items - Table)
</DashboardPage>
```

#### SalesBillingPage
```tsx
<SalesBillingPage>
  ├── Split Layout (60/40)
  │   ├── Left Panel (60%)
  │   │   ├── Item Search Bar
  │   │   ├── Cart Table
  │   │   │   ├── Item rows (editable qty, price)
  │   │   │   └── Totals section
  │   │   └── Cart Actions
  │   │       ├── Clear Cart
  │   │       ├── Hold Bill
  │   │       └── Apply Discount
  │   │
  │   └── Right Panel (40%)
  │       ├── Customer Selection
  │       ├── Invoice Summary
  │       │   ├── Subtotal
  │       │   ├── Tax/GST
  │       │   ├── Discount
  │       │   └── Total
  │       └── Payment Actions
  │           ├── Quick Pay (Cash)
  │           ├── Card Payment
  │           ├── UPI Payment
  │           └── Credit/Pay Later
  │
  └── Modals
      ├── PaymentModal
      ├── CustomerSelectModal
      ├── HoldBillModal
      └── DiscountModal
</SalesBillingPage>
```

#### ItemsListPage
```tsx
<ItemsListPage>
  ├── PageHeader
  │   ├── Title: "Items & Inventory"
  │   └── Actions
  │       ├── Export Button
  │       └── Add Item Button
  ├── KPI Cards (4 columns)
  │   ├── Total Items
  │   ├── Total Value
  │   ├── Low Stock
  │   └── Categories
  ├── PageFilters
  │   ├── Category Select
  │   ├── Status Select
  │   ├── Stock Level Filter
  │   └── Search Input
  └── DataTable
      ├── Columns: ID, Name, Category, Stock, Price, Status
      ├── Actions: Edit, Delete
      └── Pagination
</ItemsListPage>
```

---

## 📝 Naming Conventions

### File Naming

```typescript
// Pages (PascalCase + Page suffix)
DashboardPage.tsx
SalesBillingPage.tsx
ItemsListPage.tsx

// Components (PascalCase)
PageHeader.tsx
KPICard.tsx
DataTable.tsx

// UI Components (kebab-case)
button.tsx
input.tsx
data-table.tsx

// Hooks (camelCase with 'use' prefix)
useAuth.ts
useCart.ts
useSync.ts

// Utils (camelCase)
formatCurrency.ts
dateHelpers.ts
validators.ts

// Types (PascalCase with Type/Interface)
interface User { }
type CartItem = { }
```

### Component Naming

```typescript
// Page Components
export const DashboardPage: React.FC = () => { }

// Layout Components
export const AppShell: React.FC = () => { }
export const Sidebar: React.FC = () => { }

// Feature Components
export const ItemSearch: React.FC = () => { }
export const CartTable: React.FC = () => { }

// UI Components
export const Button: React.FC<ButtonProps> = () => { }
export const Input: React.FC<InputProps> = () => { }
```

### Variable Naming

```typescript
// State variables (camelCase)
const [items, setItems] = useState<Item[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

// Constants (UPPER_SNAKE_CASE)
const API_BASE_URL = 'http://localhost:3000';
const MAX_CART_ITEMS = 100;
const DEFAULT_TAX_RATE = 0.18;

// Functions (camelCase, verb prefix)
const handleAddToCart = () => { };
const fetchItems = async () => { };
const calculateTotal = () => { };
const validateForm = () => { };

// Event handlers (handle + Event)
const handleClick = () => { };
const handleSubmit = () => { };
const handleChange = () => { };
```

### CSS/Tailwind Class Naming

```typescript
// Use Tailwind utilities (no custom classes unless necessary)
<div className="flex items-center justify-between gap-4">

// If custom classes needed (kebab-case)
.custom-scrollbar { }
.billing-layout { }
```

---

## 📁 Folder Structure

### Current Structure (Optimized)

```
src/
├── App.tsx                          # Main app component with routing
├── main.tsx                         # Entry point
│
├── components/                      # All React components
│   │
│   ├── layout/                     # Layout components
│   │   ├── AppShell.tsx           # Main app wrapper
│   │   ├── Sidebar.tsx            # Left sidebar navigation
│   │   ├── Topbar.tsx             # Top navigation bar
│   │   ├── PageHeader.tsx         # Standardized page headers
│   │   └── EmptyContentState.tsx  # Empty state component
│   │
│   ├── pages/                      # Page components (one per route)
│   │   ├── DashboardPage.tsx
│   │   ├── SalesBillingPage.tsx
│   │   ├── ItemsListPage.tsx
│   │   ├── CustomersListPage.tsx
│   │   ├── ... (30+ pages)
│   │   └── ComponentLibraryPage.tsx
│   │
│   ├── ui/                         # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── kpi-card.tsx           # Custom KPI component
│   │   ├── page-filters.tsx       # Custom filters component
│   │   ├── data-table.tsx         # Custom table component
│   │   └── ... (50+ components)
│   │
│   ├── templates/                  # Page templates
│   │   └── PageTemplate.tsx       # Base page layout
│   │
│   ├── design-system/             # Design system showcase
│   │   ├── ColorPalette.tsx
│   │   ├── Typography.tsx
│   │   ├── ButtonShowcase.tsx
│   │   └── ... (8 files)
│   │
│   └── figma/                     # Figma-specific utilities
│       └── ImageWithFallback.tsx
│
├── lib/                            # Utilities and helpers
│   ├── utils.ts                   # General utilities
│   ├── cn.ts                      # Class name helper
│   └── formatters.ts              # Data formatters
│
├── hooks/                          # Custom React hooks
│   ├── useAuth.ts                 # Authentication hook
│   ├── useCart.ts                 # Cart management
│   ├── useSync.ts                 # Sync operations
│   ├── useTheme.ts                # Theme management
│   └── useLocalStorage.ts         # Local storage hook
│
├── contexts/                       # React contexts
│   ├── AuthContext.tsx            # Auth state
│   ├── CartContext.tsx            # Cart state
│   ├── ThemeContext.tsx           # Theme state
│   └── SyncContext.tsx            # Sync state
│
├── types/                          # TypeScript types
│   ├── index.ts                   # Main types export
│   ├── models.ts                  # Data models
│   ├── api.ts                     # API types
│   └── common.ts                  # Common types
│
├── services/                       # API services
│   ├── api.ts                     # Base API client
│   ├── items.service.ts           # Items API
│   ├── sales.service.ts           # Sales API
│   ├── customers.service.ts       # Customers API
│   ├── suppliers.service.ts       # Suppliers API
│   ├── reports.service.ts         # Reports API
│   └── sync.service.ts            # Sync API
│
├── store/                          # State management (if using Redux/Zustand)
│   ├── index.ts
│   ├── slices/
│   │   ├── auth.slice.ts
│   │   ├── cart.slice.ts
│   │   └── items.slice.ts
│   └── hooks.ts
│
├── constants/                      # Application constants
│   ├── routes.ts                  # Route definitions
│   ├── config.ts                  # App configuration
│   └── enums.ts                   # Enums
│
├── styles/                         # Styles
│   └── globals.css                # Global styles + design tokens
│
├── assets/                         # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── electron/                       # Electron-specific code
    ├── main.ts                    # Electron main process
    ├── preload.ts                 # Preload script
    ├── ipc/                       # IPC handlers
    │   ├── printer.ts             # Receipt printing
    │   ├── database.ts            # Local database
    │   └── sync.ts                # Sync operations
    └── menu.ts                    # Application menu
```

### Recommended Additional Structure

```
src/
├── features/                       # Feature-based organization (alternative)
│   ├── billing/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── inventory/
│   ├── reports/
│   └── sync/
│
├── utils/                          # Utility functions
│   ├── currency.ts                # Currency formatting
│   ├── date.ts                    # Date utilities
│   ├── validators.ts              # Form validation
│   └── exporters.ts               # Export to Excel/PDF
│
└── config/                         # Configuration files
    ├── theme.config.ts
    ├── api.config.ts
    └── electron.config.ts
```

---

## 🎨 Theme Token Export

### Design Tokens Table

#### Spacing Tokens (8pt Grid)

| Token | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| `--spacing-0` | 0 | 0px | No spacing |
| `--spacing-1` | 0.25rem | 4px | Micro adjustments |
| `--spacing-2` | 0.5rem | 8px | Tight spacing, icons gap |
| `--spacing-3` | 0.75rem | 12px | Compact spacing |
| `--spacing-4` | 1rem | 16px | Default gap, form fields |
| `--spacing-5` | 1.25rem | 20px | Medium spacing |
| `--spacing-6` | 1.5rem | 24px | **Section gaps (primary)** |
| `--spacing-8` | 2rem | 32px | Large gaps |
| `--spacing-10` | 2.5rem | 40px | Extra large |
| `--spacing-12` | 3rem | 48px | Icon containers |
| `--spacing-14` | 3.5rem | 56px | Very large |
| `--spacing-16` | 4rem | 64px | Page sections |
| `--spacing-20` | 5rem | 80px | Massive gaps |
| `--spacing-24` | 6rem | 96px | Hero sections |

#### Typography Tokens

| Token | Value | Pixels | Weight | Use Case |
|-------|-------|--------|--------|----------|
| `--text-display-l` | 2.5rem | 40px | Bold | Large page titles |
| `--text-display-m` | 2rem | 32px | Bold | Medium page titles |
| `--text-display-s` | 1.5rem | **24px** | Bold | **Standard page titles** |
| `--text-headline-xl` | 2.25rem | 36px | Semibold | Hero headlines |
| `--text-headline-l` | 1.875rem | 30px | Bold | **KPI values** |
| `--text-headline-m` | 1.5rem | 24px | Semibold | Section headers |
| `--text-subtitle-m` | 1.125rem | 18px | Medium | Large labels |
| `--text-subtitle-s` | 1rem | 16px | Semibold | Card titles |
| `--text-body-l` | 1rem | 16px | Regular | Large body text |
| `--text-body-m` | 0.875rem | **14px** | Regular | **Default body text** |
| `--text-body-s` | 0.8125rem | 13px | Regular | Small body text |
| `--text-caption` | 0.75rem | 12px | Regular | Metadata, hints |
| `--text-overline` | 0.6875rem | 11px | Medium | Overlines |

#### Icon Sizes

| Token | Value | Pixels | Tailwind | Use Case |
|-------|-------|--------|----------|----------|
| `--icon-xs` | 0.75rem | 12px | `h-3 w-3` | Tiny icons |
| `--icon-sm` | 1rem | **16px** | `h-4 w-4` | **Buttons, inline** |
| `--icon-md` | 1.25rem | 20px | `h-5 w-5` | Sidebar, default |
| `--icon-lg` | 1.5rem | **24px** | `h-6 w-6` | **KPI cards** |
| `--icon-xl` | 2rem | 32px | `h-8 w-8` | Empty states |
| `--icon-2xl` | 2.5rem | 40px | `h-10 w-10` | Hero icons |

#### Color Tokens (Light Mode)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-primary` | #0d9488 | Primary actions, links |
| `--color-primary-foreground` | #ffffff | Text on primary |
| `--color-primary-hover` | #0f766e | Hover state |
| `--color-secondary` | #f5f5f5 | Secondary buttons |
| `--color-secondary-foreground` | #0a0a0a | Text on secondary |
| `--color-foreground` | #0a0a0a | Primary text |
| `--color-background` | #ffffff | Page background |
| `--color-muted` | #f5f5f5 | Muted backgrounds |
| `--color-muted-foreground` | #737373 | Secondary text |
| `--color-border` | #e5e5e5 | Default borders |
| `--color-border-strong` | #d4d4d4 | Strong borders |
| `--color-card` | #ffffff | Card background |
| `--color-card-border` | #e5e5e5 | Card borders |

#### Semantic Colors (Fixed, not theme-dependent)

| Token | Hex Value | Usage |
|-------|-----------|-------|
| Success | `#10b981` | Success states, positive trends |
| Warning | `#f59e0b` | Warnings, attention needed |
| Danger | `#ef4444` | Errors, negative trends |
| Info | `#3b82f6` | Informational messages |

#### Border Radius

| Token | Value | Pixels | Use Case |
|-------|-------|--------|----------|
| `--radius-none` | 0 | 0px | Sharp corners |
| `--radius-sm` | 0.25rem | 4px | Small elements |
| `--radius-md` | 0.5rem | **8px** | **Buttons, inputs** |
| `--radius-lg` | 0.75rem | **12px** | **Cards, modals** |
| `--radius-xl` | 1rem | 16px | Large cards |
| `--radius-2xl` | 1.5rem | 24px | Hero elements |
| `--radius-full` | 9999px | Full | Avatars, pills |

#### Component-Specific Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--page-padding` | 1.5rem (24px) | Page content padding |
| `--section-gap` | 1.5rem (24px) | Gap between page sections |
| `--card-padding` | 1.5rem (24px) | Card internal padding |
| `--table-padding-y` | 0.75rem (12px) | Table cell vertical padding |
| `--table-padding-x` | 1rem (16px) | Table cell horizontal padding |

### Tailwind Class Reference

```typescript
// Spacing
'space-y-6'   // 24px vertical spacing (most common)
'gap-6'       // 24px grid gap (KPI cards)
'gap-4'       // 16px grid gap (filters, forms)
'p-6'         // 24px padding (cards)
'space-y-2'   // 8px spacing (label to input)

// Typography
'text-foreground'           // Primary text color
'text-muted-foreground'     // Secondary text color
'text-primary'              // Primary brand color
'text-[#10b981]'           // Success green (use hex for semantic)
'text-[#ef4444]'           // Danger red

// Layout
'flex items-center justify-between'
'grid grid-cols-4 gap-6'
'flex-1'
'w-full'

// Borders
'border'                    // Default border
'border-border'             // Theme-aware border color
'rounded-lg'                // 12px border radius

// Backgrounds
'bg-background'             // Page background
'bg-card'                   // Card background
'bg-muted'                  // Muted background
'bg-primary'                // Primary color background
```

### CSS Export for Developers

```css
/* Copy this to your globals.css */
:root {
  /* Spacing - 8pt Grid */
  --spacing-2: 0.5rem;      /* 8px - Base unit */
  --spacing-4: 1rem;        /* 16px */
  --spacing-6: 1.5rem;      /* 24px - Primary section gap */
  --spacing-8: 2rem;        /* 32px */
  --spacing-12: 3rem;       /* 48px */
  
  /* Typography */
  --text-display-s: 1.5rem;   /* 24px - Page titles */
  --text-headline-l: 1.875rem; /* 30px - KPI values */
  --text-body-m: 0.875rem;    /* 14px - Body text */
  --text-caption: 0.75rem;    /* 12px - Metadata */
  
  /* Icons */
  --icon-sm: 1rem;           /* 16px - Buttons */
  --icon-md: 1.25rem;        /* 20px - Sidebar */
  --icon-lg: 1.5rem;         /* 24px - KPI cards */
  
  /* Colors */
  --color-primary: #0d9488;
  --color-foreground: #0a0a0a;
  --color-muted-foreground: #737373;
  --color-background: #ffffff;
  --color-border: #e5e5e5;
  
  /* Semantic (fixed) */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;
  
  /* Component */
  --page-padding: 1.5rem;
  --section-gap: 1.5rem;
  --card-padding: 1.5rem;
}
```

---

## 📦 Component Usage Guide

### Core Layout Components

#### AppShell

```typescript
// Main application shell with sidebar and topbar
import { AppShell } from '@/components/layout/AppShell';

function App() {
  return (
    <AppShell>
      {/* Your page content */}
    </AppShell>
  );
}

// AppShell provides:
// - Fixed sidebar (240px left)
// - Fixed topbar (64px top)
// - Theme management
// - Navigation context
// - User session
```

#### PageHeader

```typescript
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

<PageHeader
  title="Dashboard"
  description="Overview of your business performance"
  actions={
    <>
      <Button variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Add New
      </Button>
    </>
  }
/>

// Props:
// - title: string (required)
// - description?: string
// - actions?: ReactNode
// - breadcrumb?: ReactNode
```

### Custom Components

#### KPICard

```typescript
import { KPICard } from '@/components/ui/kpi-card';
import { DollarSign } from 'lucide-react';

<KPICard
  label="Total Revenue"
  value="₹45,230"
  icon={DollarSign}
  iconColor="var(--color-primary)"
  iconBgColor="var(--color-primary)"
  trend={{
    value: "+12.5%",
    direction: "up",  // 'up' | 'down' | 'neutral'
    color: "#10b981"
  }}
  subtitle="vs last month"  // Alternative to trend
/>

// Props:
// - label: string
// - value: string | number
// - subtitle?: string
// - icon?: LucideIcon
// - iconColor?: string
// - iconBgColor?: string
// - trend?: { value: string, direction?: 'up'|'down'|'neutral', color?: string }
```

#### PageFilters

```typescript
import { PageFilters, FilterField } from '@/components/ui/page-filters';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

<PageFilters>
  <FilterField>
    <Label>Category</Label>
    <Select value={category} onValueChange={setCategory}>
      <SelectTrigger>
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        <SelectItem value="electronics">Electronics</SelectItem>
      </SelectContent>
    </Select>
  </FilterField>
  
  <FilterField span={2}>  {/* Spans 2 columns */}
    <Label>Search</Label>
    <Input placeholder="Search items..." />
  </FilterField>
</PageFilters>

// PageFilters: 4-column grid with 16px gaps
// FilterField props:
// - span?: 1 | 2 | 3 | 4 (default: 1)
```

#### DataTable

```typescript
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

<DataTable
  title="Items List"
  description="All inventory items"
  headerActions={
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Add Item
    </Button>
  }
  columns={[
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Item Name' },
    { 
      key: 'quantity', 
      label: 'Quantity', 
      align: 'right'  // 'left' | 'right' | 'center'
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => handleEdit(row.id)}>
          Edit
        </Button>
      )
    }
  ]}
  data={items}
  pagination={{
    currentPage: page,
    totalPages: Math.ceil(total / pageSize),
    totalItems: total,
    itemsPerPage: pageSize,
    onPageChange: setPage
  }}
  emptyState={
    <div className="text-center py-12">
      <p className="text-muted-foreground">No items found</p>
    </div>
  }
/>

// Props:
// - title?: string
// - description?: string
// - headerActions?: ReactNode
// - columns: Column[] (required)
// - data: any[] (required)
// - pagination?: PaginationConfig
// - emptyState?: ReactNode
```

### UI Components (shadcn)

#### Button

```typescript
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">  {/* Square button for icons */}
  <Settings className="h-4 w-4" />
</Button>

// With icons
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>
```

#### Input

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email"
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

#### Select

```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="electronics">Electronics</SelectItem>
    <SelectItem value="groceries">Groceries</SelectItem>
    <SelectItem value="beverages">Beverages</SelectItem>
  </SelectContent>
</Select>
```

#### Dialog (Modal)

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogDescription>
        Enter the details of the new inventory item
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {/* Form content */}
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        Save
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Card

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Sales Summary</CardTitle>
    <CardDescription>Last 7 days performance</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    {/* Optional footer */}
  </CardFooter>
</Card>
```

#### Table

```typescript
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';

<div className="border rounded-lg">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead className="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.id}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell className="text-right">₹{item.amount}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

#### Badge

```typescript
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="outline">Draft</Badge>
```

#### Toast Notifications

```typescript
import { toast } from 'sonner@2.0.3';

// Success
toast.success('Item Added', {
  description: 'The item has been added successfully.'
});

// Error
toast.error('Error', {
  description: 'Failed to save item. Please try again.'
});

// Info
toast('Sync Started', {
  description: 'Syncing with server...'
});

// With action
toast('Item Updated', {
  action: {
    label: 'Undo',
    onClick: () => handleUndo()
  }
});
```

---

## 🔄 UI Event Flow Diagrams

### 1. Application Initialization Flow

```
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION START                                            │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Electron Main Process │
        │ - Create Window       │
        │ - Load React App      │
        └───────────┬───────────┘
                    │
                    ▼
           ┌────────────────┐
           │ React App Init │
           └────────┬───────┘
                    │
                    ├─────────────┐
                    │             │
                    ▼             ▼
        ┌────────────────┐   ┌──────────────┐
        │ Check Auth     │   │ Load Theme   │
        │ - Token valid? │   │ - Light/Dark │
        └────┬───────────┘   └──────────────┘
             │
        ┌────┴─────┐
        │          │
        ▼          ▼
    ┌─────┐   ┌────────┐
    │ Yes │   │ No     │
    └──┬──┘   └───┬────┘
       │          │
       │          ▼
       │     ┌────────────┐
       │     │ Show Login │
       │     └──────┬─────┘
       │            │
       │            ▼
       │     ┌──────────────┐
       │     │ Authenticate │
       │     └──────┬───────┘
       │            │
       └────────────┴────────┐
                             │
                             ▼
                  ┌──────────────────┐
                  │ Initialize App   │
                  │ - Load User Data │
                  │ - Setup Contexts │
                  │ - Init Sync      │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Render AppShell  │
                  │ - Sidebar        │
                  │ - Topbar         │
                  │ - Main Content   │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Navigate to      │
                  │ Dashboard        │
                  └──────────────────┘
```

### 2. Navigation Flow

```
┌──────────────────────────────────────────────────────────────┐
│ USER NAVIGATION                                               │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ User Clicks Menu Item │
        └───────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ React Router       │
           │ - Match route      │
           │ - Load component   │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Component Mount    │
           │ - useEffect hooks  │
           │ - Fetch data       │
           └────────┬───────────┘
                    │
                    ├─────────────┐
                    │             │
                    ▼             ▼
        ┌────────────────┐   ┌──────────────┐
        │ Show Loading   │   │ API Request  │
        │ State          │   │ - GET data   │
        └────────────────┘   └──────┬───────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │ Success?        │
                           └────┬───────┬────┘
                                │       │
                            Yes │       │ No
                                │       │
                                ▼       ▼
                    ┌──────────────┐  ┌──────────┐
                    │ Render Data  │  │ Show     │
                    │ - Tables     │  │ Error    │
                    │ - Charts     │  └──────────┘
                    │ - Cards      │
                    └──────────────┘
```

### 3. Form Submission Flow

```
┌──────────────────────────────────────────────────────────────┐
│ FORM SUBMISSION (Add/Edit Item Example)                      │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ User Fills Form       │
        │ - Item Name           │
        │ - Category            │
        │ - Price, Stock        │
        └───────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ User Clicks Submit │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Client Validation  │
           │ - Required fields  │
           │ - Format check     │
           │ - Business rules   │
           └────────┬───────────┘
                    │
                    ├─────────────┐
                    │             │
                Valid│             │Invalid
                    │             │
                    ▼             ▼
        ┌────────────────┐   ┌──────────────┐
        │ Disable Button │   │ Show Errors  │
        │ Show Loading   │   │ - Highlight  │
        └────────┬───────┘   │   fields     │
                 │            └──────────────┘
                 ▼
        ┌────────────────┐
        │ API Request    │
        │ POST/PUT data  │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Response?      │
        └────┬──────┬────┘
             │      │
         Success    Error
             │      │
             ▼      ▼
    ┌─────────────┐ ┌────────────┐
    │ Success!    │ │ Error      │
    │ - Toast     │ │ - Toast    │
    │ - Close     │ │ - Enable   │
    │   modal     │ │   button   │
    │ - Refresh   │ │ - Show     │
    │   list      │ │   message  │
    └─────────────┘ └────────────┘
```

### 4. Data Fetching Pattern

```
┌──────────────────────────────────────────────────────────────┐
│ DATA FETCHING (List Pages)                                   │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Component Mount       │
        │ useEffect(() => {})   │
        └───────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Set Loading State  │
           │ setIsLoading(true) │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ API Service Call   │
           │ itemsService.      │
           │   getAll(filters)  │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Electron IPC       │
           │ (if local DB)      │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Backend API        │
           │ GET /api/items     │
           └────────┬───────────┘
                    │
                    ├─────────────┐
                    │             │
                Success          Error
                    │             │
                    ▼             ▼
        ┌────────────────┐   ┌──────────────┐
        │ Update State   │   │ Error State  │
        │ - setItems()   │   │ - setError() │
        │ - setTotal()   │   │ - Toast      │
        │ - setPagination│   └──────────────┘
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Set Loading    │
        │ setIsLoading   │
        │ (false)        │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ Render UI      │
        │ - DataTable    │
        │ - KPI Cards    │
        └────────────────┘
```

### 5. Search/Filter Flow

```
┌──────────────────────────────────────────────────────────────┐
│ SEARCH & FILTER                                               │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ User Types/Selects    │
        │ - Search input        │
        │ - Filter dropdown     │
        └───────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Debounce (300ms)   │
           │ (for search only)  │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Update Filter      │
           │ State              │
           │ - setSearch()      │
           │ - setCategory()    │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ useEffect watches  │
           │ filter changes     │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Reset to Page 1    │
           │ setPage(1)         │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Fetch Data         │
           │ with new filters   │
           └────────┬───────────┘
                    │
                    ▼
           ┌────────────────────┐
           │ Update UI          │
           │ - Show results     │
           │ - Update count     │
           └────────────────────┘
```

---

## 💳 Billing Flow Chart

### Complete Sales/Billing Process

```
┌─────────────────────────────────────────────────────────────────┐
│ SALES & BILLING FLOW - Complete Transaction                     │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ USER NAVIGATES TO     │
            │ /sales (Billing Page) │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ INITIALIZE CART       │
            │ - Empty cart          │
            │ - Load held bills     │
            │ - Load item catalog   │
            └───────────┬───────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐           ┌───────────────────┐
│ SCAN BARCODE  │    OR     │ SEARCH ITEM       │
│ - Auto add    │           │ - Manual select   │
└───────┬───────┘           └────────┬──────────┘
        │                            │
        └──────────┬─────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ ITEM FOUND?          │
        └────┬───────────┬─────┘
             │           │
         Yes │           │ No
             │           │
             ▼           ▼
    ┌────────────┐  ┌──────────┐
    │ Add to     │  │ Show     │
    │ Cart       │  │ Error    │
    └─────┬──────┘  └──────────┘
          │
          ▼
    ┌──────────────────────┐
    │ CART ITEM ADDED      │
    │ - Update quantity    │
    │ - Calculate subtotal │
    │ - Check stock        │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ USER ACTIONS         │
    │ 1. Edit Qty/Price    │
    │ 2. Remove Item       │
    │ 3. Apply Discount    │
    │ 4. Hold Bill         │
    │ 5. Clear Cart        │
    │ 6. Proceed Payment   │
    └──────┬───────────────┘
           │
           ├─────────────────────────┐
           │                         │
           ▼                         ▼
    ┌─────────────┐         ┌────────────────┐
    │ HOLD BILL   │         │ PROCEED TO     │
    │ - Save cart │         │ PAYMENT        │
    │ - Clear UI  │         └────────┬───────┘
    └─────────────┘                  │
                                     ▼
                           ┌──────────────────┐
                           │ SELECT CUSTOMER  │
                           │ - Existing       │
                           │ - Walk-in        │
                           │ - New customer   │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ CALCULATE TOTAL  │
                           │ - Subtotal       │
                           │ - Tax/GST (18%)  │
                           │ - Discount       │
                           │ - Round-off      │
                           │ = GRAND TOTAL    │
                           └────────┬─────────┘
                                    │
                                    ▼
                           ┌──────────────────┐
                           │ PAYMENT METHOD   │
                           └────────┬─────────┘
                                    │
        ┌───────────────────────────┼───────────────────┐
        │                           │                   │
        ▼                           ▼                   ▼
┌───────────────┐          ┌────────────────┐  ┌──────────────┐
│ CASH          │          │ CARD/UPI       │  │ CREDIT       │
│ - Enter amt   │          │ - Process      │  │ - Add to     │
│ - Calculate   │          │   payment      │  │   ledger     │
│   change      │          │ - Get receipt  │  │ - Set due    │
└───────┬───────┘          └────────┬───────┘  │   date       │
        │                           │           └──────┬───────┘
        └───────────────┬───────────┘                  │
                        │                              │
                        ▼                              │
               ┌─────────────────┐                     │
               │ PAYMENT SUCCESS?│                     │
               └────┬──────┬─────┘                     │
                    │      │                           │
                Yes │      │ No                        │
                    │      │                           │
                    ▼      ▼                           │
          ┌─────────────┐ ┌──────────┐                │
          │ PROCESS!    │ │ Retry/   │                │
          └──────┬──────┘ │ Cancel   │                │
                 │        └──────────┘                │
                 │                                     │
                 └─────────────┬───────────────────────┘
                               │
                               ▼
                      ┌────────────────────┐
                      │ SAVE TRANSACTION   │
                      │ - Generate invoice │
                      │ - Update stock     │
                      │ - Update ledger    │
                      │ - Save payment     │
                      └────────┬───────────┘
                               │
                               ▼
                      ┌────────────────────┐
                      │ PRINT RECEIPT?     │
                      └────┬───────────────┘
                           │
                      ┌────┴────┐
                      │         │
                  Yes │         │ No
                      │         │
                      ▼         ▼
              ┌───────────┐ ┌──────────┐
              │ PRINT     │ │ Email/   │
              │ - Thermal │ │ SMS      │
              │ - A4      │ │ Receipt  │
              └─────┬─────┘ └────┬─────┘
                    │            │
                    └──────┬─────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ SUCCESS TOAST  │
                  │ - Show message │
                  │ - Clear cart   │
                  │ - Ready for    │
                  │   next sale    │
                  └────────────────┘
```

### Billing Page Component Structure

```
SalesBillingPage
├── Left Panel (60% width)
│   ├── Item Search/Scan
│   │   ├── Barcode Input (auto-focus)
│   │   └── Manual Search with Autocomplete
│   ├── Shopping Cart Table
│   │   ├── Headers: Item, Qty, Price, Discount, Total
│   │   ├── Editable Rows
│   │   │   ├── Quantity Stepper
│   │   │   ├── Price Override
│   │   │   └── Remove Button
│   │   └── Cart Totals
│   │       ├── Subtotal
│   │       ├── Tax/GST
│   │       ├── Discount
│   │       └── Grand Total (large, bold)
│   └── Cart Actions
│       ├── Clear Cart Button
│       ├── Hold Bill Button
│       └── Load Held Bill Button
│
├── Right Panel (40% width)
│   ├── Customer Section
│   │   ├── Customer Select/Search
│   │   └── Add New Customer (quick form)
│   ├── Invoice Summary Card
│   │   ├── Subtotal
│   │   ├── Tax Breakdown
│   │   ├── Discount Applied
│   │   ├── Round-off
│   │   └── Grand Total (large)
│   └── Payment Buttons (full width)
│       ├── Quick Pay - Cash (primary, large)
│       ├── Card Payment
│       ├── UPI Payment
│       └── Credit/Pay Later
│
└── Modals
    ├── Payment Modal
    │   ├── Payment Method Tabs
    │   │   ├── Cash Tab
    │   │   │   ├── Amount Received Input
    │   │   │   ├── Change Calculated
    │   │   │   └── Quick Denominations
    │   │   ├── Card/UPI Tab
    │   │   │   ├── Transaction ID
    │   │   │   └── Reference Number
    │   │   └── Credit Tab
    │   │       ├── Due Date Picker
    │   │       └── Notes
    │   └── Actions
    │       ├── Print Receipt Checkbox
    │       ├── Email Receipt Checkbox
    │       └── Complete Payment Button
    │
    ├── Hold Bill Modal
    │   ├── Bill Name/Reference
    │   ├── Notes
    │   └── Save Button
    │
    ├── Customer Select Modal
    │   ├── Search Customers
    │   ├── Customer List
    │   └── Add New Customer Form
    │
    └── Discount Modal
        ├── Discount Type (% or ₹)
        ├── Discount Value
        ├── Reason/Notes
        └── Apply Button
```

### Billing State Management

```typescript
// Cart State
interface CartState {
  items: CartItem[];
  customer: Customer | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

interface CartItem {
  id: string;
  itemId: string;
  name: string;
  barcode?: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discount: number;
  tax: number;
  total: number;
}

// Actions
- addToCart(item)
- updateQuantity(itemId, qty)
- updatePrice(itemId, price)
- removeItem(itemId)
- applyDiscount(type, value)
- setCustomer(customer)
- clearCart()
- holdBill(name, notes)
- loadHeldBill(billId)
```

---

## 🔄 Sync Center Flow

### Sync Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ SYNC CENTER - Multi-Device Synchronization                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ SYNC TRIGGER          │
            │ - Manual (button)     │
            │ - Auto (interval)     │
            │ - On reconnect        │
            └───────────┬───────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │ CHECK CONNECTIVITY    │
            │ - Internet available? │
            │ - Server reachable?   │
            └───────┬───────────────┘
                    │
                    ├─────────────┐
                    │             │
                Connected         Offline
                    │             │
                    ▼             ▼
        ┌────────────────┐   ┌──────────────┐
        │ PROCEED        │   │ QUEUE SYNC   │
        └────────┬───────┘   │ - Save for   │
                 │            │   later      │
                 │            │ - Show toast │
                 │            └──────────────┘
                 ▼
        ┌────────────────────┐
        │ GET LAST SYNC TIME │
        │ from local storage │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ IDENTIFY CHANGES   │
        │ - Modified records │
        │ - New records      │
        │ - Deleted records  │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ SYNC DIRECTION     │
        └────────┬───────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌───────────────┐  ┌──────────────┐
│ UPLOAD        │  │ DOWNLOAD     │
│ (Push)        │  │ (Pull)       │
└───────┬───────┘  └──────┬───────┘
        │                 │
        ▼                 ▼
┌───────────────┐  ┌──────────────┐
│ Send Changes  │  │ Get Changes  │
│ to Server     │  │ from Server  │
│ - Items       │  │ - Items      │
│ - Sales       │  │ - Customers  │
│ - Customers   │  │ - Settings   │
│ - Invoices    │  │ - Master data│
└───────┬───────┘  └──────┬───────┘
        │                 │
        └────────┬────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ CONFLICT DETECTION │
        │ - Same record      │
        │   modified on both │
        │   sides            │
        └────────┬───────────┘
                 │
            ┌────┴────┐
            │         │
         Yes│         │No
            │         │
            ▼         ▼
    ┌───────────┐  ┌──────────────┐
    │ RESOLVE   │  │ MERGE        │
    │ - Server  │  │ - Apply      │
    │   wins    │  │   changes    │
    │ - Client  │  │ - Update     │
    │   wins    │  │   local DB   │
    │ - Manual  │  └──────┬───────┘
    └─────┬─────┘         │
          │               │
          └───────┬───────┘
                  │
                  ▼
         ┌────────────────────┐
         │ UPDATE SYNC STATUS │
         │ - Last sync time   │
         │ - Synced records   │
         │ - Failed records   │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ SHOW RESULTS       │
         │ - Success toast    │
         │ - Update UI badge  │
         │ - Log activity     │
         └────────────────────┘
```

### Sync Center UI Components

```
SyncCenterPage
├── PageHeader
│   ├── Title: "Sync Center"
│   └── Actions
│       ├── Sync Now Button (primary)
│       └── Settings Button
│
├── Sync Status Card (large)
│   ├── Connection Status
│   │   ├── Online/Offline Indicator
│   │   └── Last Sync Time
│   ├── Sync Progress
│   │   ├── Progress Bar (if syncing)
│   │   └── Current Operation
│   └── Quick Stats
│       ├── Pending Uploads
│       ├── Last Success
│       └── Error Count
│
├── Sync Configuration
│   ├── Auto Sync Toggle
│   ├── Sync Interval Select
│   │   ├── 5 minutes
│   │   ├── 15 minutes
│   │   ├── 30 minutes
│   │   └── 1 hour
│   └── Sync on Startup Toggle
│
├── Sync Scope (Checkboxes)
│   ├── ☑ Items & Inventory
│   ├── ☑ Sales & Invoices
│   ├── ☑ Customers
│   ├── ☑ Suppliers
│   ├── ☑ Reports Data
│   └── ☑ Settings
│
├── Sync History Table
│   ├── Columns
│   │   ├── Timestamp
│   │   ├── Type (Auto/Manual)
│   │   ├── Status (Success/Failed/Partial)
│   │   ├── Records Synced
│   │   └── Duration
│   └── Filter/Search
│
└── Conflict Resolution Panel
    ├── Pending Conflicts Badge
    └── Conflict List (if any)
        ├── Record Details
        ├── Local Version
        ├── Server Version
        └── Resolution Actions
            ├── Keep Local
            ├── Use Server
            └── Merge
```

### Sync Data Models

```typescript
// Sync Status
interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  lastSyncSuccess: boolean;
  pendingUploads: number;
  pendingDownloads: number;
  errorCount: number;
  currentOperation?: string;
  progress?: number; // 0-100
}

// Sync Config
interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncOnStartup: boolean;
  scope: {
    items: boolean;
    sales: boolean;
    customers: boolean;
    suppliers: boolean;
    reports: boolean;
    settings: boolean;
  };
  conflictResolution: 'server-wins' | 'client-wins' | 'manual';
}

// Sync History Entry
interface SyncHistoryEntry {
  id: string;
  timestamp: Date;
  type: 'auto' | 'manual';
  status: 'success' | 'failed' | 'partial';
  recordsSynced: number;
  recordsFailed: number;
  duration: number; // seconds
  errors?: string[];
}

// Conflict
interface SyncConflict {
  id: string;
  entityType: string; // 'item', 'customer', etc.
  entityId: string;
  localVersion: any;
  serverVersion: any;
  modifiedAtLocal: Date;
  modifiedAtServer: Date;
  status: 'pending' | 'resolved';
  resolution?: 'local' | 'server' | 'merged';
}
```

### Sync Operations

```typescript
// Sync Service
class SyncService {
  // Start sync
  async startSync(): Promise<SyncResult> {
    try {
      // 1. Check connectivity
      if (!await this.checkConnectivity()) {
        throw new Error('No internet connection');
      }
      
      // 2. Get pending changes
      const changes = await this.getPendingChanges();
      
      // 3. Upload changes
      await this.uploadChanges(changes);
      
      // 4. Download updates
      const updates = await this.downloadUpdates();
      
      // 5. Detect conflicts
      const conflicts = await this.detectConflicts(updates);
      
      // 6. Resolve conflicts
      await this.resolveConflicts(conflicts);
      
      // 7. Apply updates
      await this.applyUpdates(updates);
      
      // 8. Update sync status
      await this.updateSyncStatus();
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
  
  // Get pending changes
  async getPendingChanges(): Promise<Change[]> {
    // Query local DB for records modified since last sync
  }
  
  // Upload changes
  async uploadChanges(changes: Change[]): Promise<void> {
    // POST to /api/sync/upload
  }
  
  // Download updates
  async downloadUpdates(): Promise<Update[]> {
    // GET from /api/sync/download?since=lastSyncTime
  }
  
  // Detect conflicts
  async detectConflicts(updates: Update[]): Promise<Conflict[]> {
    // Compare timestamps and versions
  }
  
  // Resolve conflicts
  async resolveConflicts(conflicts: Conflict[]): Promise<void> {
    // Apply resolution strategy
  }
}
```

---

## 🔌 Backend Integration Points

### API Base Configuration

```typescript
// config/api.config.ts
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Axios instance
import axios from 'axios';

export const apiClient = axios.create(API_CONFIG);

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints Reference

```typescript
// Authentication
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

// Items & Inventory
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
GET    /api/items/search?q=:query
POST   /api/items/bulk-import

GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id

GET    /api/batches
POST   /api/batches
PUT    /api/batches/:id

POST   /api/stock/adjustment
GET    /api/stock/movement-log

// Sales & Billing
POST   /api/sales/invoice
GET    /api/sales/invoices
GET    /api/sales/invoices/:id
PUT    /api/sales/invoices/:id/cancel
GET    /api/sales/hold-bills
POST   /api/sales/hold-bills
DELETE /api/sales/hold-bills/:id

POST   /api/sales/return
GET    /api/sales/returns

GET    /api/sales/receipt/:id

// Customers
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
GET    /api/customers/:id/transactions
GET    /api/customers/:id/ledger

// Suppliers
GET    /api/suppliers
GET    /api/suppliers/:id
POST   /api/suppliers
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
GET    /api/suppliers/:id/ledger

// GRN (Goods Receipt Note)
GET    /api/grn
GET    /api/grn/:id
POST   /api/grn
PUT    /api/grn/:id/approve
PUT    /api/grn/:id/reject

// Reports
GET    /api/reports/dashboard-stats
GET    /api/reports/daily-summary?date=:date
GET    /api/reports/profit-loss?from=:date&to=:date
GET    /api/reports/sales-by-category
GET    /api/reports/top-items
GET    /api/reports/cash-book?date=:date

// Expenses
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id

// Attendance
GET    /api/attendance?date=:date
POST   /api/attendance/check-in
POST   /api/attendance/check-out

// Users & Roles
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/roles

// Settings
GET    /api/settings
PUT    /api/settings

// Sync
POST   /api/sync/upload
GET    /api/sync/download?since=:timestamp
GET    /api/sync/status
POST   /api/sync/resolve-conflict
```

### Service Layer Example

```typescript
// services/items.service.ts
import { apiClient } from '@/config/api.config';
import { Item, ItemFilters, PaginatedResponse } from '@/types';

export class ItemsService {
  // Get all items with filters
  static async getAll(filters: ItemFilters): Promise<PaginatedResponse<Item>> {
    const response = await apiClient.get('/items', { params: filters });
    return response.data;
  }
  
  // Get single item
  static async getById(id: string): Promise<Item> {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  }
  
  // Create item
  static async create(data: Partial<Item>): Promise<Item> {
    const response = await apiClient.post('/items', data);
    return response.data;
  }
  
  // Update item
  static async update(id: string, data: Partial<Item>): Promise<Item> {
    const response = await apiClient.put(`/items/${id}`, data);
    return response.data;
  }
  
  // Delete item
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/items/${id}`);
  }
  
  // Search items
  static async search(query: string): Promise<Item[]> {
    const response = await apiClient.get('/items/search', { params: { q: query } });
    return response.data;
  }
}
```

---

## 📊 State Management

### Recommended Approach: Zustand

```typescript
// store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface CartStore {
  items: CartItem[];
  customer: Customer | null;
  discount: number;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setCustomer: (customer: Customer) => void;
  setDiscount: (discount: number) => void;
  clearCart: () => void;
  
  // Computed
  subtotal: () => number;
  tax: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customer: null,
      discount: 0,
      
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => 
          i.id === id 
            ? { ...i, quantity, total: i.price * quantity }
            : i
        )
      })),
      
      setCustomer: (customer) => set({ customer }),
      setDiscount: (discount) => set({ discount }),
      clearCart: () => set({ items: [], customer: null, discount: 0 }),
      
      subtotal: () => get().items.reduce((sum, item) => sum + item.total, 0),
      tax: () => get().subtotal() * 0.18, // 18% GST
      total: () => get().subtotal() + get().tax() - get().discount,
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

### Usage in Components

```typescript
// In SalesBillingPage
import { useCartStore } from '@/store/useCartStore';

export const SalesBillingPage = () => {
  const { items, addItem, total } = useCartStore();
  
  const handleAddItem = (item: Item) => {
    addItem({
      id: generateId(),
      itemId: item.id,
      name: item.name,
      quantity: 1,
      price: item.sellingPrice,
      total: item.sellingPrice,
    });
  };
  
  return (
    <div>
      {/* UI */}
      <p>Total: ₹{total()}</p>
    </div>
  );
};
```

---

## 💾 Data Models

### Core Entities

```typescript
// types/models.ts

// Item/Product
export interface Item {
  id: string;
  code: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: Category;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  taxRate: number;
  unit: 'pcs' | 'kg' | 'ltr' | 'box';
  stock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Category
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  isActive: boolean;
}

// Customer
export interface Customer {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  creditLimit: number;
  creditDays: number;
  balance: number;
  isActive: boolean;
  createdAt: Date;
}

// Supplier
export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  paymentTerms: string;
  balance: number;
  isActive: boolean;
}

// Invoice/Sale
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer?: Customer;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  status: 'paid' | 'partial' | 'unpaid' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdAt: Date;
}

export interface InvoiceItem {
  itemId: string;
  item?: Item;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

// GRN (Goods Receipt Note)
export interface GRN {
  id: string;
  grnNumber: string;
  supplierId: string;
  supplier?: Supplier;
  items: GRNItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  receivedDate: Date;
  approvedBy?: string;
  approvedAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface GRNItem {
  itemId: string;
  quantity: number;
  rate: number;
  total: number;
}

// User
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  permissions: string[];
  isActive: boolean;
}
```

---

## ⚡ Electron Integration

### Main Process Setup

```typescript
// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  
  // Load app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

// IPC Handlers
ipcMain.handle('print-receipt', async (event, data) => {
  // Print receipt logic
  return { success: true };
});

ipcMain.handle('get-local-data', async (event, query) => {
  // Query local SQLite database
  return data;
});
```

### Preload Script

```typescript
// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Printer
  printReceipt: (data: any) => ipcRenderer.invoke('print-receipt', data),
  
  // Database
  getLocalData: (query: string) => ipcRenderer.invoke('get-local-data', query),
  saveLocalData: (data: any) => ipcRenderer.invoke('save-local-data', data),
  
  // File system
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (path: string, data: any) => ipcRenderer.invoke('save-file', path, data),
});
```

### Using Electron APIs in React

```typescript
// types/electron.d.ts
interface ElectronAPI {
  printReceipt: (data: any) => Promise<{ success: boolean }>;
  getLocalData: (query: string) => Promise<any>;
  saveLocalData: (data: any) => Promise<void>;
  selectFile: () => Promise<string>;
  saveFile: (path: string, data: any) => Promise<void>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

// In component
const handlePrint = async () => {
  const result = await window.electron.printReceipt(invoiceData);
  if (result.success) {
    toast.success('Receipt printed successfully');
  }
};
```

---

## 🎯 Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Initialize Electron + React + Vite project
- [ ] Configure TypeScript
- [ ] Setup Tailwind CSS v4
- [ ] Install shadcn/ui components
- [ ] Setup folder structure
- [ ] Configure routing (React Router)
- [ ] Setup theme system (light/dark)

### Phase 2: Core Layout (Week 2)
- [ ] Implement AppShell
- [ ] Build Sidebar with navigation
- [ ] Build Topbar with search
- [ ] Implement theme toggle
- [ ] Setup PageHeader component
- [ ] Create KPICard component
- [ ] Create DataTable component
- [ ] Create PageFilters component

### Phase 3: Authentication (Week 2)
- [ ] Login page
- [ ] Auth context/store
- [ ] Token management
- [ ] Protected routes
- [ ] User permissions

### Phase 4: Main Features (Weeks 3-6)
- [ ] Dashboard page
- [ ] Sales/Billing page
- [ ] Items management
- [ ] Customers management
- [ ] Suppliers management
- [ ] GRN functionality
- [ ] Reports pages
- [ ] Settings page

### Phase 5: Advanced Features (Weeks 7-8)
- [ ] Sync center
- [ ] Receipt printing
- [ ] Excel/PDF export
- [ ] Barcode scanning
- [ ] Offline mode
- [ ] Data backup

### Phase 6: Polish (Week 9-10)
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Toast notifications
- [ ] Form validation
- [ ] Performance optimization
- [ ] Testing
- [ ] Documentation

---

## 📞 Support & Resources

### Documentation
- **Quick Reference:** `/QUICK_REFERENCE.md`
- **Optimization Guide:** `/OPTIMIZATION_GUIDE.md`
- **Component Library:** `/COMPONENT_LIBRARY.md`

### Example Code
- **Page Structure:** `/OPTIMIZATION_EXAMPLE.tsx`
- **Design System:** `/components/design-system/`

### External Resources
- [React Documentation](https://react.dev)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

---

**This document should be treated as the single source of truth for development.**

Last Updated: [Current Date]  
Version: 1.0  
Status: Ready for Development 🚀
