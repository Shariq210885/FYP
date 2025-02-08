const ServiceCard = ({ imageUrl, title, description, onClick, price }) => {
  return (
    <div className="flex flex-col max-w-sm overflow-hidden transition duration-300 transform bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl">
      {/* Image section */}
      <img src={imageUrl} alt={title} className="object-cover w-full h-56" />

      {/* Card content */}
      <div className="flex flex-col justify-between flex-grow px-2 pt-6 pb-2">
        <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800 truncate">{title}</h2>
<p className="mb-4 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap">{description}</p>

        </div>
        {/* Price section */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-lg font-semibold text-red-600">
            Rs. {price}
          </span>
          <button
            onClick={onClick}
            className="px-4 py-2 text-white transition duration-300 rounded-lg bg-primaryColor hover:bg-primaryColor/90"
          >
            View Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
