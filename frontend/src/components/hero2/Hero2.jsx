import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";

const Hero2 = () => {
  const images = [
    "https://img.freepik.com/free-photo/indian-city-buildings-scene_23-2151823129.jpg?ga=GA1.1.1880536003.1728641029&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/majestic-peacock-displays-vibrant-multi-colored-elegance-generated-by-ai_188544-39077.jpg?ga=GA1.1.1880536003.1728641029&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/crossroad-car-safari-scene_23-2151822308.jpg?ga=GA1.1.1880536003.1728641029&semt=ais_hybrid",
    "https://img.freepik.com/premium-photo/river-and-green-trees-philippines-concept-about-wanderlust_186382-1256.jpg?w=1060",
  ];
  const navigate = useNavigate();
  // 

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <div className="md:px-36 px-8 md:py-28 py-5">
        <div className="flex lg:flex-row flex-col gap-10">
          <div className="flex flex-col gap-5 justify-center p-5">
            <h1 className="text-4xl md:text-5xl font-bold">Explore</h1>
            <h1 className="text-4xl md:text-5xl font-bold">the Wonders in</h1>
            <h1 className="text-4xl md:text-6xl font-bold text-[#41A4FF]">
              LENS
            </h1>
            <p className="mt-4">
              Escape the city and immerse yourself in the charm of rural villages,
              breathtaking landscapes, and rich cultural heritage across the countryside.
            </p>
            <button onClick={() => navigate("/tours/home")} className="bg-black text-white px-2 py-3 rounded-lg hover:bg-white hover:border hover:text-black hover:font-bold mt-4">
              Get started
            </button>
          </div>
          <div
            className="w-full carousel-container"
            style={{ height: "400px", overflow: "hidden" }}
          >
            <Carousel
              responsive={responsive}
              autoPlay={true}
              infinite={true}
              showDots={true}
            >
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`heroimg-${index}`}
                  className="rounded-3xl h-full w-full object-cover"
                />
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero2;
