import RatingStars from "../RatingStar/RatingStar"; // Import RatingStars

function ReviewModel({ handleCloseModal,handleGiveReview ,rating,setRating,setMessage,message}) {

  const handleRatingChange = (newRating) => {
    setRating(newRating); // Update the rating when user interacts with stars
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="w-1/2 p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold">Add Your Review</h2>
        <div className="mt-4">
          <textarea
            placeholder="Write your review..."
            className="w-full p-2 border rounded-md outline-none"
            rows="4"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="font-semibold">Rating</label>
          <div className="mt-2">
            {/* Use the RatingStars component and pass props */}
            <RatingStars initialRating={rating} totalStars={5} onRatingChange={handleRatingChange} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 text-white bg-gray-400 rounded-lg hover:bg-red-600"
          >
            Close
          </button>
          <button
            onClick={handleGiveReview}
            className="px-4 py-2 ml-2 text-white rounded-lg bg-primaryColor hover:bg-primaryColor/90"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModel;
