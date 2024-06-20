import { NavLink } from 'react-router-dom';
import styles from '../css/Admin.SideBar.module.css';
import { useAuth } from '../../../context/AuthContext';
import { Role } from '../../../models/Role';

const SideBar = () => {

    const { role } = useAuth();
    return (
        <aside id="sidebar" className={styles.sidebar}>
            <ul className={styles.sidebarNav} id="sidebar-nav">
                <li style={{ cursor: "pointer" }} className={styles.navItem}>
                    <NavLink to="/admin" style={{ fontSize: 16 }} className={({ isActive }) => isActive ? `link ${styles.navLink} activeLink` : 'link'}>
                        <i className="bi bi-grid"></i>
                        <span className='ms-2'>Dashboard</span>
                    </NavLink>
                </li>

                <li className={styles.navItem}>
                    <a style={{ fontSize: 16 }} className={`${styles.navLink} collapsed`} data-bs-target="#components-nav"
                        data-bs-toggle="collapse" href="#">
                        <i className="bi bi-menu-button-wide"></i>
                        <span className='ms-2'>Product Management</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="components-nav" className={`${styles.navContentCollapse} collapse`}
                        data-bs-parent="#sidebar-nav">
                        <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'}
                                style={{ fontSize: 16 }} to="/admin/products" end>

                                <span className='ms-2'>All the products</span>
                            </NavLink>
                        </li>
                        <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'}
                                style={{ fontSize: 16 }} to="/admin/categories" end>

                                <span className='ms-2'>Categories</span>
                            </NavLink>
                        </li>
                        {/* <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'} style={{ fontSize: 16 }} to="/admin/products/add">

                                <span className='ms-2'>Add new product</span>
                            </NavLink>
                        </li> */}
                    </ul>
                </li>

                <li className={styles.navItem}>
                    <a style={{ fontSize: 16 }} className={`${styles.navLink} collapsed`} data-bs-target="#forms-nav"
                        data-bs-toggle="collapse" href="#">
                        <i className="bi bi-journal-text"></i>
                        <span className='ms-2'>Order Management</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="forms-nav" className={`${styles.navContentCollapse} collapse`}
                        data-bs-parent="#sidebar-nav">
                        <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'}
                                style={{ fontSize: 16 }} to="/admin/orders" end>

                                <span className='ms-2'>All the orders</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className={styles.navItem}>
                    <a style={{ fontSize: 16 }} className={`${styles.navLink} collapsed`} data-bs-target="#User-nav"
                        data-bs-toggle="collapse" href="#">
                        <i className="bi bi-person"></i>
                        <span className='ms-2'>User Management</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="User-nav" className={`${styles.navContentCollapse} collapse`}
                        data-bs-parent="#sidebar-nav">
                        <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'}
                                style={{ fontSize: 16 }} to="/admin/customers" end>

                                <span className='ms-2'>All the customers</span>
                            </NavLink>

                        </li>
                        {role?.includes(Role.ADMIN) && <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'}
                                style={{ fontSize: 16 }} to="/admin/users" end>
                                <span className='ms-2'>All the Users</span>
                            </NavLink>
                        </li>}


                    </ul>
                </li>

                <li className={styles.navItem}>
                    <a style={{ fontSize: 16 }} className={`${styles.navLink} collapsed`} data-bs-target="#tables-nav"
                        data-bs-toggle="collapse" href="#">
                        <i className="bi bi-layout-text-window-reverse"></i>
                        <span className='ms-2'>Coupons</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="tables-nav" className={`${styles.navContentCollapse} collapse`}
                        data-bs-parent="#sidebar-nav">
                        <li style={{ padding: 10 }}>
                            <NavLink className={({ isActive }) => isActive ? 'link activeLink' : 'link'}
                                style={{ fontSize: 16 }} to="/admin/coupons" end>

                                <span className='ms-2'>All the coupons</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>

                {/* <li className={styles.navItem}>
                    <a style={{ fontSize: 16 }} className={`${styles.navLink} collapsed`} data-bs-target="#charts-nav"
                        data-bs-toggle="collapse" href="#">
                        <i className="bi bi-bar-chart"></i>
                        <span className='ms-2'>Charts</span>
                        <i className="bi bi-chevron-down ms-auto"></i>
                    </a>
                    <ul id="charts-nav" className={`${styles.navContentCollapse} collapse`}
                        data-bs-parent="#sidebar-nav">

                    </ul>
                </li> */}


            </ul>
        </aside>
    );
}

export default SideBar