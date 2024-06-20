import React from 'react'
import Header from '../components/Header'
import SideBar from '../components/SideBar'
import AddNewProduct from '../page/AddNewProduct'
import ProductManagement from '../page/ProductManagement'
import "../css/DashBoard.css"
import { Outlet } from 'react-router-dom'



const DashboardLayout = () => {


    return (
        <>
            <Header />
            <div className='divContainer' >

                <div className='responsiveContainer'>

                    <Outlet />
                </div>

            </div>


            <SideBar />

        </>
    )
}

export default DashboardLayout