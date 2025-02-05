// "use client";

// import Link from "next/link";
// import { useUser } from "../../context/UserContext";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { RootState } from "../../store";
// import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
// import { useEffect, useRef, useState } from "react";

// const Navbar = () => {
//   const { user } = useUser();
//   const redirect = useRouter();
//   const dropdownRef = useRef(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const { carts } = useSelector((state: RootState) => state.cart);
  

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDropdownOpen]);

//   const handleLogout = () => {
//     Cookies.remove("token");
//     redirect.push("/auth/login");
//   };

//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md sticky top-0 z-50">
//       <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
//         {/* Logo */}
//         <div>
//           <Link href="/">
//             <span className="text-2xl font-extrabold text-yellow-400 hover:text-yellow-500 transition-all">
//               ShopMate
//             </span>
//           </Link>
//         </div>


//         <div style={{width:"20%" , display:"flex", justifyContent:"end"}}>

//           {/* Navbar Links */}
//           <div className="hidden md:flex items-center space-x-6 mr-5">
//             <Link href="/">
//               <span className="hover:text-yellow-400 transition-all">Home</span>
//             </Link>
//             <Link href="/viewcart">
//               <div className="relative">
//                 <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
//                 {carts.length > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white font-bold rounded-full px-2 py-0.5">
//                     {carts.length}
//                   </span>
//                 )}
//               </div>
//             </Link>
//           </div>

//           {/* User Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={toggleDropdown}
//               className="flex items-center bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
//             >
//               <span>{user?.userName || "Guest"}</span>
//               <svg
//                 className="ml-2 w-4 h-4"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//               </svg>
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
//                 <Link href={`/profile/${user?._id}`}>
//                   <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100"> My Profile</span>
//                 </Link>
//                 <Link href="/orders">
//                   <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Orders</span>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
//                 >
//                   Log Out
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>

//       </div>
//     </nav>


//   );
// };

// export default Navbar;



"use client";

import Link from "next/link";
import { useUser } from "../../context/UserContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { user } = useUser();
  const redirect = useRouter();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { carts } = useSelector((state: RootState) => state.cart);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    Cookies.remove("token");
    redirect.push("/auth/login");
  };

  return (
    <nav className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3 px-4">
        
        {/* Logo */}
        <div>
          <Link href="/">
            <span className="text-xl font-extrabold text-secondary hover:text-yellow-600 transition-all">
            ShopMate
            </span>
          </Link>
        </div>

        {/* Search Bar & Category */}
        <div className="flex flex-grow mx-48">
          <select className="border border-gray-300 bg-gray-100 px-2 py-2 rounded-l-md">
            <option>Category</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Accessories</option>
          </select>
          <input 
            type="text" 
            placeholder="Search item name or keywords" 
            className="border border-gray-300 px-4 py-2 flex-grow"
          />
          <button className="bg-secondary px-4 py-2 rounded-r-md text-white">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Cart & Login */}
        <div className="flex items-center space-x-5">
          <Link href="/viewcart">
            <div className="relative">
              <FontAwesomeIcon icon={faShoppingCart} className="text-2xl text-gray-600" />
              {carts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white font-bold rounded-full px-2 py-0.5">
                  {carts.length}
                </span>
              )}
            </div>
          </Link>
          
          {/* Login Button */}
          {!user ? (
            <Link href="/auth/login">
              <button className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition">
                Login
              </button>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="bg-secondary px-4 py-2 rounded-lg text-white"
              >
                {user?.userName}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link href={`/profile/${user?._id}`}>
                    <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Profile</span>
                  </Link>
                  <Link href="/orders">
                    <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Orders</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
