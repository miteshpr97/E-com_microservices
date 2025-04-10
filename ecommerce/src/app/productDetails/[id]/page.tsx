/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Navbar from '@/app/components/Navbar';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { addToCart } from "../../../store/slices/cartSlice";
import { AppDispatch } from "../../../store/index";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";


const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(product, "hhhh");
  

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/product/get/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error: any) {
        setError('Failed to fetch product details.');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);


  const handleAddToCart = (e: any) => {
    dispatch(addToCart(e))
    toast.success("Added To Cart");

    router.push('/viewcart')

  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;



  return (
    <>
      <Navbar />
      <div className="bg-slate-100 min-h-screen flex">
        {/* Left Section (40%) */}
        <div className="bg-white w-[40%] min-h-screen fixed left-0 p-6 h-full flex flex-col items-center border-r border-gray-300 ">
          {/* Product Image Box */}
          <div className="w-[90%] h-[70%] border border-gray-400 flex items-center justify-center shadow-sm bg-gray-50">
            <img
              src={product?.image}
              alt='Product Image'
              className="w-full h-full object-cover"  // Fixed image size and aspect ratio handling
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 w-full flex flex-col items-center gap-3">
            {product?.stock > 0 ? (
              <>
                <button
                  className="w-[80%] bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  onClick={() => handleAddToCart(product)}
                >
                  ADD TO CART
                </button>

                <button className="w-[80%] bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300">
                  BUY NOW
                </button>
              </>
            ) : (
              <button className=" w-[80%] py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-gray-500 transition duration-300">
                Out of Stock
              </button>
            )}
          </div>


        </div>

        {/* Right Section (60%) */}
        <div className="bg-gray-100 w-[60%] ml-auto p-8">
          <h1 className="text-black text-3xl font-bold mb-4">{product?.name}</h1>
          <p className="text-lg text-gray-700 mb-2">Product ID: <span className="font-semibold">{id}</span></p>
          <p className="text-gray-600 leading-relaxed">{product?.description}</p>

          <div className="mt-4">
            <span className="text-xl font-semibold text-gray-800">Price: ₹{product?.price}</span>
          </div>

          <div className="mt-2">
            <span className="text-lg text-gray-600">In Stock: {product?.stock}</span>
          </div>

          {/* Additional Info Box */}
          <div className="mt-6 p-4 border border-gray-300 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Category: {product?.category}</h2>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Decription: {product?.description}</h2>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;



// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import Navbar from '@/app/components/Navbar';
// import axios from 'axios';
// import { useParams } from 'next/navigation';
// import { useState, useEffect } from 'react';

// const ProductDetails: React.FC = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         const res = await axios.get(`/api/products/${id}`);
//         setProduct(res.data.product);
//         setLoading(false);
//       } catch (error: any) {
//         setError('Failed to fetch product details.');
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [id]);

//   if (loading) return <div className="text-center py-12">Loading...</div>;
//   if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="bg-gray-100 min-h-screen flex">
//         {/* Left Section (40%) */}
//         <div className="bg-white w-[40%] min-h-screen fixed left-0 p-6 h-full flex flex-col items-center border-r border-gray-300 shadow-lg rounded-lg">
//           {/* Product Image Box */}
//           <div className="w-full h-[70%] border border-gray-300 rounded-lg shadow-md bg-gray-50 flex items-center justify-center">
//             <img
//               src={product?.image}
//               alt="Product Image"
//               className="w-full h-full object-cover rounded-lg"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="mt-6 w-full flex flex-col items-center gap-4">
//             <button className="w-[80%] bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
//               ADD TO CART
//             </button>
//             <button className="w-[80%] bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold">
//               BUY NOW
//             </button>
//           </div>
//         </div>

//         {/* Right Section (60%) */}
//         <div className="bg-gray-50 w-[60%] ml-auto p-10">
//           <h1 className="text-black text-4xl font-bold mb-6">{product?.name}</h1>
//           <p className="text-lg text-gray-700 mb-4">Product ID: <span className="font-semibold text-blue-600">{id}</span></p>
//           <p className="text-gray-600 leading-relaxed text-xl mb-6">{product?.description}</p>

//           <div className="flex gap-4 mb-6">
//             <span className="text-2xl font-semibold text-gray-800">Price: ₹{product?.price}</span>
//             <span className="text-xl text-gray-600">In Stock: {product?.stock}</span>
//           </div>

//           {/* Additional Info Box */}
//           <div className="p-6 border border-gray-300 bg-white rounded-lg shadow-md mt-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Category: {product?.category}</h2>
//             <p className="text-gray-600 text-lg">{product?.description}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductDetails;
