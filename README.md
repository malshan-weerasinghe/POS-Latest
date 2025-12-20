
# 🏪 Minimal POS Application

A clean, modern Point of Sale (POS) application built with React, TypeScript, and Tailwind CSS.

## 📱 Features

### Core POS Functionality
- **Dashboard** - Overview with sales metrics and charts
- **Sales & Billing** - Complete POS billing system with cart, payment processing, and thermal receipt printing
- **Sales History** - Transaction history and sales tracking
- **Inventory Management** - Items list and categories management
- **Customer Management** - Customer database and profiles  
- **Supplier Management** - Supplier information and contacts
- **Receipt Printing** - 80mm thermal receipt format
- **Settings** - Application configuration

### Technical Features
- **Clean Architecture** - Minimal, well-organized codebase
- **TypeScript** - Full type safety
- **Responsive Design** - Works on all screen sizes
- **Dark/Light Theme** - Theme switching
- **Toast Notifications** - User feedback system
- **Modal System** - Dialogs and confirmations

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🏗️ Architecture

### Essential Components
- **9 Core Pages** - All POS functionality
- **18 UI Components** - Essential UI building blocks  
- **3 Layout Components** - App shell, page template, sidebar
- **17 Dependencies** - Minimal, focused dependencies

### File Structure
```
src/
├── components/
│   ├── layout/         # AppShell, PageTemplate, Sidebar
│   ├── pages/          # 9 core POS pages
│   └── ui/             # 18 essential UI components
├── styles/             # Tailwind CSS
├── App.tsx             # Main app with routing
└── main.tsx            # React entry point
```

## 🎯 Key Features

- **Sales Processing** - Complete POS billing with barcode scanning support
- **Customer Management** - Add/search customers with purchase history
- **Inventory Control** - Product management with categories and stock tracking  
- **Multi-Payment** - Cash and card payment processing
- **Receipt System** - Professional thermal receipts with warranty terms
- **Dashboard Analytics** - Sales metrics with interactive charts

## 🛠️ Technologies

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Recharts** - Dashboard analytics
- **Sonner** - Toast notifications

This is a production-ready POS application with a clean, maintainable codebase focused on essential functionality.
  