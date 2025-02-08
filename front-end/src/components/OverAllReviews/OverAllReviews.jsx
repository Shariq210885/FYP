
  import { useMemo } from 'react';
  import { AiFillStar } from 'react-icons/ai';

  export const calculateRatingData = (reviews) => {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      // Return 0s if no reviews are present
      return {
        averageRating: 0,
        ratingsData: [
          { stars: 1, percentage: 0 },
          { stars: 2, percentage: 0 },
          { stars: 3, percentage: 0 },
          { stars: 4, percentage: 0 },
          { stars: 5, percentage: 0 },
        ],
      };
    }
    // Calculate average rating
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    // Calculate rating distribution
    const ratingCounts = [0, 0, 0, 0, 0]; // To store count of each rating from 1 to 5
    reviews.forEach((review) => {
      ratingCounts[review.rating - 1]++;
    });

    // Calculate percentages for each rating (1 to 5)
    const ratingsData = ratingCounts.map((count, index) => ({
      stars: index + 1,
      percentage: (count / totalReviews) * 100,
    }));

    return { averageRating, ratingsData };
  };

  const PropertyReviews = ({ reviews, title }) => {
    
    const { averageRating, ratingsData } = useMemo(() => calculateRatingData(reviews), [reviews]);

    return (
      <div className="space-y-4">
        {/* Overall Rating */}
        <div className="flex items-end mt-6 space-x-2">
          <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
          <AiFillStar className="" size={22} />
                <span className="text-xl font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center space-x-2">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex mt-1 text-lg text-gray-600">
              {[...Array(5)].map((_, i) => (
                <AiFillStar
                  key={i}
                  size={22}
                  color={i < Math.floor(averageRating) ? 'yellow' : 'gray'}
                />
              ))}
            </div>
            <span className="text-gray-500">{reviews.length} reviews</span>
          </div>
          <div className="flex-grow">
            {/* Rating Bars */}
            {ratingsData.map((rating) => (
              <div key={rating.stars} className="flex items-center space-x-2">
                <span className="w-4 text-sm">{rating.stars}</span>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-black rounded-full"
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-sm text-gray-600">{rating.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default PropertyReviews;
