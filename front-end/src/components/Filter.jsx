import { useEffect, useRef } from 'react';

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
}) {
  const priceOptions = [1000, 5000, 10000, 20000, 50000, 100000]; // Sample price options
  const areaOptions = [0, 2, 3, 5, 8, 10, 15, 20, 25, 30, 50, 100];

  const areaDropdownRef = useRef(null);
  const priceDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setIsPriceDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    console.log("Hellohello");
    if (maxArea !== "Any" && value >= maxArea) {
      setMaxArea("Any");
    }
    onAreaChange(value, maxArea);
  };

  const handleMaxChange = (value) => {
    setMaxArea(value);
    if (value === "Any") {
      onAreaChange(minArea, Infinity);
    } else {
      onAreaChange(minArea, value);
    }
  };

  const resetSelection = () => {
    console.log("Monkey");
    setMinArea(0);
    setMaxArea("Any");
    onAreaChange(0, Infinity);
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
      onPriceChange(minPrice, Infinity);
    } else {
      onPriceChange(minPrice, value);
    }
  };

  const pricereset = () => {
    setMinPrice(0);
    setMaxPrice("Any");
    onPriceChange(0, Infinity);
  };

  return (
    <div className="w-full">
      {activeButton === "Rent" && (
        <div className="grid items-center grid-cols-7 py-1 mx-auto text-sm tracking-wide border-2 border-gray-700 rounded-full w-[80%]">
          <div className="flex flex-col items-center px-4 h-20 justify-center border-r-2 border-gray-500">
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

          <div className="flex flex-col items-center px-4 h-20 justify-center border-r-2 border-gray-500">
            <p>Sector</p>
            <select
              value={sector}
              className="w-24 text-center focus:outline-none"
              onChange={(e) => setSector(e.target.value)}
            >
              <option value="">Select Sector</option>
              {[...Array(10).keys()].map((num) => (
                <>
                  <option key={`F${num + 1}`} value={`F-${num + 1}`}>
                    F-{num + 1}
                  </option>
                  <option key={`G${num + 1}`} value={`G-${num + 1}`}>
                    G-{num + 1}
                  </option>
                  <option key={`I${num + 1}`} value={`I-${num + 1}`}>
                    I-{num + 1}
                  </option>
                </>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center px-4 h-20 justify-center border-r-2 border-gray-500">
            <p>Property Type</p>
            <select
              value={propertyType}
              className="w-24 text-center focus:outline-none"
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </div>

          <div className="flex flex-col items-center px-4 h-20 justify-center border-r-2 border-gray-500">
            <h2>Select Area</h2>
            <div className="relative w-full text-center" ref={areaDropdownRef}>
              <div
                className="flex items-center justify-between p-2 cursor-pointer"
                onClick={toggleAreaDropdown}
              >
                <div>
                  <p className="text-xs text-gray-500">AREA (MARLA)</p>
                  <p className="font-medium">
                    {minArea} to {maxArea}
                  </p>
                </div>
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
          </div>

          <div className="flex flex-col items-center px-4 h-20 justify-center border-r-2 border-gray-500">
            <p>Bedroom</p>
            <input
              type="number"
              min="0"
              max="10"
              className="w-12 text-center focus:outline-none"
              placeholder="0"
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

          <div className="flex flex-col items-center px-4 h-20 justify-center border-r-2 border-gray-500">
            <h2>Price Range</h2>
            <div className="relative w-full text-center" ref={priceDropdownRef}>
              <div
                className="flex items-center justify-between p-2 cursor-pointer"
                onClick={() => {
                  if (isDropdownOpen) setIsDropdownOpen(false);
                  setIsPriceDropdownOpen(!isPriceDropdownOpen);
                }}
              >
                <div className="text-left">
                  <p className="text-xs text-gray-500">PRICE (PKR)</p>
                  <p className="font-medium">
                    {minPrice.toLocaleString()} to{" "}
                    {maxPrice === "Any" ? "Any" : maxPrice.toLocaleString()}
                  </p>
                </div>
                <span className="text-lg ml-2">
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
                          pricehandleminchange(parseInt(e.target.value) || 0)
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
                          maxPrice === "Any" ? "Any" : maxPrice.toLocaleString()
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
          </div>

          <div className="flex items-center justify-center px-4 h-20">
            <button className="flex justify-center w-full" onClick={Search}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ fill: "rgba(0, 0, 0, 1)" }}
              >
                <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {activeButton === "Service" && (
        <div className="flex items-center w-[60%] py-1 mx-auto text-sm px-8 tracking-wide border-2 border-gray-600 rounded-full">
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
              <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
