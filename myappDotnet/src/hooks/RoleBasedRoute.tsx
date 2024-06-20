import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../models/Role';

interface RoleBasedRouteProps {
    children: JSX.Element;
    requiredRoles: Role[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, requiredRoles }) => {
    const { user, role, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log('Redirecting to login, current path:', location.pathname);
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    const hasRequiredRole = role ? role.some(r => requiredRoles.includes(r)) : false;
    if (hasRequiredRole) {
        return children;
    }

    return <Navigate to="/access-denied" replace />;
};

export default RoleBasedRoute;
