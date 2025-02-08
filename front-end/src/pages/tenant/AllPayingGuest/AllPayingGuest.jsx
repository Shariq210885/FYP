import { useNavigate } from "react-router-dom";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import { useEffect, useState } from "react";
import { getAllPayingGuest, SearchPayinGuest } from "../../../api/payingGuest/payingGuest";
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

      <div className="flex justify-center bg-white ">
        <div className="w-full mt-8">
        <div className="grid items-center grid-cols-7 py-1 mx-auto text-sm tracking-wide border-2 border-gray-600 rounded-full w-max ">
            <div className="flex flex-col pl-3 pr-1 text-center border-r-2 border-gray-500 w-28 ">
              <p>City</p>
              <input
                type="text"
                placeholder="lahore"
                value={cityName}
                className="text-center focus:outline-none"
                onChange={(e)=>setCityName(e.target.value)}
              />
            </div>
            <div className="text-center border-r-2 border-gray-500 w-28 ">
              <p>Sector</p>
              <input
                type="text"
                placeholder="G-2"
                value={sector}
                className="w-24 text-center focus:outline-none"
                onChange={(e)=>setSector(e.target.value)}
              />
            </div>
            <div className="text-center border-r-2 border-gray-500 w-28 ">
              <p>Property Type</p>
              <input
                type="text"
                placeholder="house"
                value={propertyType}
                className="w-24 text-center focus:outline-none"
                onChange={(e)=>setPropertyType(e.target.value)}

              />
            </div>
            <div className="text-center border-r-2 border-gray-500 w-28 ">
              <p>Range Price</p>
              <div className="flex w-full">
                <input
                  type="number"
                  className="w-12 text-center focus:outline-none"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e)=>setMinPrice(e.target.value)}
                />
                <p>&lt;</p>
                <input
                  type="number"
                  className="w-12 text-center focus:outline-none"
                  placeholder="0"
                  value={maxPrice}
                  onChange={(e)=>setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="text-center border-r-2 border-gray-500 w-28 ">
              <p>Area</p>
              <div className="flex w-full">
                <input
                  type="number"
                  className="w-12 text-center focus:outline-none"
                  placeholder="0"
                  value={minArea}
                  onChange={(e)=>setMinArea(e.target.value)}
                />
                <p>&lt;</p>
                <input
                  type="number"
                  className="w-12 text-center focus:outline-none"
                  placeholder="0"
                  value={maxArea}
                  onChange={(e)=>setMaxArea(e.target.value)}
                />
              </div>
            </div>
            <div className="text-center border-r-2 border-gray-500 w-28 ">
              <p>Bedroom</p>
              <input
                type="number"
                className="w-12 text-center focus:outline-none"
                placeholder="0"
                value={BedRoom}
                onChange={(e)=>setBedRoom(e.target.value)}
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
