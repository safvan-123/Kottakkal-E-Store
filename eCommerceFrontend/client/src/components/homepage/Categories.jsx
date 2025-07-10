import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCategory } from "../../context/CategoryContext";
import { useNavigate } from "react-router-dom";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow next-arrow`}
      style={{ ...style, display: "block", right: "-25px" }}
      onClick={onClick}
    >
      <FaChevronRight className="text-gray-600 hover:text-blue-600 text-2xl" />
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow prev-arrow`}
      style={{ ...style, display: "block", left: "-25px" }}
      onClick={onClick}
    >
      <FaChevronLeft className="text-gray-600 hover:text-blue-600 text-2xl" />
    </div>
  );
};

const Categories = () => {
  const { categories } = useCategory();
  console.log(categories);

  console.log("Categories from Context in Categories.jsx:", categories);

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
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!categories || categories.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Loading categories or no categories available...</p>
        </div>
      </section>
    );
  }

  const handleCategoryClick = (categoryName) => {
    navigate(`/subcategories/${categoryName}`);
    // navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };
  // /api/sub-categories
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg
              className="w-8 h-8 text-blue-600"
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

        <Slider {...settings}>
          {categories.map((category, index) => {
            const currentImageUrl =
              category?.image || "/images/default-category.png";

            return (
              <div key={category._id} className="px-2">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.name);
                  }}
                  className="flex flex-col items-center text-center p-4 rounded-lg group hover:bg-gray-50 transition-colors duration-300"
                >
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center mb-4 overflow-hidden group-hover:shadow-md transition-shadow duration-300 rounded-[7px]">
                    <img
                      src={currentImageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-gray-700 font-medium text-lg group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </p>
                </a>
              </div>
            );
          })}
        </Slider>
      </div>
    </section>
  );
};

export default Categories;
