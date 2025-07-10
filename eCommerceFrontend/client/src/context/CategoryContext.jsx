import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const fetchMasterCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/master-categories`
      );
      setCategories(data.categories || []);
      console.log(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/sub-categories`
      );

      setSubCategories(data.subCategories || []);
      console.log("Sub Categories:", data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchMasterCategories();
    fetchSubCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, subCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
