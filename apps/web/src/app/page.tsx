// import Navbar from '../components/common/navbar';
import LandingCategory from '../components/common/landingCategory';
import ProductPage from '../components/common/landingProduct';
// import Footer from '../components/common/footer';
import Hero from '../components/common/Hero';
import SearchBar from '../components/common/searchbar';
import { Geolocation } from '../components/location-request';

export default function Home() {
  return (
    <section>
      <Geolocation />
      <SearchBar />
      <Hero />
      <LandingCategory />
      <ProductPage />
    </section>
  );
}
