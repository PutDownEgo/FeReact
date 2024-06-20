import { Outlet } from 'react-router-dom'
import { ScrollToTop } from '../../../hooks/ScrollToTop'
import Footer from '../components/Footer'
import GoToTopBtn from '../components/GoToTopBtn'
import HeaderCategory from '../components/HeaderCategory'
import NavBar from '../components/NavBar'
import SearchModal from '../components/SearchModal'

const MainLayout = () => {
    return (
        <>

            <ScrollToTop />
            <NavBar />
            <SearchModal />
            <HeaderCategory />
            <Outlet />
            <Footer />
            <GoToTopBtn />


        </>
    )
}

export default MainLayout