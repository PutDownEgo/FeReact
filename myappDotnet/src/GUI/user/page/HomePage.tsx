
import Carousel from '../components/Carousel'
import FeatureSection from '../components/FeatureSection'
import FruitShop from '../components/FruitShop'
import ServiceFeature from '../components/ServiceFeature'
import VegetableShop from '../components/VegetableShop'
import Banner from '../components/Banner'
import BestSellerSection from '../components/BestSellerSection'
import FactService from '../components/FactService'
import CertificateSection from '../components/CertificateSection'




const HomePage = () => {

    return (
        <>

            {/* <LoadingSpinner /> */}

            <Carousel />
            <FeatureSection />
            <FruitShop />
            <ServiceFeature />
            <VegetableShop />
            <Banner />
            {/* <BestSellerSection /> */}
            <FactService />
            {/* <CertificateSection /> */}




        </>
    )
}

export default HomePage