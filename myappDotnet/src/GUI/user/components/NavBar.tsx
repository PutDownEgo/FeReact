import React, { useEffect, useState } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { getAllCategories } from '../../../api/CategoryApi';
import { getAllProductsBySearchQuery } from '../../../api/ProductApi';
import { useAuth } from '../../../context/AuthContext';
import { useShoppingCart } from '../../../context/ShoppingCartContext';
import { Category, ProductSearchString } from '../../../models/Product';
import NotificationBell from './NotificationBell';
import SearchResultList from './SearchResultList';




const NavBar = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchString, setSearchString] = useState<string>("");
    const [searchResults, setSearchResults] = useState<ProductSearchString[]>([]);
    const { cartQuantity } = useShoppingCart();
    const [showResults, setShowResults] = useState<boolean>(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const [debouncedSearchString] = useDebounce(searchString, 500);
    useEffect(() => {
        if (debouncedSearchString) {
            const fetchSearchResults = async () => {
                try {
                    const response = await getAllProductsBySearchQuery(debouncedSearchString);
                    setSearchResults(response.result);
                } catch (error) {
                    console.error('Failed to fetch products:', error);
                }
            };

            if (searchString.trim().length > 0) {
                fetchSearchResults();
            } else {
                setSearchResults([]);
            }
        }
    }, [debouncedSearchString]);

    const location = useLocation();

    useEffect(() => {
        const dropdown = document.getElementById('categoryDropdown');
        if (dropdown)
            dropdown.classList.remove('active');
    }, [location]);


    useEffect(() => {
        fetchAllCategories();
    }, [])


    const fetchAllCategories = async () => {
        const response = await getAllCategories();
        setCategories(response.result);
    }


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowResults(true);
        setSearchString(e.target.value);
    };

    const hideSearchResults = () => {
        setShowResults(false);
    };

    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);

        document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
    };
    const toggleDropdown = () => {
        const dropdown = document.getElementById('categoryDropdown');
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    };


    const showMenuMobile = () => {
        setIsDropdownOpen(prevState => !prevState);
    }

    function goToMainCategoryWithQ(qValue: string) {
        navigate(`/search?q=${qValue}`);
    }

    const handleLinkClick = () => {
        toggleMenu();
    };


    return (
        <>
            <div className="container-fluid fixed-top">

                <div className="container topbar bg-primary d-none d-lg-block">
                    <div className="d-flex justify-content-between">
                        <div className="top-info ps-2">
                            <small className="me-3">
                                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                                <a href="#" className="text-white">123 Street, New York</a>
                            </small>
                            <small className="me-3">
                                <i className="fas fa-envelope me-2 text-secondary"></i>
                                <a href="#" className="text-white">Email@Example.com</a>
                            </small>
                        </div>
                        <div className="top-link pe-2">
                            <a href="#" className="text-white"><small className="text-white mx-2">Privacy Policy</small>/</a>
                            <a href="#" className="text-white"><small className="text-white mx-2">Terms of Use</small>/</a>
                            <a href="#" className="text-white"><small className="text-white ms-2">Sales and Refunds</small></a>
                        </div>
                    </div>
                </div>
                <div className="container px-0">
                    <nav className="navbar navbar-light bg-white navbar-expand-xl">

                        <NavLink to="/" className="navbar-brand"><h1 className="text-primary display-6">Fruitables</h1></NavLink>
                        <div>
                            <button style={{ marginLeft: "20px" }} className="navbar-toggler py-2 px-3" type="button" onClick={toggleMenu} >
                                <span className="fa fa-bars text-primary"></span>
                            </button>
                        </div>

                        <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
                            <div className="navbar-nav mx-auto">
                                <NavLink to="/home" className="nav-item nav-link">Home</NavLink>
                                <div className="nav-item dropdown">
                                    <NavLink to="#" className="nav-item nav-link" id='categoryDropdown' >
                                        Category
                                        <span style={{ marginLeft: "6px" }}>
                                            <i className="fas fa-angle-down" style={{ color: "#63E6BE" }}></i>
                                        </span>

                                    </NavLink>

                                    <div className="dropdown-menu m-0 bg-secondary rounded-0">
                                        {categories.map((category, index) => (
                                            <NavLink key={index} to={`/category/${category.name}`} className="my-dropdown-item nav-item nav-link" onClick={toggleDropdown}>{category.name}</NavLink>
                                        ))}

                                    </div>
                                </div>

                                <NavLink to="" className="nav-item nav-link">Contact</NavLink>
                            </div>
                            <div className="d-flex m-3 me-0 justify-content-end">
                                <div style={{ width: 450, position: 'relative' }} className="position-relative mx-auto">
                                    <input value={searchString} onChange={handleSearch} className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill" type="text" placeholder="Search" />
                                    <button onClick={() => goToMainCategoryWithQ(searchString)} type="submit" className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100" style={{ top: 0, left: '60%', right: '8%' }}>Search </button>
                                    {searchString && showResults && searchString.length > 0 && <SearchResultList results={searchResults} onResultClick={hideSearchResults} />}
                                </div>


                                <NavLink to="/cart" className="position-relative my-auto">
                                    <i className="fa fa-shopping-bag fa-2x"></i>
                                    <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px' }}>{cartQuantity}</span>
                                </NavLink>
                                {user && <div className="ms-4 position-relative my-auto">
                                    <NotificationBell />
                                </div>}


                                <span className="my-auto">

                                    {user && user.firstName ?
                                        <Nav>
                                            <NavDropdown id="nav-dropdown-dark-example " title={user.firstName}>
                                                <NavDropdown.Item className="my-dropdown-item" onClick={() => navigate("/myInfo")} >Profile</NavDropdown.Item>
                                                <NavDropdown.Item className="my-dropdown-item" onClick={() => navigate("/user/orders")} >Order History</NavDropdown.Item>
                                                <NavDropdown.Item className="my-dropdown-item" onClick={logout}>Logout</NavDropdown.Item>
                                            </NavDropdown>
                                        </Nav>
                                        :

                                        <Nav>
                                            <NavDropdown className="custom-nav-dropdown " id="nav-dropdown-dark-example" title={<i className="fas fa-user fa-2x"></i>}>
                                                <NavDropdown.Item className="my-dropdown-item custom-background" onClick={() => { navigate('/login') }}>Login</NavDropdown.Item>
                                            </NavDropdown>
                                        </Nav>

                                    }
                                </span>
                            </div>
                        </div>
                    </nav>
                </div >
            </div >
            <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                    <button style={{ top: '10px' }} className="closebtn" onClick={toggleMenu}>&times;</button>
                    <NavLink style={{ textAlign: 'left' }} to="/home" className="nav-item nav-link" onClick={handleLinkClick}>Home</NavLink>
                    <div className="nav-item dropdown">
                        <NavLink style={{ textAlign: 'left' }} to="#" className="nav-item nav-link" id="categoryDropdown" onClick={showMenuMobile}>
                            Category
                            <span style={{ marginLeft: '6px' }}>
                                <i className="fas fa-angle-down" style={{ color: '#63E6BE' }}></i>
                            </span>
                        </NavLink>
                        {isDropdownOpen && (
                            <div className="dropdown-menu m-0 rounded-0">
                                {categories.map((category) => (
                                    <NavLink key={category.name} to={`/category/${category.name}`} className="my-dropdown-item nav-item nav-link" onClick={handleLinkClick}>{category.name}</NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                    <NavLink style={{ textAlign: 'left' }} to="/contact" className="nav-item nav-link" onClick={handleLinkClick}>Contact</NavLink>
                </div>
            </div>



        </>
    )
}

export default NavBar