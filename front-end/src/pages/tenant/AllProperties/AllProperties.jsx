import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { getAllProperty, SearchProperty } from "../../../api/property/property";
import { useEffect, useState } from "react";
import Filters from "../../../components/Filter";
import Loading from "../../../components/Loading";

function AllProperties() {
  const [data, setData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
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
  const [sortOrder, setSortOrder] = useState("none"); // Add this state
  const [dateSortOrder, setDateSortOrder] = useState("none"); // Add date sort state
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(50);

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

  useEffect(() => {
    const getAll = async () => {
      setIsLoading(true); // Set loading to true when fetching
      try {
        const response = await getAllProperty();
        if (response.status === 200) {
          const filteredData = response.data.data.filter(
            (property) => !property.isRented
          );
          setData(filteredData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
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
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error searching properties:", error);
      setData([]);
    } finally {
      setIsLoading(false); // Set loading to false when done
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

  // Get current properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = data.slice(indexOfFirstProperty, indexOfLastProperty);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(data.length / propertiesPerPage);

  // Next and previous page functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            dateSortOrder={dateSortOrder}
            onDateSortChange={handleDateSortChange}
          />

          {isLoading ? (
            <div className="h-[60vh]">
              <Loading />
            </div>
          ) : data.length > 0 ? (
            <div className="mt-10 w-[80%] mx-auto">
              <div className="grid grid-cols-4 gap-6">
                {currentProperties.map((property, index) => (
                  <PropertyCard
                    key={index}
                    property={property}
                    handleCardClick={() => handleCardClick(property._id)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center my-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primaryColor text-white hover:bg-primaryColor/90"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {/* Show page numbers */}
                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === number + 1
                            ? "bg-primaryColor text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primaryColor text-white hover:bg-primaryColor/90"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>

              <div className="text-center text-gray-500">
                Showing {indexOfFirstProperty + 1}-
                {Math.min(indexOfLastProperty, data.length)} of {data.length} properties
              </div>
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
