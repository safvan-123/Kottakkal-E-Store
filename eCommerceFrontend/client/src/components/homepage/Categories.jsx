// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { useCategory } from "../../context/CategoryContext";
// import { useNavigate } from "react-router-dom";

// // External arrows positioned outside the slider
// const NextArrow = ({ onClick }) => (
//   <div
//     className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
//     onClick={onClick}
//   >
//     <div className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition duration-300">
//       <FaChevronRight className="text-xl text-gray-600 hover:text-blue-600" />
//     </div>
//   </div>
// );

// const PrevArrow = ({ onClick }) => (
//   <div
//     className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
//     onClick={onClick}
//   >
//     <div className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition duration-300">
//       <FaChevronLeft className="text-xl text-gray-600 hover:text-blue-600" />
//     </div>
//   </div>
// );

// const Categories = () => {
//   const { categories } = useCategory();
//   const navigate = useNavigate();

//   const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 6,
//     slidesToScroll: 1,
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1280,
//         settings: {
//           slidesToShow: 5,
//         },
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 4,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 3,
//         },
//       },
//     ],
//   };

//   const handleCategoryClick = (categoryName) => {
//     navigate(`/subcategories/${categoryName}`);
//   };

//   if (!categories || categories.length === 0) {
//     return (
//       <section className="py-12 bg-white">
//         <div className="container mx-auto px-4 text-center text-gray-500">
//           <p>Loading categories or no categories available...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12 bg-white overflow-hidden relative">
//       <div className="max-w-7xl mx-auto px-4 relative">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
//             <svg
//               className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
//               ></path>
//             </svg>
//             Browse by Category
//           </h2>
//         </div>

//         <div className="relative">
//           <Slider {...settings}>
//             {categories.map((category) => {
//               const imageUrl =
//                 category?.image || "/images/default-category.png";

//               return (
//                 <div key={category._id} className="px-2">
//                   <button
//                     onClick={() => handleCategoryClick(category.name)}
//                     className="w-full flex flex-col items-center text-center p-3 rounded-lg group bg-white border border-gray-200 hover:border-blue-400 transition duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
//                   >
//                     <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 flex items-center justify-center mb-3 overflow-hidden rounded-full border border-gray-200">
//                       <img
//                         src={imageUrl}
//                         alt={category.name}
//                         className="w-full h-full object-cover rounded-full"
//                       />
//                     </div>
//                     <p className="text-xs md:text-sm text-gray-700 font-medium group-hover:text-blue-600 truncate">
//                       {category.name}
//                     </p>
//                   </button>
//                 </div>
//               );
//             })}
//           </Slider>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Categories;

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategory } from "../../context/CategoryContext";
import { useNavigate } from "react-router-dom";

// Arrows outside the slider
const NextArrow = ({ onClick }) => (
  <div
    className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <div className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition">
      <FaChevronRight className="text-xl text-gray-600 hover:text-blue-600" />
    </div>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <div className="bg-white p-2 rounded-full shadow hover:bg-blue-100 transition">
      <FaChevronLeft className="text-xl text-gray-600 hover:text-blue-600" />
    </div>
  </div>
);

const Categories = () => {
  const { categories } = useCategory();
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/subcategories/${categoryName}`);
  };

  if (!categories || categories.length === 0) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Loading categories or no categories available...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
            Browse by Category
          </h2>
        </div>

        <div className="relative">
          <Slider {...settings}>
            {categories.map((category) => {
              const imageUrl =
                category?.image || "/images/default-category.png";

              return (
                <div key={category._id} className="px-2">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className="relative w-full min-h-[140px] md:min-h-[160px] flex flex-col items-center justify-start text-center px-3 py-3 rounded-xl group bg-white transition-all duration-300 ease-in-out shadow-sm border border-gray-200 hover:border-black hover:shadow-md hover:bg-gray-50 transform"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 flex items-center justify-center mb-2 overflow-hidden rounded-full border border-gray-200 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <p className="text-xs md:text-sm text-gray-700 font-medium group-hover:text-blue-600 transition-colors truncate w-full">
                      {category.name}
                    </p>
                  </button>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Categories;
