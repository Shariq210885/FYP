import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import {
  getAllPayingGuest,
  SearchPayinGuest,
} from "../../../api/payingGuest/payingGuest";
import Filters from "../../../components/Filter";
import Loading from "../../../components/Loading";

function AllPayingGuest() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
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
  const [sortOrder, setSortOrder] = useState("none"); // Add this state
  const [dateSortOrder, setDateSortOrder] = useState("none"); // Add date sort state

  const handleCardClick = (id) => {
    navigate(`/payingguest-detail/${id}`);
  };

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

  const handleDateSortChange = (order) => {
    setDateSortOrder(order);
    let sortedData = [...data];
    if (order === "newest") {
      sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (order === "oldest") {
      sortedData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setData(sortedData);
  };

  useEffect(() => {
    const getAll = async () => {
      setIsLoading(true); // Set loading to true when fetching
      try {
        const response = await getAllPayingGuest();
        if (response.status === 200) {
          const filteredData = response.data.data.filter(
            (property) => !property.isRented
          );
          setData(filteredData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching paying guests:", error);
        setData([]);
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };
    getAll();
  }, []);

  async function Search() {
    setIsLoading(true); // Set loading to true when searching
    try {
      const response = await SearchPayinGuest({
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
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error searching paying guests:", error);
      setData([]);
    } finally {
      setIsLoading(false); // Set loading to false when done
    }
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-12 lg:pb-16">
      <h2 className="my-2 md:my-4 w-[92%] md:w-[85%] lg:w-[80%] mx-auto text-xl md:text-2xl lg:text-3xl font-bold">
        All Paying Guests
      </h2>

      <div className="flex justify-center bg-white">
        <div className="w-full mt-4 md:mt-6 lg:mt-8">
          <div className="px-4 md:px-8 lg:px-12">
            <Filters
              activeButton="Rent"
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
              minArea={minArea}
              maxArea={maxArea}
              minPrice={minPrice}
              maxPrice={maxPrice}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              isPriceDropdownOpen={isPriceDropdownOpen}
              setIsPriceDropdownOpen={setIsPriceDropdownOpen}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              dateSortOrder={dateSortOrder}
              onDateSortChange={handleDateSortChange}
            />
          </div>

          {isLoading ? (
            <div className="h-[40vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center">
              <Loading />
            </div>
          ) : data.length > 0 ? (
            <div className="mt-6 md:mt-8 lg:mt-10 w-[92%] md:w-[85%] lg:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {data.map((property, index) => (
                <div
                  key={index}
                  className="transition-transform hover:scale-[1.02] duration-200"
                >
                  <PropertyCard
                    property={property}
                    handleCardClick={() => handleCardClick(property._id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[40vh] md:h-[50vh] lg:h-[60vh] text-sm md:text-base lg:text-lg text-gray-500">
              No Property found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllPayingGuest;
