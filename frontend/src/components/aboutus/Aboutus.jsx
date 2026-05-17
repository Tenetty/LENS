// import React from "react";

// const Aboutus = () => {
//   return (
//     <>
//       <div className="lg:px-36 md:py-5 px-5">
//         <div className="container mx-auto">
//           <div className="-mx-4 flex flex-wrap items-center justify-between">
//             <div className="w-full lg:w-6/12">
//               <div className="-mx-3 flex items-center sm:-mx-4">
//                 <div className="w-full px-3 sm:px-4 xl:w-1/2">
//                   <div className="py-3 sm:py-4">
//                     <img
//                       src="https://images.unsplash.com/photo-1627895457805-c7bf42cb9873?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
//                       alt=""
//                       className="w-full rounded-2xl"
//                     />
//                   </div>
//                   <div className="py-3 sm:py-4">
//                     <img
//                       src="https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
//                       alt=""
//                       className="w-full rounded-2xl"
//                     />
//                   </div>
//                 </div>
//                 <div className="w-full px-3 sm:px-4 xl:w-1/2">
//                   <div className="relative z-10 my-4">
//                     <img
//                       src="https://images.unsplash.com/photo-1594993877167-a08f13013dc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
//                       alt=""
//                       className="w-full rounded-2xl"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
//               <div className="mt-10 lg:mt-0">
//                 <span className="text-[#41A4FF] mb-2 block text-lg font-semibold">
//                   Why Choose Us
//                 </span>
//                 <h2 className="text-dark mb-8 text-3xl font-bold sm:text-4xl">
//                   Lorem ipsum dolor sit amet
//                 </h2>
//                 <p className="text-body-color mb-8 text-base">
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse
//                   nulla enim aperiam culpa cupiditate quas animi ducimus
//                   blanditiis! Dolorum, perspiciatis.
//                 </p>
//                 <p className="text-body-color mb-12 text-base">
//                   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse
//                   nulla enim aperiam culpa cupiditate quas animi ducimus
//                   blanditiis! Dolorum, perspiciatis.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Aboutus;

import React, { useEffect, useRef, useState } from "react";

const Aboutus = () => {
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false); // Reset animation when leaving the viewport
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={aboutRef} className="lg:px-36 md:py-5 px-5">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-6/12">
            <div className="-mx-3 flex items-center sm:-mx-4">
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="py-3 sm:py-4">
                  <img
                    src="https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mjl8fHxlbnwwfHx8fHw%3D"
                    alt="About Image 1"
                    className={`w-full rounded-2xl transition-opacity duration-700 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div className="py-3 sm:py-4">
                  <img
                    src="https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
                    alt="About Image 2"
                    className={`w-full rounded-2xl transition-opacity duration-700 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:px-4 xl:w-1/2">
                <div className="relative z-10 my-4">
                  <img
                    src="https://images.unsplash.com/photo-1594993877167-a08f13013dc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
                    alt="About Image 3"
                    className={`w-full rounded-2xl transition-opacity duration-700 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
            <div
              className={`mt-10 lg:mt-0 transition-opacity duration-700 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-[#41A4FF] mb-2 block text-lg font-semibold">
                Why Choose Us
              </span>
              <h2
                className={`text-dark mb-8 text-3xl font-bold sm:text-4xl transition-opacity duration-700 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Discover the Beauty of LENS
              </h2>
              <p
                className={`text-body-color mb-8 text-base transition-opacity duration-700 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                We connect travelers with authentic rural experiences across the countryside.
                From lush paddy fields and misty hill country to vibrant village
                festivals, every journey is crafted to immerse you in local culture.
              </p>
              <p
                className={`text-body-color mb-12 text-base transition-opacity duration-700 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Our platform brings together trusted local hotels, scenic tour
                packages, reliable transport, and unique cultural activities — all
                in one place, so you can explore the countryside with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
