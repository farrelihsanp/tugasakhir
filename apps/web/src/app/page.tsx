import LandingCategory from '../components/common/landingCategory';
import ProductPage from '../components/common/landingProduct';
import Hero from '../components/common/Hero';
import ServicePage from '@/components/common/services';
import { Geolocation } from '../components/location-request';

export default function Home() {
  return (
    <section>
      <Geolocation />
      <Hero />
      <LandingCategory />
      <ServicePage />
      <ProductPage />
    </section>
  );
}
