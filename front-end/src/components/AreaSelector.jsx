import React, { useState } from "react";

const AreaSelector = ({ onAreaChange }) => {
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState("Any");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const areaOptions = [0, 2, 3, 5, 8, 10, 15, 20, 25, 30, 50, 100];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

  return (
    <div className="relative text-center border-r-0 border-gray-0">
      <div
        className="flex w-full items-center justify-between p-0 cursor-pointer bg-transparent rounded"
        onClick={toggleDropdown}
      >
        <div>
          <p className="text-xs text-gray-500">AREA (MARLA)</p>
          <p className="font-medium">
            {minArea} to {maxArea}
          </p>
        </div>
        <span className="text-lg">{isDropdownOpen ? "\u25B2" : "\u25BC"}</span>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-16 left-0 w-64 bg-white shadow-lg border rounded-lg z-10 p-3">
          <p className="text-blue-500 text-sm cursor-pointer mb-2 hover:underline">
            Area in Marla
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-1">MIN:</p>
              <input
                type="number"
                value={minArea}
                onChange={(e) => handleMinChange(parseInt(e.target.value) || 0)}
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
              <p className="text-xs font-semibold text-gray-600 mb-1">MAX:</p>
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
  );
};

export default AreaSelector;
