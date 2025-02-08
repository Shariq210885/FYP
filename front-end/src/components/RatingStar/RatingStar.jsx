import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const RatingStars = ({ initialRating = 0, totalStars = 5, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredRating(index + 1); // +1 because index is 0-based
  };

  const handleMouseLeave = () => {
    setHoveredRating(0); // Reset to 0 when mouse leaves
  };

  const handleClick = (index) => {
    const newRating = index + 1;
    setRating(newRating); // Set rating on click
    onRatingChange(newRating); // Pass the new rating back to parent
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < totalStars; i++) {
      const isHovered = hoveredRating > i; // Is the star being hovered
      const isRated = rating > i; // Is the star already rated
      const isHalf = hoveredRating === i + 0.5 || rating === i + 0.5; // For half rating logic

      let star = <AiOutlineStar key={i} size={30} />;

      if (isRated || isHovered) {
        star = <AiFillStar key={i} size={30} className="text-yellow-400"/>;
      }

      if (isHalf) {
        // star = <AiOutlineHalfStar key={i} size={30} />;
      }

      stars.push(
        <div
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          className="cursor-pointer"
        >
          {star}
        </div>
      );
    }
    return stars;
  };

  return <div className="flex">{renderStars()}</div>;
};

export default RatingStars;
