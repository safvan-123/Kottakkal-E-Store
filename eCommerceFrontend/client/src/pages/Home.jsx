import React from "react";
import Hero from "../components/homepage/Hero";
import Categories from "../components/homepage/Categories";
import ContactPage from "./ContactPage";
import OfferSalesPage from "../components/OfferSalesPage";
import ServicesPage from "../components/homepage/ServicesPage";

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <OfferSalesPage />
      <ServicesPage />
      <ContactPage />
    </div>
  );
};

export default Home;
