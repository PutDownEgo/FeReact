import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const HeaderCategory = () => {
    const location = useLocation();

    const generateBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(path => path);
        const breadcrumbs = paths.map((path, index) => {
            const to = `/${paths.slice(0, index + 1).join('/')}`;
            return (
                <li key={to} className="breadcrumb-item">
                    <NavLink to={to}>{path.charAt(0).toUpperCase() + path.slice(1)}</NavLink>
                </li>
            );
        });
        return breadcrumbs;
    };
    return (
        <div className="container-fluid page-header py-5">
            <h1 className="text-center text-white display-6">Shop</h1>
            <ol className="breadcrumb justify-content-center mb-0">
                <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
                {generateBreadcrumbs()}
            </ol>
        </div>
    )
}

export default HeaderCategory
