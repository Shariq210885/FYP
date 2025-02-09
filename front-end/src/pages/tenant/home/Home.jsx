import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import ServiceCard from "../../../components/ServiceCard/ServiceCard";
import { getAllProperty, SearchProperty } from "../../../api/property/property";
import { getAllServices, SearchService } from "../../../api/service/Service";
import AreaSelector from "../../../components/AreaSelector";
import PriceSelector from "../../../components/PriceSelector";

function Home() {
  const [data, setData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Rent");
  const [cityName, setCityName] = useState("");
  const [sector, setSector] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minArea, setMinArea] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxArea, setMaxArea] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [BedRoom, setBedRoom] = useState(null);
  const [title, setTitle] = useState("");
  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(Infinity); // Or a large number like 1000000
    setMinArea(0);
    setMaxArea(Infinity); // Or a large number like 10000
    setCityName("");
    setBedRoom(0);
    setSector("");
    setPropertyType("");
  };

  const handleCardClick = (id) => {
    navigate(`/property-detail/${id}`);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const handleServiceClick = (id) => {
    navigate(`/service-detail/${id}`);
  };

  useEffect(() => {
    const getAll = async () => {
      const response = await getAllProperty();
      if (response.status === 200) {
        const filteredData = response.data.data.filter(
          (property) => !property.isRented
        );
        setData(filteredData);
      } else {
        setData([]);
      }
    };
    getAll();
  }, []);

  useEffect(() => {
    async function getAllService() {
      const response = await getAllServices();
      if (response.status === 200) {
        setServiceData(response.data.data);
      } else {
        setServiceData([]);
      }
    }
    getAllService();
  }, []);

  async function Search() {
    const response = await SearchProperty({
      sector: sector,
      bedRooms: BedRoom,
      city: cityName,
      propertyType: propertyType,
      priceMin: minPrice,
      priceMax: maxPrice,
      areaMin: minArea,
      areaMax: maxArea,
    });
    if (response.status === 200) {
      const filteredData = response.data.data.filter(
        (property) => !property.isRented
      );
      setData(filteredData);
    } else if (response.status === 204) {
      setData([]);
    }
  }

  async function ServiceSearch() {
    const response = await SearchService({ title: title });
    if (response.status === 200) {
      setServiceData(response.data.data);
    } else if (response.status === 204) {
      setServiceData([]);
    }
  }

  const calculateTotalPrice = (service) => {
    const { subServices } = service;
    if (!Array.isArray(subServices)) return 0;
    return subServices.reduce(
      (sum, subService) => sum + (subService.price || 0),
      0
    );
  };

  return (
    <div className="flex justify-center bg-white pt-28">
      <div className="w-full">
        <div className="flex items-center justify-center w-full pb-4 space-x-4">
          <button
            className={`px-8 py-1 rounded-full ${
              activeButton === "Rent"
                ? "bg-primaryColor text-white"
                : "border border-primaryColor text-primaryColor"
            }`}
            onClick={() => handleButtonClick("Rent")}
          >
            Rent
          </button>
          <button
            className={`px-8 py-1 rounded-full ${
              activeButton === "Service"
                ? "bg-primaryColor text-white"
                : "border border-primaryColor text-primaryColor"
            }`}
            onClick={() => handleButtonClick("Service")}
          >
            Service
          </button>
        </div>

        {activeButton === "Rent" && (
          <div className="grid items-center grid-cols-7 py-1 mx-auto text-sm tracking-wide border-2 border-gray-700 rounded-full w-[80%]">
            <div className="flex flex-col pl-3 pr-1 text-center border-r-2 border-gray-500 w-28">
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

            <div className="text-center border-r-2 border-gray-500 w-28">
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

            <div className="text-center border-r-2 border-gray-500 w-28">
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

            <div className="text-center border-r-2 border-gray-500 w-28">
              <h2>Select Area</h2>
              <AreaSelector
                onAreaChange={(min, max) => {
                  setMinArea(min);
                  setMaxArea(max);
                }}
              />
            </div>

            <div className="text-center border-r-2 border-gray-500 w-28">
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

            <div className="text-center border-r-2 border-gray-500 w-28">
              <h2>Price Range</h2>
              <PriceSelector
                onPriceChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
            </div>

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

        {activeButton === "Rent" &&
          (data.length > 0 ? (
            <div className="mt-10 w-[80%] mx-auto grid grid-cols-4 gap-6">
              {data.map((property, index) => (
                <PropertyCard
                  key={index}
                  property={property}
                  handleCardClick={() => handleCardClick(property._id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen text-sm text-gray-500">
              No Property found
            </div>
          ))}

        {activeButton === "Service" &&
          (serviceData.length > 0 ? (
            <div className="mt-10 w-[80%] mx-auto grid grid-cols-4 gap-6">
              {serviceData.map((service, index) => (
                <ServiceCard
                  key={index}
                  imageUrl={service.thumbnail}
                  title={service.title}
                  description={service.description}
                  price={calculateTotalPrice(service)}
                  onClick={() => handleServiceClick(service._id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-screen text-sm text-gray-500">
              No Service found
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
