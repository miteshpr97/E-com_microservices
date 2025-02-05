'use client';

import Link from "next/link";
import { RootState } from "../../store";
import { AppDispatch } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from "@/store/slices/cartSlice";
import Navbar from "../components/Navbar";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ViewCart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const { user } = useUser();
  const { carts } = useSelector((state: RootState) => state.cart);
  const totalAmount = carts.reduce((total, item) => total + item.price * item.qnty, 0);



  const isOutOfStock = carts.some(cart => cart.stock === 0);
  
  const handleRemove = (_id: string) => {
    dispatch(removeFromCart(_id));
  };

  const handleQuantityChange = (_id: string, increment: boolean) => {
    const cartItem = carts.find((item) => item._id === _id);
    if (cartItem) {
      const newQuantity = increment ? cartItem.qnty + 1 : cartItem.qnty - 1;
      if (newQuantity > 0) {
        dispatch(incrementQuantity({ _id, qnty: newQuantity }));
      } else {
        dispatch(decrementQuantity(_id));
      }
    }
  };



  const orderPlace = async () => {
    if (carts.length === 0) {
      alert("Your cart is empty. Please add some items before checking out.");
      return;
    }
    const orderDetails = {
      products: carts.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qnty,
      })),
      totalAmount,
      user: user?._id || null,
      shippingAddress: (document.getElementById('address') as HTMLInputElement)?.value,
    };
    try {
      const res = await axios.post('/api/orders/', orderDetails);
      if (res.status === 201) {
        toast.success("order successful!");
        setTimeout(() => {
          dispatch(clearCart());
          router.push('/orders');
        }, 2000);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while placing the order. Please try again.");
    }
  };


  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shopping Cart Section */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
              {carts.length > 0 ? (
                <div className="space-y-4" >
                  {carts.map((cart) => (

                    <div
                      key={cart._id}
                      className="flex items-center justify-between p-4 rounded shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={cart.image}
                          alt={cart.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="w-[400px] p-3">
                          <h3 className="font-semibold text-lg">{cart.name}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{cart.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          className="px-3 py-1 border rounded hover:bg-gray-200"
                          onClick={() => handleQuantityChange(cart._id, false)}
                        >
                          -
                        </button>
                        <span className="font-semibold">{cart.qnty}</span>
                        <button
                          className="px-3 py-1 border rounded hover:bg-gray-200"
                          onClick={() => handleQuantityChange(cart._id, true)}
                        >
                          +
                        </button>
                      </div>
                      <p className="font-bold text-lg">₹{cart.price * cart.qnty}</p>

                      {
                        cart?.stock === 0 ? (
                          <span className="text-red-600 ml-4"> Out of Stock</span>
                        ) : (
                          ""
                        )
                      }

                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleRemove(cart._id)}
                      >
                        ✕ Remove
                      </button>




                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-6 mx-auto">Your cart is empty!<br></br>
                  Explore our wide selection and find something you like.</p>
              )}
              <Link href="/">
                <span className="text-blue-600 hover:underline mt-6 block">
                  ← Back to shop
                </span>
              </Link>
            </div>

            {/* Summary Section */}
            <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Items:</p>
                  <p>{carts.length}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal:</p>
                  <p>₹{totalAmount.toFixed(2)}</p>
                </div>

                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                    Select Address
                  </label>
                  <select
                    id="address"
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {user?.address.map((addr, index) => (
                      <option
                        key={index}
                        value={`${addr.street}, ${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.country}`}
                      >
                        {`${addr.street}, ${addr.city}, ${addr.state}, ${addr.postalCode}, ${addr.country}`}
                      </option>
                    ))}
                  </select>

                </div>
                <div>
                  <label htmlFor="shipping" className="block text-gray-600 mb-2">
                    Shipping:
                  </label>
                  <select id="shipping" className="w-full p-2 border rounded">
                    <option value="5">Standard Delivery - ₹5.00</option>
                    <option value="10">Express Delivery - ₹10.00</option>
                  </select>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <p>Total:</p>
                  <p>₹{(totalAmount + 5).toFixed(2)}</p> {/* Default ₹5 shipping */}
                </div>

                

                <button
                  className={`w-full py-3 rounded-lg font-semibold ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                    }`}
                  onClick={() => {
                    if (isOutOfStock) {
                      alert("Please remove out-of-stock items before proceeding to checkout.");
                    } else {
                      orderPlace();
                    }
                  }}
                  disabled={isOutOfStock}
                >
                  Checkout
                </button>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCart;
