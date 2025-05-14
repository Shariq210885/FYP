import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import ServiceCard from "../../../components/ServiceCard/ServiceCard";
import { getAllProperty, SearchProperty } from "../../../api/property/property";
import { getAllServices, SearchService } from "../../../api/service/Service";
import Filters from "../../../components/Filter";
import Loading from "../../../components/Loading";

function Home() {
  const [data, setData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyDataFetched, setPropertyDataFetched] = useState(false);
  const [serviceDataFetched, setServiceDataFetched] = useState(false);
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
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [dateSortOrder, setDateSortOrder] = useState("none"); // Add date sort state

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(Infinity);
    setMinArea(0);
    setMaxArea(Infinity);
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
    setCurrentPage(1);

    if (button === "Rent" && !propertyDataFetched) {
      setIsLoading(true);
    } else if (button === "Service" && !serviceDataFetched) {
      setIsLoading(true);
    }
  };

  const handleServiceClick = (id) => {
    navigate(`/service-detail/${id}`);
  };

  useEffect(() => {
    const getAll = async () => {
      setIsLoading(true);
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
        setPropertyDataFetched(true);
        setIsLoading(false);
      }
    };
    getAll();
  }, []);

  useEffect(() => {
    async function getAllService() {
      if (activeButton === "Service") {
        setIsLoading(true);
      }

      try {
        const response = await getAllServices();
        if (response.status === 200) {
          setServiceData(response.data.data);
        } else {
          setServiceData([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServiceData([]);
      } finally {
        setServiceDataFetched(true);
        if (activeButton === "Service") {
          setIsLoading(false);
        }
      }
    }

    if (!serviceDataFetched) {
      getAllService();
    }
  }, [activeButton, serviceDataFetched]);

  async function Search() {
    setIsLoading(true);
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
      setPropertyDataFetched(true);
      setIsLoading(false);
    }
  }

  async function ServiceSearch() {
    setIsLoading(true);
    try {
      const response = await SearchService({ title: title });
      if (response.status === 200) {
        setServiceData(response.data.data);
      } else {
        setServiceData([]);
      }
    } catch (error) {
      console.error("Error searching services:", error);
      setServiceData([]);
    } finally {
      setServiceDataFetched(true);
      setIsLoading(false);
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
    if (order === "lowToHigh") {
      sortedData.sort((a, b) => a.rentPrice - b.rentPrice);
    } else if (order === "highToLow") {
      sortedData.sort((a, b) => b.rentPrice - a.rentPrice);
    }
    setData(sortedData);
  };

  const currentItems = activeButton === "Rent" ? data : serviceData;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDisplayedItems = currentItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(currentItems.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const showPropertyData = propertyDataFetched && data.length > 0;
  const showServiceData = serviceDataFetched && serviceData.length > 0;
  const showNoPropertyMessage = propertyDataFetched && data.length === 0;
  const showNoServiceMessage = serviceDataFetched && serviceData.length === 0;

  return (
    <div className="flex justify-center bg-white pt-28 md:pt-32 px-4 sm:px-0">
      <div className="w-full">
        <div className="flex items-center justify-center w-full pb-4 space-x-4">
          <button
            className={`px-4 sm:px-8 py-1 rounded-full ${
              activeButton === "Rent"
                ? "bg-primaryColor text-white"
                : "border border-primaryColor text-primaryColor"
            }`}
            onClick={() => handleButtonClick("Rent")}
          >
            Rent
          </button>
          <button
            className={`px-4 sm:px-8 py-1 rounded-full ${
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
          dateSortOrder={dateSortOrder}
          onDateSortChange={handleDateSortChange}
        />

        {isLoading ? (
          <div className="h-[60vh]">
            <Loading />
          </div>
        ) : activeButton === "Rent" ? (
          showPropertyData ? (
            <div className="mt-6 sm:mt-10 w-full sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {currentDisplayedItems.map((property, index) => (
                  <PropertyCard
                    key={index}
                    property={property}
                    handleCardClick={() => handleCardClick(property._id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center my-6 sm:my-8">
                  <nav className="flex flex-wrap items-center justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-primaryColor text-white hover:bg-primaryColor/90"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex flex-wrap items-center space-x-1 max-w-[200px] overflow-x-auto">
                      {[...Array(totalPages).keys()]
                        .filter((number) => {
                          if (window.innerWidth < 640) {
                            return Math.abs(number + 1 - currentPage) <= 1;
                          }
                          return true;
                        })
                        .map((number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number + 1)}
                            className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-sm ${
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
                      className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-primaryColor text-white hover:bg-primaryColor/90"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}

              <div className="text-center text-xs sm:text-sm text-gray-500">
                Showing {indexOfFirstItem + 1}-
                {Math.min(indexOfLastItem, data.length)} of {data.length}{" "}
                properties
              </div>
            </div>
          ) : showNoPropertyMessage ? (
            <div className="flex items-center justify-center h-[60vh] text-sm text-gray-500">
              No Property found
            </div>
          ) : (
            <div className="h-[60vh]">
              <Loading />
            </div>
          )
        ) : showServiceData ? (
          <div className="mt-6 sm:mt-10 w-full sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {currentDisplayedItems.map((service, index) => (
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

            {totalPages > 1 && (
              <div className="flex items-center justify-center my-6 sm:my-8">
                <nav className="flex flex-wrap items-center justify-center space-x-1 sm:space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primaryColor text-white hover:bg-primaryColor/90"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex flex-wrap items-center space-x-1 max-w-[200px] overflow-x-auto">
                    {[...Array(totalPages).keys()]
                      .filter((number) => {
                        if (window.innerWidth < 640) {
                          return Math.abs(number + 1 - currentPage) <= 1;
                        }
                        return true;
                      })
                      .map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number + 1)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-sm ${
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
                    className={`px-2 sm:px-3 py-1 rounded-md text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primaryColor text-white hover:bg-primaryColor/90"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}

            <div className="text-center text-xs sm:text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, serviceData.length)} of{" "}
              {serviceData.length} services
            </div>
          </div>
        ) : showNoServiceMessage ? (
          <div className="flex items-center justify-center h-[60vh] text-sm text-gray-500">
            No Service found
          </div>
        ) : (
          <div className="h-[60vh]">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
