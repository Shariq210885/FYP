import { useNavigate } from "react-router-dom";
import ServiceCard from "../../../components/ServiceCard/ServiceCard";
import { useEffect, useState } from "react";
import { getAllServices, SearchService } from "../../../api/service/Service";
import Loading from "../../../components/Loading";

function AllServices() {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");

  const handleServiceClick = (id) => {
    navigate(`/service-detail/${id}`);
  };

  useEffect(() => {
    async function getAllService() {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    }
    getAllService();
  }, []);

  const calculateTotalPrice = (service) => {
    const { subServices } = service;
  
    // Ensure subServices exists and is an array
    if (!Array.isArray(subServices)) return 0;
  
    // Calculate total price
    const totalPrice = subServices.reduce((sum, subService) => {
      return sum + (subService.price || 0); // Default to 0 if price is missing
    }, 0);
  
    return totalPrice;
  };

  async function ServiceSearch() {
    setIsLoading(true);
    try {
      const response = await SearchService({ title: title });

      if (response.status === 200) {
        setServiceData(response.data.data);
      } else if (response.status === 204) {
        setServiceData([]);
      }
    } catch (error) {
      console.error("Error searching services:", error);
      setServiceData([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pt-28">
      <h2 className="my-2 w-[80%] mx-auto text-3xl font-bold">All Services</h2>

      <div className="flex justify-center bg-white ">
        <div className="w-full mt-8">
          <div className="flex items-center w-[80%] py-1 mx-auto text-sm px-8 tracking-wide border-2 border-gray-600 rounded-full ">
            <div className="flex flex-col w-full text-center ">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search Service"
                className="w-full py-2 bg-transparent focus:outline-none"
              />
            </div>
            <button className="" onClick={ServiceSearch}>
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
          
          {isLoading ? (
            <div className="h-[60vh]">
              <Loading />
            </div>
          ) : serviceData.length > 0 ? (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default AllServices;
