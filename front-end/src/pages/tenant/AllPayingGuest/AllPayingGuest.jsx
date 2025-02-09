import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import { getAllPayingGuest, SearchPayinGuest } from "../../../api/payingGuest/payingGuest";
import AreaSelector from "../../../components/AreaSelector";
import PriceSelector from "../../../components/PriceSelector";

const CITIES = [
  "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot",
  "Karachi", "Hyderabad", "Sukkur", "Larkana",
  "Peshawar", "Mardan", "Abbottabad", "Swat",
  "Quetta", "Gwadar", "Turbat",
  "Islamabad"
];

const ISLAMABAD_SECTORS = [
  "E-7", "E-8", "E-9", "E-10", "E-11",
  "F-6", "F-7", "F-8", "F-9", "F-10", "F-11",
  "G-6", "G-7", "G-8", "G-9", "G-10", "G-11",
  "H-8", "H-9", "H-10", "H-11",
  "I-8", "I-9", "I-10", "I-11"
];

const PROPERTY_TYPES = ["House", "Apartment", "Villa"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

function AllPayingGuest() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [sector, setSector] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minArea, setMinArea] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxArea, setMaxArea] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [BedRoom, setBedRoom] = useState(null);
  const handleCardClick = (id) => {
    navigate(`/payingguest-detail/${id}`);
  };
  useEffect(() => {
    const getAll = async () => {
      const response = await getAllPayingGuest();
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
    const response = await SearchPayinGuest({sector:sector,bedRooms:BedRoom,city:cityName,propertyType:propertyType,priceMin:minPrice,priceMax:maxPrice,areaMin:minArea,areaMax:maxArea})
if (response.status===200) {
  const filteredData = response.data.data.filter(property => !property.isRented);
  setData(filteredData);
} else if (response.status === 204) {
  setData([])
}
    
  }
  return (
    <div className="pt-28">
      <h2 className="my-2 w-[80%] mx-auto text-3xl font-bold">
        All Paying Guests
      </h2>

      <div className="flex justify-center bg-white">
        <div className="w-full mt-8">
          <div className="grid items-center grid-cols-7 py-1 mx-auto text-sm tracking-wide border-2 border-gray-700 rounded-full w-[80%]">
            <div className="flex flex-col pl-3 pr-1 text-center border-r-2 border-gray-500 w-28">
              <p>City</p>
              <select
                value={cityName}
                className="text-center focus:outline-none"
                onChange={(e) => setCityName(e.target.value)}
              >
                <option value="">Select City</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="text-center border-r-2 border-gray-500 w-28">
              <p>Sector</p>
              {cityName === "Islamabad" ? (
                <select
                  value={sector}
                  className="w-24 text-center focus:outline-none"
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">Select Sector</option>
                  {ISLAMABAD_SECTORS.map(sect => (
                    <option key={sect} value={sect}>{sect}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter Sector"
                  value={sector}
                  className="w-24 text-center focus:outline-none"
                  onChange={(e) => setSector(e.target.value)}
                />
              )}
            </div>

            <div className="text-center border-r-2 border-gray-500 w-28">
              <p>Property Type</p>
              <select
                value={propertyType}
                className="w-24 text-center focus:outline-none"
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Select Type</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
              <select
                value={BedRoom || ""}
                className="w-24 text-center focus:outline-none"
                onChange={(e) => setBedRoom(e.target.value)}
              >
                <option value="">Any</option>
                {BEDROOM_OPTIONS.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
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
          {data.length > 0 ?
            <div className="mt-10 w-[80%] mx-auto grid grid-cols-4 gap-6">
              {data.map((property, index) => (
                <PropertyCard
                  key={index}
                  property={property}
                  handleCardClick={() => handleCardClick(property._id)}
                />
              ))}
        </div>:
              <div className="flex items-center justify-center h-screen text-sm text-gray-500 ">No Property found</div>
          }
        </div>
      </div>
    </div>
  );
}

export default AllPayingGuest;
