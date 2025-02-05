// import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";

// interface User {
//   id: string;
//   userId:string;
//   userName: string;
//   email: string;
//   role: string;
// }

// interface UserContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
  

//   useEffect(() => {
//     const token = Cookies.get("token");
//     if (token) {
//       try {
//         // Decode the token to get user data
//         const decoded: User = jwtDecode(token);
//         // Set the user data in the context

//         const response = await fetch(`/api/users/me/${decode?.userId}`);
//         const data = await response.json();
        


//         setUser(data);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };



import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}



interface User {
  _id: string;
  userId: string;
  userName: string;
  address: [Address];
  email: string;
  role: string;
 
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);


  console.log(user, "datat show");
  

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      console.log(token, "token data");
      
      if (token) {
        try {
          // Decode the token
          const decoded: { userId: string } = jwtDecode(token);

          console.log(decoded, "jjj");
          
          // Fetch user data using the decoded userId
          const response = await fetch(`http://localhost:5000/api/auth/me/${decoded.userId}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data: User = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching or decoding token:", error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
