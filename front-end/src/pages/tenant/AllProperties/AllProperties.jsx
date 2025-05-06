import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { getAllProperty, SearchProperty } from "../../../api/property/property";
import { useEffect, useState } from "react";
import Filters from "../../../components/Filter";

function AllProperties() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [sector, setSector] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState("Any");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("Any");
  const [BedRoom, setBedRoom] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [title, setTitle] = useState("");

  const [sortOrder, setSortOrder] = useState("none"); // Add this state

  const [activeButton, setActiveButton] = useState("Rent");

  const handleCardClick = (id) => {
    navigate(`/property-detail/${id}`);
  };

  useEffect(() => {
    const getAll = async () => {
      const response = await getAllProperty();
      console.log(response)
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

  const handleSortChange = (order) => {
    setSortOrder(order);
    let sortedData = [...data];
    if (order === "lowToHigh") {
      sortedData.sort((a, b) => a.rentPrice - b.rentPrice);
    } else if (order === "highToLow") {
      sortedData.sort((a, b) => b.rentPrice - a.rentPrice);
    }
    setData(sortedData);
  };

  async function ServiceSearch() {
    const response = await SearchService({ title: title });
    if (response.status === 200) {
      setServiceData(response.data.data);
    } else if (response.status === 204) {
      setServiceData([]);
    }
  }

  return (
    <div className="pt-28">
      <h2 className="my-2 w-[80%] mx-auto text-3xl font-bold">
        All Properties
      </h2>

      <div className="flex justify-center bg-white">
        <div className="w-full mt-8">
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

          {data.length > 0 ? (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AllProperties;
