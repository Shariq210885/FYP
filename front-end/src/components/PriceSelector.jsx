import React, { useState } from "react";

const PriceSelector = ({ onPriceChange }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("Any");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const priceOptions = [1000, 5000, 10000, 20000, 50000, 100000]; // Sample price options

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMinChange = (value) => {
    setMinPrice(value);
    if (maxPrice !== "Any" && value >= maxPrice) {
      setMaxPrice("Any");
    }
    onPriceChange(value, maxPrice);
  };

  const handleMaxChange = (value) => {
    setMaxPrice(value);
    if (value === "Any") {
      onPriceChange(minPrice, Infinity);
    } else {
      onPriceChange(minPrice, value);
    }
  };

  const resetSelection = () => {
    setMinPrice(0);
    setMaxPrice("Any");
    onPriceChange(0, Infinity);
  };

  return (
    <div className="relative text-center border-r-2">
      <div
        className="flex w-full items-center justify-between p-2 cursor-pointer bg-transparent hover:bg-gray-100"
        onClick={toggleDropdown}
      >
        <div className="text-left">
          <p className="text-xs text-gray-500">PRICE (PKR)</p>
          <p className="font-medium">
            {minPrice.toLocaleString()} to{" "}
            {maxPrice === "Any" ? "Any" : maxPrice.toLocaleString()}
          </p>
        </div>
        <span className="text-lg ml-2">
          {isDropdownOpen ? "\u25B2" : "\u25BC"}
        </span>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-16 left-0 w-72 bg-white shadow-lg border rounded-lg z-10 p-4">
          <p className="text-blue-500 text-sm cursor-pointer mb-3 hover:underline">
            PKR
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">MIN:</p>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => handleMinChange(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <div className="max-h-24 overflow-y-auto mt-1 border rounded">
                {priceOptions.map((price) => (
                  <div
                    key={price}
                    onClick={() => handleMinChange(price)}
                    className={`p-2 text-center cursor-pointer hover:bg-gray-200 ${
                      minPrice === price ? "bg-blue-200" : ""
                    }`}
                  >
                    {price.toLocaleString()}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">MAX:</p>
              <input
                type="text"
                value={maxPrice === "Any" ? "Any" : maxPrice.toLocaleString()}
                readOnly
                className="w-full p-2 border rounded text-center bg-gray-50 focus:outline-none"
              />
              <div className="max-h-24 overflow-y-auto mt-1 border rounded">
                <div
                  onClick={() => handleMaxChange("Any")}
                  className={`p-2 text-center cursor-pointer hover:bg-gray-200 ${
                    maxPrice === "Any" ? "bg-blue-200" : ""
                  }`}
                >
                  Any
                </div>
                {priceOptions
                  .filter((price) => price >= minPrice)
                  .map((price) => (
                    <div
                      key={price}
                      onClick={() => handleMaxChange(price)}
                      className={`p-2 text-center cursor-pointer hover:bg-gray-200 ${
                        maxPrice === price ? "bg-blue-200" : ""
                      }`}
                    >
                      {price.toLocaleString()}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={resetSelection}
            >
              Reset
            </button>

            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => setIsDropdownOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceSelector;
