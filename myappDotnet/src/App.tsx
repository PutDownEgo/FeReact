import './App.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import DashboardLayout from './GUI/admin/layout/DashboardLayout';
import AddNewProduct from './GUI/admin/page/AddNewProduct';
import Dashboard from './GUI/admin/page/Dashboard';
import OrderManagement from './GUI/admin/page/OrderManagement';
import ProductManagement from './GUI/admin/page/ProductManagement';

import CategoryMangement from './GUI/admin/page/CategoryManegement';
import CouponMangement from './GUI/admin/page/CouponMangement';
import CustomerDetail from './GUI/admin/page/CustomerDetail';
import CustomerMangement from './GUI/admin/page/CustomerManagement';
import OrderDetailPageAdmin from './GUI/admin/page/OrderDetailPageAdmin';
import SystemUserDetail from './GUI/admin/page/SystemUserDetail';
import UserMangement from './GUI/admin/page/UserManagement';
import Authenticate from './GUI/user/components/Authenticate';
import MainLayout from './GUI/user/layout/MainLayout';
import AccessDenied from './GUI/user/page/AccessDenied';
import Cart from './GUI/user/page/Cart';
import Checkout from './GUI/user/page/Checkout';
import HomePage from './GUI/user/page/HomePage';
import LoginPage from './GUI/user/page/LoginPage';
import MainCategory from './GUI/user/page/MainCategory';
import NotFoundPage from './GUI/user/page/NotFoundPage';
import OrderDetailPageUser from './GUI/user/page/OrderDetailPageUser';
import OrderHistory from './GUI/user/page/OrderHistory';
import ProductDetail from './GUI/user/page/ProductDetail';
import SearchPage from './GUI/user/page/SearchPage';
import UserProfilePage from './GUI/user/page/UserProfilePage';
import RoleBasedRoute from './hooks/RoleBasedRoute';
import { Role } from './models/Role';
import PaymentResult from './GUI/user/page/PaymentResult';



const appRoutes = [
    {
        element: <MainLayout />,
        path: '/',
        errorElement: <NotFoundPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'home', element: <HomePage /> },
            { path: "payment-result", element: <PaymentResult /> },
            {
                path: 'checkout', element:
                    <RoleBasedRoute requiredRoles={[Role.USER]}>
                        <Checkout />
                    </RoleBasedRoute>
            },
            {
                path: 'user/orders', element:
                    <RoleBasedRoute requiredRoles={[Role.USER]}>
                        <OrderHistory />
                    </RoleBasedRoute>
            },
            {
                path: 'user/orders/:orderId', element:
                    <RoleBasedRoute requiredRoles={[Role.USER]}>
                        <OrderDetailPageUser />
                    </RoleBasedRoute>
            },
            {
                path: 'myinfo', element:
                    <RoleBasedRoute requiredRoles={[Role.USER]}>
                        <UserProfilePage />
                    </RoleBasedRoute>
            },
            { path: 'detail/:slug', element: <ProductDetail /> },
            { path: 'cart', element: <Cart /> },
            { path: 'category/:categoryName', element: <MainCategory /> },
            { path: 'search', element: <SearchPage /> },
            // { path: '*', element: <NotFoundPage /> }
        ]
    },
    { path: 'login', element: <LoginPage /> },
    { path: 'authenticate', element: <Authenticate /> },
    {
        path: 'admin',
        element: (
            <RoleBasedRoute requiredRoles={[Role.ADMIN, Role.STAFF]}>
                <DashboardLayout />
            </RoleBasedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'products', element: <ProductManagement /> },
            { path: 'products/add', element: <AddNewProduct /> },
            { path: 'orders', element: <OrderManagement /> },
            {
                path: 'orders/:orderId', element:
                    <RoleBasedRoute requiredRoles={[Role.ADMIN, Role.STAFF]}>
                        <OrderDetailPageAdmin />
                    </RoleBasedRoute>
            },
            { path: 'coupons', element: <CouponMangement /> },
            { path: 'customers', element: <CustomerMangement /> },
            { path: 'users/create', element: <SystemUserDetail /> },
            { path: 'users/:id', element: <SystemUserDetail /> },
            { path: 'customers/:id', element: <CustomerDetail /> },
            {
                path: 'users', element:
                    <RoleBasedRoute requiredRoles={[Role.ADMIN]}>
                        <UserMangement />
                    </RoleBasedRoute>
            },
            { path: 'categories', element: <CategoryMangement /> },

            { path: '*', element: <NotFoundPage /> },
        ],
    },
    { path: 'access-denied', element: <AccessDenied /> },
];

const router = createBrowserRouter(appRoutes);

function App() {

    return (

        <RouterProvider router={router} />

    )
}

export default App;
