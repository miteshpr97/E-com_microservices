/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useUser } from "../../../context/UserContext";




const Profile: React.FC = () => {
  const { id } = useParams();
  const { user } = useUser();



  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>
      {user ? (
        <div className="space-y-4">
          <p>
            <span className="font-semibold text-gray-600">User ID:</span> {id}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Name:</span> {user.userName || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-600">Email:</span> {user.email || "N/A"}
          </p>
          <div className="bg-gray-100 p-4 rounded">
            <div className="flex justify-between">
            <h2 className="text-lg font-semibold text-gray-700">Shipping Address:</h2>
           
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                title="Add a new address"
              >
                Add Address +
              </button>
            </div>
            {user.address && user.address.length > 0 ? (
              user.address.map((data: any, index: number) => (
                <div key={index} className="mt-2">
                  <p>
                    <span className="font-semibold text-gray-600">Street:</span> {data.street}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">City:</span> {data.city}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">State:</span> {data.state}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-600">Postal Code:</span> {data.postalCode}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No address available.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
