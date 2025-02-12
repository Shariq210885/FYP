import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import ServiceCard from "../../../components/ServiceCard/ServiceCard";
import { getAllProperty, SearchProperty } from "../../../api/property/property";
import { getAllServices, SearchService } from "../../../api/service/Service";
import Filters from "../../../components/Filter";

function Home() {
  const [data, setData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("Rent");
  const [cityName, setCityName] = useState("");
  const [sector, setSector] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("Any");
  const [BedRoom, setBedRoom] = useState(null);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState("Any");
  const [title, setTitle] = useState("");
  const [sortOrder, setSortOrder] = useState('none'); // Add this state
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

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
      sector: sector || null,
      bedRooms: BedRoom || 0,
      city: cityName || null,
      propertyType: propertyType || null,
      priceMin: minPrice || 0,
      priceMax: maxPrice === "Any" ? null : maxPrice,
      areaMin: minArea || 0,
      areaMax: maxArea === "Any" ? null : maxArea,
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

  const handleSortChange = (order) => {
    setSortOrder(order);
    let sortedData = [...data];
    if (order === 'lowToHigh') {
      sortedData.sort((a, b) => a.rentPrice - b.rentPrice);
    } else if (order === 'highToLow') {
      sortedData.sort((a, b) => b.rentPrice - a.rentPrice);
    }
    setData(sortedData);
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
        <Filters
          activeButton={activeButton}
          setCityName={setCityName}
          cityName={cityName}
          setSector={setSector}
          sector={sector}
          setPropertyType={setPropertyType}
          propertyType={propertyType}
          setMinArea={setMinArea}
          setMaxArea={setMaxArea}
          setBedRoom={setBedRoom}
          BedRoom={BedRoom}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          Search={Search}
          ServiceSearch={ServiceSearch}
          setTitle={setTitle}
          title={title}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          isPriceDropdownOpen={isPriceDropdownOpen}
          setIsPriceDropdownOpen={setIsPriceDropdownOpen}
          minArea={minArea}
          maxArea={maxArea}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

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
