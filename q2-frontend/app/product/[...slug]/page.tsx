"use client";
import { useEffect, useState } from "react";

export default function Product({ params }: any) {
  const [product, setProduct] = useState<any>();

  async function fetchProduct() {
    const res = await fetch(
      `http://localhost:5000/categories/${params.slug[0]}/products/${params.slug[1]}`,
      { method: "POST" }
    );
    const data = await res.json();
    console.log(data);
    setProduct(data);
  }
  useEffect(() => {}, []);

  return <>{JSON.stringify(product, null, 2)}</>;
}
