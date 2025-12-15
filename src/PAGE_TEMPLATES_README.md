# 02 – Page Templates

## Overview
Complete set of blank but structured page templates for the Modern Minimalist POS application. All pages follow consistent design patterns with 32px padding, breadcrumb navigation, and placeholder content.

## Template Structure

### Common Elements (All Pages)
- **Padding**: 32px (spacing-8) on all sides
- **Breadcrumb Navigation**: Shows hierarchical location
- **Page Header**: Title + subtitle + action buttons
- **Consistent Typography**: Uses design system tokens
- **Responsive Layout**: Grid-based layouts
- **Placeholder Content**: Tables, charts, forms with clear labels

### Page Template Component
Location: `/components/templates/PageTemplate.tsx`

Provides consistent structure:
```tsx
<PageTemplate
  breadcrumbs={[{ label: 'Section' }, { label: 'Page' }]}
  title="Page Title"
  subtitle="Page description"
  actions={<Button>Action</Button>}
>
  {/* Page content */}
</PageTemplate>
```

## Page Inventory

### 1. Overview Pages

#### Dashboard (`DashboardPage.tsx`)
- **Route**: `/dashboard`
- **Features**: 
  - 4 KPI cards (Sales, Orders, Customers, Pending Items)
  - 2 chart placeholders (Sales Trends, Top Products)
  - Recent transactions table
- **Actions**: Filter, Export

### 2. Sales Module

#### Sales & Billing (`SalesBillingPage.tsx`)
- **Route**: `/sales/billing`
- **Layout**: 2-column (Products: 2/3, Payment: 1/3)
- **Features**:
  - Product search and selection
  - Invoice items table
  - Customer selection
  - Payment summary
  - Payment method selection
- **Actions**: Hold Bill, Print Invoice, Complete Sale

#### Sales Return (`SalesReturnPage.tsx`)
- **Route**: `/sales/return`
- **Features**:
  - Invoice search
  - Invoice details display
  - Return items table with quantity selection
  - Refund summary
- **Actions**: Process Return

#### Hold Bills (`HoldBillsPage.tsx`)
- **Route**: `/sales/hold-bills`
- **Features**:
  - Saved bills table (Bill ID, Customer, Items, Amount, Status)
  - 3 summary cards (Total Bills, Total Amount, Oldest Bill)
  - Search functionality
- **Actions**: Resume, Delete bills

### 3. Inventory Module

#### Items List (`ItemsListPage.tsx`)
- **Route**: `/inventory/items`
- **Features**:
  - Search and filter bar
  - 4 stat cards (Total, In Stock, Low Stock, Out of Stock)
  - Items table (SKU, Name, Category, Stock, Price, Status)
- **Actions**: Add Item, Import, Export

#### Item Create/Edit Form (`ItemFormPage.tsx`)
- **Route**: `/inventory/items/new` or `/inventory/items/:id`
- **Layout**: 2-column form (Main: 2/3, Sidebar: 1/3)
- **Sections**:
  - Basic Information (Name, SKU, Description, Category)
  - Pricing (Purchase, Selling, MRP)
  - Tax & Discounts
  - Stock Information (Opening, Min, Max levels)
  - Image upload
  - Settings toggles
- **Actions**: Save, Cancel

#### Categories (`CategoriesPage.tsx`)
- **Route**: `/inventory/categories`
- **Features**:
  - 3 stat cards
  - Categories table (Name, Description, Product Count, Status)
- **Actions**: Add Category, Edit, Delete

#### Inventory Batches (`InventoryBatchesPage.tsx`)
- **Route**: `/inventory/batches`
- **Features**:
  - Search and filter
  - 4 stat cards (Total, Expiring Soon, Expired, Active)
  - Batches table (Batch No., Item, Qty, Mfg Date, Expiry, Status)
- **Actions**: Add Batch, Export

#### Stock Adjustment (`StockAdjustmentPage.tsx`)
- **Route**: `/inventory/adjustment`
- **Features**:
  - Adjustment header (Date, Reference, Type, Reason)
  - Items table (Current Stock, Adjustment Qty, New Stock)
  - Adjustment summary (Items, Added, Removed)
- **Actions**: Save Adjustment, View History

### 4. Suppliers Module

#### Suppliers List (`SuppliersListPage.tsx`)
- **Route**: `/suppliers/list`
- **Features**:
  - Search bar
  - 4 stat cards
  - Suppliers table (ID, Name, Contact, Email, Purchases, Balance, Status)
- **Actions**: Add Supplier, Import, Export, Edit, Delete

#### GRN Create (`GRNCreatePage.tsx`)
- **Route**: `/suppliers/grn/create`
- **Features**:
  - GRN header (Number, Supplier, Date, Invoice, PO, Location)
  - Items table (Item, Batch, Qty Ordered/Received, Price, Expiry)
  - Additional info (Notes, Attachments)
  - Amount summary
- **Actions**: Save as Draft, Submit for Approval, Cancel

#### GRN Approval (`GRNApprovalPage.tsx`)
- **Route**: `/suppliers/grn/approval`
- **Features**:
  - 4 stat cards
  - Pending GRNs table
  - Recently processed table
- **Actions**: View, Approve, Reject

### 5. Customers Module

#### Customers List (`CustomersListPage.tsx`)
- **Route**: `/customers/list`
- **Features**:
  - Search bar
  - 4 stat cards
  - Customers table (ID, Name, Phone, Email, Purchases, Points, Status)
- **Actions**: Add Customer, Import, Export, View, Edit

#### Customer Profile (`CustomerProfilePage.tsx`)
- **Route**: `/customers/:id`
- **Layout**: 2-column (Profile: 1/3, Activity: 2/3)
- **Features**:
  - Profile card with avatar
  - Loyalty points card
  - 3 stat cards (Purchases, Last Purchase, Avg. Order)
  - Purchase history table
  - Loyalty points history
- **Actions**: Edit Profile, Redeem Points

### 6. Reports Module

#### Reports Overview (`ReportsOverviewPage.tsx`)
- **Route**: `/reports`
- **Features**:
  - 4 quick stat cards
  - 6 report category cards (Sales, P&L, Inventory, Customer, Tax, Daily)
  - Recent reports list
- **Actions**: View Report for each category

#### Profit & Loss Report (`ProfitLossPage.tsx`)
- **Route**: `/reports/profit-loss`
- **Features**:
  - 4 summary cards (Revenue, Expenses, Profit, Margin)
  - Revenue breakdown
  - COGS breakdown
  - Operating expenses breakdown
  - Net profit summary
- **Actions**: Date Range, Filter, Export PDF

#### Daily Summary Report (`DailySummaryPage.tsx`)
- **Route**: `/reports/daily-summary`
- **Features**:
  - 4 summary cards
  - Payment methods breakdown
  - Sales by category table
  - Hourly sales chart placeholder
  - Top 5 products list
  - Daily expenses breakdown
  - Day end summary
- **Actions**: Select Date, Print, Export

### 7. Settings Module

#### User Management (`UserManagementPage.tsx`)
- **Route**: `/settings/users`
- **Tabs**: Users, Roles & Permissions
- **Users Tab**:
  - 4 stat cards
  - Users table (Name, Email, Role, Last Login, Status)
- **Roles Tab**:
  - 4 role cards (Admin, Manager, Cashier, Stock Keeper)
  - Permissions display
- **Actions**: Add User, Edit, Delete, Edit Role

#### Settings (`SettingsPage.tsx`)
- **Route**: `/settings`
- **Tabs**: Shop Details, Print Layout, Tax Settings, Theme & Display
- **Shop Tab**: Business info, contact, GST/PAN, logo upload
- **Print Tab**: Receipt configuration, preview
- **Tax Tab**: Tax rates management, calculation method
- **Theme Tab**: Theme mode, accent color, display options
- **Actions**: Save Changes

#### Sync Center (`SyncCenterPage.tsx`)
- **Route**: `/settings/sync`
- **Features**:
  - 4 status cards (Last Sync, Frequency, Data Synced, Cloud Status)
  - Current sync progress with module breakdown
  - Module sync status grid
  - Recent sync history
  - Sync settings toggles
- **Actions**: Sync Now

## Design Patterns

### Layouts Used
1. **Single Column**: Dashboard, Lists
2. **Two Column**: Forms (2/3 + 1/3), Profile pages
3. **Three Column**: Settings sections
4. **Grid Layouts**: 2-col, 3-col, 4-col for cards and stats

### Common Components
- **Card**: Primary container for sections
- **Table**: Data display with headers
- **Button**: Primary, outline, ghost variants
- **Badge**: Status indicators
- **Input**: Text fields, search bars
- **Tabs**: Multi-section pages
- **Progress**: Sync progress indicators

### Color Usage
- **Foreground**: Primary text
- **Muted Foreground**: Secondary text, captions
- **Primary**: Action buttons, active states
- **Green**: Success, profit, positive metrics
- **Red**: Danger, loss, negative metrics
- **Yellow/Orange**: Warnings, pending states
- **Blue**: Info, in-progress states

### Typography Scale
- **Headline L**: Page titles (--text-headline-l)
- **Headline M**: Section titles, KPI values
- **Subtitle M/S**: Card titles
- **Body L**: Page subtitles
- **Body M**: Regular text, table cells
- **Body S**: Small labels
- **Caption**: Metadata, timestamps

### Spacing Scale
- **32px (spacing-8)**: Page padding
- **24px (spacing-6)**: Section gaps, card padding
- **16px (spacing-4)**: Form field spacing
- **12px (spacing-3)**: Button gaps, tight spacing
- **8px (spacing-2)**: Small gaps

## File Structure
```
/components
  /templates
    - PageTemplate.tsx       (Reusable page wrapper)
  /pages
    - DashboardPage.tsx
    - SalesBillingPage.tsx
    - SalesReturnPage.tsx
    - HoldBillsPage.tsx
    - ItemsListPage.tsx
    - ItemFormPage.tsx
    - CategoriesPage.tsx
    - InventoryBatchesPage.tsx
    - StockAdjustmentPage.tsx
    - SuppliersListPage.tsx
    - GRNCreatePage.tsx
    - GRNApprovalPage.tsx
    - CustomersListPage.tsx
    - CustomerProfilePage.tsx
    - ReportsOverviewPage.tsx
    - ProfitLossPage.tsx
    - DailySummaryPage.tsx
    - UserManagementPage.tsx
    - SettingsPage.tsx
    - SyncCenterPage.tsx
    - PageTemplatesShowcase.tsx (Navigation/showcase)
```

## Usage

### Viewing Templates
The showcase page provides a navigable sidebar to preview all templates:
```tsx
import { PageTemplatesShowcase } from './components/pages/PageTemplatesShowcase';

function App() {
  return <PageTemplatesShowcase />;
}
```

### Using Individual Pages
```tsx
import { ItemsListPage } from './components/pages/ItemsListPage';

// In your router or app
<ItemsListPage />
```

### Creating New Pages
1. Copy the PageTemplate structure
2. Define breadcrumbs and title
3. Add action buttons
4. Build content using Cards and Tables
5. Follow the 32px padding standard

## Next Steps

To make these templates functional:

1. **Add Routing**: Implement React Router or similar
2. **Connect State**: Add state management (Redux, Zustand, Context)
3. **API Integration**: Connect to backend services
4. **Form Validation**: Add form libraries (React Hook Form)
5. **Data Tables**: Implement sorting, filtering, pagination
6. **Real Charts**: Replace placeholders with Recharts
7. **Image Uploads**: Implement file upload functionality
8. **Modal Dialogs**: Add confirmation dialogs, forms in modals
9. **Toast Notifications**: Add success/error feedback
10. **Loading States**: Add skeleton loaders and spinners

## Notes

- All pages use the design system from Phase 1
- Templates are mobile-friendly but optimized for 1920×1080 desktop
- Placeholders clearly indicate where real content should go
- All interactive elements have proper hover states
- Accessibility features included (proper labels, semantic HTML)
- Dark mode fully supported through design tokens
