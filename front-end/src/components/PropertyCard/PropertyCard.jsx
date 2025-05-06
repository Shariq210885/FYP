import { useState, useMemo } from "react";
import { AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { FaBed, FaToilet, FaChartArea } from "react-icons/fa";
import { MapPin } from "lucide-react";
// Rating calculation logic
const calculateRatingData = (reviews) => {
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
    };
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  return { averageRating };
};

const PropertyCard = ({ property, handleCardClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Calculate average rating using property reviews
  const { averageRating } = useMemo(
    () => calculateRatingData(property.reviews || []),
    [property.reviews]
  );

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  function formatPrice(price) {
    if (price >= 10000000) {
      const crore = price / 10000000;
      return `${parseFloat(crore.toFixed(2))} Crore`;
    } else if (price >= 100000) {
      const lac = price / 100000;
      return `${parseFloat(lac.toFixed(2))} Lac`;
    } else {
      return price.toLocaleString();
    }
  }

  function formatRelativeTime(dateString) {
    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffInMilliseconds = now - updatedDate;

    // Convert to seconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return "just now";
    }

    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1
        ? "1 minute ago"
        : `${diffInMinutes} minutes ago`;
    }

    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
    }

    // Less than a month
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
    }

    // Less than a year
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
    }

    // More than a year
    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
  }

  return (
    <div className="max-w-xs border border-red-400 rounded-2xl shadow-sm">
      <div className="relative h-[16rem]">
        <img
          src={property.images[currentImageIndex]}
          alt="Property"
          className="object-cover w-full h-full rounded-2xl"
        />

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
          <div className="text-xl font-bold text-gray-800">
            <span className="text-base">PKR</span>{" "}
            {formatPrice(property.rentPrice)}
          </div>

          <div className="flex items-center">
            <AiOutlineStar className="text-yellow-500" />
            <span className="ml-1 text-gray-600">
              {averageRating.toFixed(1)} {/* Display average rating here */}
            </span>
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
              {property.area} - {property.areaMeasureType}
            </span>
          </div>
        </div>

        <div className="text-lg font-semibold text-black-800 flex items-center gap-1">
          <MapPin className="w-5 h-5 text-primaryColor" />
          <span>
            {property.sector}, {property.city}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 mt-1">
            Updated {formatRelativeTime(property.updatedAt)}
          </div>
          <button
            className="px-3 py-1 text-white bg-primaryColor rounded-md"
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
