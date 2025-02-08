import { useState } from "react";
import { AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { FaBed, FaToilet, FaChartArea } from "react-icons/fa";

const PropertyCard = ({ property, handleCardClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="max-w-xs border border-gray-300 rounded-lg shadow-sm ">
      <div className="relative h-[16rem]">
        <img
          src={property.images[currentImageIndex]}
          alt="Property"
          className="object-cover w-full h-full rounded-lg"
        />
        <div className="absolute top-2 right-2">
          <AiOutlineHeart className="text-xl text-gray-100" />
        </div>
        {/* Carousel Dots */}
        <div className="absolute left-0 right-0 flex justify-center space-x-2 bottom-2">
          {property.images.map((_, index) => (
            <span
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                index === currentImageIndex ? "bg-white" : "bg-gray-200"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 truncate">
            {property.title}
          </h3>
          <div className="flex items-center">
            {/* do to */}
            <AiOutlineStar className="text-gray-600" />
            <span className="ml-1 text-gray-600">4.0</span>
          </div>
        </div>
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <div className="flex items-center">
            <FaBed className="mr-1 text-lg" />
            <span>{property.bedRooms}</span>
          </div>
          <div className="flex items-center">
            <FaToilet className="mr-1 text-lg" />
            <span>{property.bathRooms}</span>
          </div>
          <div className="flex items-center">
            <FaChartArea className="mr-1 text-lg" />
            <span>
              {property.area}-{property.areaMeasureType}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xl font-bold text-gray-800 ">
           Rs. {property.rentPrice}
          </div>
          <button
            className="px-3 py-1 text-white bg-primaryColor"
            onClick={handleCardClick}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
