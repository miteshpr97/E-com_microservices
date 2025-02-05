// /app/page.tsx

import Navbar from "@/app/components/Navbar";
import Product from "@/app/products/page";


export default function Home() {
  return (
    <>
      <Navbar />
      <Product />
    </>
  );
}
