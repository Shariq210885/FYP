import { useEffect, useRef, useState } from "react";

export default function Filters({
  activeButton,
  setCityName,
  cityName,
  setSector,
  sector,
  setPropertyType,
  propertyType,
  setMinArea,
  setMaxArea,
  setBedRoom,
  BedRoom,
  setMinPrice,
  setMaxPrice,
  Search,
  ServiceSearch,
  setTitle,
  title,
  isDropdownOpen,
  setIsDropdownOpen,
  minArea,
  maxArea,
  minPrice,
  maxPrice,
  isPriceDropdownOpen,
  setIsPriceDropdownOpen,
  sortOrder,
  onSortChange,
  dateSortOrder,
  onDateSortChange,
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const priceOptions = [
    1000, 5000, 10000, 20000, 50000, 100000, 1500000, 200000, 300000, 500000,
    1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000,
  ]; // Sample price options
  const areaOptions = [0, 2, 3, 5, 8, 10, 15, 20, 25, 30, 50, 100];

  const areaDropdownRef = useRef(null);
  const priceDropdownRef = useRef(null);
  const advancedFilterRef = useRef(null);
  const mobilFilterRef = useRef(null);

  // Function to generate sector options
  const sectorOptions = () => {
    const sectors = [];
    const prefixes = ["F", "G", "I"];

    prefixes.forEach((prefix) => {
      for (let i = 1; i <= 15; i++) {
        sectors.push(`${prefix}-${i}`);
      }
    });

    return sectors;
  };

  // Detect screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        areaDropdownRef.current &&
        !areaDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        priceDropdownRef.current &&
        !priceDropdownRef.current.contains(event.target)
      ) {
        setIsPriceDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAreaDropdown = () => {
    if (isPriceDropdownOpen) setIsPriceDropdownOpen(false);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onAreaChange = (min, max) => {
    setMinArea(min);
    setMaxArea(max);
  };

  const onPriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleMinChange = (value) => {
    setMinArea(value);
    if (maxArea !== "Any" && value >= maxArea) {
      setMaxArea("Any");
    }
    onAreaChange(value, maxArea);
  };

  const handleMaxChange = (value) => {
    setMaxArea(value);
    if (value === "Any") {
      onAreaChange(minArea, "Any");
    } else {
      onAreaChange(minArea, value);
    }
  };

  const resetSelection = () => {
    setMinArea(0);
    setMaxArea("Any");
    onAreaChange(0, "Any");
  };

  const pricehandleminchange = (value) => {
    setMinPrice(value);
    if (maxPrice !== "Any" && value >= maxPrice) {
      setMaxPrice("Any");
    }
    onPriceChange(value, maxPrice);
  };

  const pricehandlemaxchnage = (value) => {
    setMaxPrice(value);
    if (value === "Any") {
      onPriceChange(minPrice, "Any");
    } else {
      onPriceChange(minPrice, value);
    }
  };

  const pricereset = () => {
    setMinPrice(0);
    setMaxPrice("Any");
    onPriceChange(0, "Any");
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="w-full">
      {activeButton === "Rent" && (
        <div className="relative">
          {isMobileView ? (
            <>
              {/* Mobile Filter Button */}
              <div className="flex justify-center mb-4">
                <button
                  className="flex items-center bg-primaryColor text-white px-4 py-2 rounded-full"
                  onClick={toggleMobileFilters}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Filters
                </button>
              </div>

              {/* Mobile Filter Drawer */}
              {showMobileFilters && (
                <div
                  ref={mobilFilterRef}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
                >
                  <div className="bg-white rounded-t-xl p-4 w-full h-[90%] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <button
                        onClick={toggleMobileFilters}
                        className="text-gray-500 p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* City */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <select
                          value={cityName}
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => setCityName(e.target.value)}
                        >
                          <option value="">Select City</option>
                          <option value="Islamabad">Islamabad</option>
                          <option value="Karachi">Karachi</option>
                          <option value="Lahore">Lahore</option>
                        </select>
                      </div>

                      {/* Sector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Sector
                        </label>
                        <select
                          value={sector}
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => setSector(e.target.value)}
                        >
                          <option value="">Select Sector</option>
                          {sectorOptions().map((sectorOption) => (
                            <option key={sectorOption} value={sectorOption}>
                              {sectorOption}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Property Type */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Property Type
                        </label>
                        <select
                          value={propertyType}
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => setPropertyType(e.target.value)}
                        >
                          <option value="">Select Type</option>
                          <option value="House">House</option>
                          <option value="Apartment">Apartment</option>
                          <option value="Villa">Villa</option>
                        </select>
                      </div>

                      {/* Bedrooms */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          className="w-full p-2 border rounded-md"
                          placeholder="Number of bedrooms"
                          value={BedRoom}
                          onChange={(e) => setBedRoom(e.target.value)}
                        />
                      </div>

                      {/* Area Range */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Area (Marla)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={minArea}
                            onChange={(e) =>
                              handleMinChange(parseInt(e.target.value) || 0)
                            }
                            className="w-1/2 p-2 border rounded-md"
                            placeholder="Min"
                          />
                          <input
                            type="text"
                            value={maxArea === "Any" ? "Any" : maxArea}
                            onChange={(e) =>
                              handleMaxChange(
                                e.target.value === "Any"
                                  ? "Any"
                                  : parseInt(e.target.value) || 0
                              )
                            }
                            className="w-1/2 p-2 border rounded-md"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Price Range (PKR)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) =>
                              pricehandleminchange(
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-1/2 p-2 border rounded-md"
                            placeholder="Min"
                          />
                          <input
                            type="text"
                            value={maxPrice === "Any" ? "Any" : maxPrice}
                            onChange={(e) =>
                              pricehandlemaxchnage(
                                e.target.value === "Any"
                                  ? "Any"
                                  : parseInt(e.target.value) || 0
                              )
                            }
                            className="w-1/2 p-2 border rounded-md"
                            placeholder="Max"
                          />
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Sort By Price
                        </label>
                        <select
                          value={sortOrder}
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => onSortChange(e.target.value)}
                        >
                          <option value="none">Default</option>
                          <option value="lowToHigh">Low to High</option>
                          <option value="highToLow">High to Low</option>
                        </select>
                      </div>

                      {/* Date Sort if available */}
                      {onDateSortChange && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Sort By Date
                          </label>
                          <select
                            value={dateSortOrder}
                            className="w-full p-2 border rounded-md"
                            onChange={(e) => onDateSortChange(e.target.value)}
                          >
                            <option value="none">Default</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex space-x-2">
                      <button
                        onClick={Search}
                        className="w-full bg-primaryColor text-white py-3 rounded-lg font-medium"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="grid items-center grid-cols-1 md:grid-cols-5 py-1 mx-auto text-sm tracking-wide border-2 border-gray-700 rounded-full w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%]">
              <div className="flex flex-col items-center px-2 md:px-4 h-16 md:h-20 justify-center md:border-r-2 md:border-gray-500">
                <p>City</p>
                <select
                  value={cityName}
                  className="text-center focus:outline-none"
                  onChange={(e) => setCityName(e.target.value)}
                >
                  <option value="">Select City</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Lahore">Lahore</option>
                </select>
              </div>

              <div className="flex flex-col items-center px-2 md:px-4 h-16 md:h-20 justify-center md:border-r-2 md:border-gray-500">
                <p>Sector</p>
                <select
                  value={sector}
                  className="w-24 text-center focus:outline-none"
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">Select Sector</option>
                  {sectorOptions().map((sectorOption) => (
                    <option key={sectorOption} value={sectorOption}>
                      {sectorOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center px-2 md:px-4 h-16 md:h-20 justify-center md:border-r-2 md:border-gray-500">
                <p>Property Type</p>
                <select
                  value={propertyType}
                  className="w-24 text-center focus:outline-none"
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="House">House</option>
                  <option value="Marla">Apartment</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>

              <div className="flex flex-col items-center px-2 md:px-4 h-16 md:h-20 justify-center md:border-r-2 md:border-gray-500">
                <button
                  onClick={toggleAdvancedFilters}
                  className="flex items-center justify-center h-full space-x-1 text-gray-800 hover:text-blue-600 transition-colors"
                >
                  <span className="font-medium">Advanced Filters</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className={`transition-transform duration-300 ${
                      showAdvancedFilters ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-center px-2 md:px-4 h-16 md:h-20">
                <button className="flex justify-center w-full" onClick={Search}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ fill: "rgba(0, 0, 0, 1)" }}
                  >
                    <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243-5-5 5z"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Advanced Filters Panel (visible on both mobile and desktop when toggled) */}
          {!isMobileView && showAdvancedFilters && (
            <div
              ref={advancedFilterRef}
              className="absolute z-20 mt-2 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] left-[50%] transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-lg shadow-lg py-4 px-4 sm:px-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Area Filter */}
                <div className="relative" ref={areaDropdownRef}>
                  <h2 className="font-medium mb-2">Area (Marla)</h2>
                  <div
                    className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-blue-500"
                    onClick={toggleAreaDropdown}
                  >
                    <p>
                      {minArea} to {maxArea}
                    </p>
                    <span className="text-lg">
                      {isDropdownOpen ? "\u25B2" : "\u25BC"}
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-16 left-0 w-64 bg-white shadow-lg border rounded-lg z-10 p-3">
                      <p className="text-blue-500 text-sm cursor-pointer mb-2 hover:underline">
                        Area in Marla
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            MIN:
                          </p>
                          <input
                            type="number"
                            value={minArea}
                            onChange={(e) =>
                              handleMinChange(parseInt(e.target.value) || 0)
                            }
                            className="w-full p-1 border rounded text-center"
                          />
                          <div className="max-h-24 overflow-y-auto mt-1 border rounded">
                            {areaOptions.map((area) => (
                              <div
                                key={area}
                                onClick={() => handleMinChange(area)}
                                className={`p-1 text-center cursor-pointer hover:bg-gray-200 ${
                                  minArea === area ? "bg-blue-200" : ""
                                }`}
                              >
                                {area}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            MAX:
                          </p>
                          <input
                            type="text"
                            value={maxArea === "Any" ? "Any" : maxArea}
                            readOnly
                            className="w-full p-1 border rounded text-center"
                          />
                          <div className="max-h-24 overflow-y-auto mt-1 border rounded">
                            <div
                              onClick={() => handleMaxChange("Any")}
                              className={`p-1 text-center cursor-pointer hover:bg-gray-200 ${
                                maxArea === "Any" ? "bg-blue-200" : ""
                              }`}
                            >
                              Any
                            </div>
                            {areaOptions
                              .filter((area) => area >= minArea)
                              .map((area) => (
                                <div
                                  key={area}
                                  onClick={() => handleMaxChange(area)}
                                  className={`p-1 text-center cursor-pointer hover:bg-gray-200 ${
                                    maxArea === area ? "bg-blue-200" : ""
                                  }`}
                                >
                                  {area}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>

                      <button
                        className="mt-3 text-sm text-red-500 hover:underline"
                        onClick={resetSelection}
                      >
                        Reset
                      </button>

                      <button
                        className="mt-2 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>

                {/* Bedroom Filter */}
                <div>
                  <h2 className="font-medium mb-2">Bedrooms</h2>
                  <div className="flex items-center border rounded-md p-2">
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="w-full focus:outline-none"
                      placeholder="Number of bedrooms"
                      value={BedRoom}
                      onChange={(e) => setBedRoom(e.target.value)}
                      onKeyDown={(e) => {
                        // Allow: backspace, delete, tab, escape, enter, and arrow keys
                        if (
                          [
                            "Backspace",
                            "Delete",
                            "Tab",
                            "Escape",
                            "Enter",
                            "ArrowLeft",
                            "ArrowRight",
                          ].includes(e.key)
                        ) {
                          return;
                        }
                        // Prevent non-numeric input
                        if (!/^\d$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="relative" ref={priceDropdownRef}>
                  <h2 className="font-medium mb-2">Price Range (PKR)</h2>
                  <div
                    className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-blue-500"
                    onClick={() => {
                      if (isDropdownOpen) setIsDropdownOpen(false);
                      setIsPriceDropdownOpen(!isPriceDropdownOpen);
                    }}
                  >
                    <p>
                      {minPrice.toLocaleString()} to{" "}
                      {maxPrice === "Any" ? "Any" : maxPrice.toLocaleString()}
                    </p>
                    <span className="text-lg">
                      {isPriceDropdownOpen ? "\u25B2" : "\u25BC"}
                    </span>
                  </div>

                  {isPriceDropdownOpen && (
                    <div className="absolute top-16 left-0 w-72 bg-white shadow-lg border rounded-lg z-10 p-4">
                      <p className="text-blue-500 text-sm cursor-pointer mb-3 hover:underline">
                        PKR
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            MIN:
                          </p>
                          <input
                            type="number"
                            value={minPrice}
                            onChange={(e) =>
                              pricehandleminchange(
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-full p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          <div className="max-h-24 overflow-y-auto mt-1 border rounded">
                            {priceOptions.map((price) => (
                              <div
                                key={price}
                                onClick={() => pricehandleminchange(price)}
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
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            MAX:
                          </p>
                          <input
                            type="text"
                            value={
                              maxPrice === "Any"
                                ? "Any"
                                : maxPrice.toLocaleString()
                            }
                            readOnly
                            className="w-full p-2 border rounded text-center bg-gray-50 focus:outline-none"
                          />
                          <div className="max-h-24 overflow-y-auto mt-1 border rounded">
                            <div
                              onClick={() => pricehandlemaxchnage("Any")}
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
                                  onClick={() => pricehandlemaxchnage(price)}
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
                          onClick={pricereset}
                        >
                          Reset
                        </button>

                        <button
                          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                          onClick={() => setIsPriceDropdownOpen(false)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sort Price Filter */}
                <div>
                  <h2 className="font-medium mb-2">Sort By Price</h2>
                  <select
                    value={sortOrder}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onChange={(e) => onSortChange(e.target.value)}
                  >
                    <option value="none">Default</option>
                    <option value="lowToHigh">Low to High</option>
                    <option value="highToLow">High to Low</option>
                  </select>
                </div>

                {/* Sort By Date Filter */}
                {onDateSortChange && (
                  <div>
                    <h2 className="font-medium mb-2">Sort By Date</h2>
                    <select
                      value={dateSortOrder}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onChange={(e) => onDateSortChange(e.target.value)}
                    >
                      <option value="none">Default</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  className="bg-[#C93827] text-white py-2 px-8 rounded-full hover:bg-opacity-90 transition-colors"
                  onClick={toggleAdvancedFilters}
                >
                  Close Advanced Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeButton === "Service" && (
        <div className="flex items-center w-full sm:w-[80%] md:w-[60%] py-1 mx-auto text-sm px-4 sm:px-8 tracking-wide border-2 border-gray-600 rounded-full">
          <div className="flex flex-col w-full text-center">
            <input
              type="text"
              value={title}
              placeholder="Search Service"
              className="w-full py-2 bg-transparent focus:outline-none"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <button onClick={ServiceSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243-5-5 5z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
