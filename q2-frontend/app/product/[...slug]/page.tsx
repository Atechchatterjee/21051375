"use client";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="w-[70%] m-auto">
      <Card className="flex gap-5 p-3 mt-[5rem]">
        <h3 className="font-bold text-xl">{product.productName}</h3>
        <p>Price: {product.price}</p>
        <p>rating: {product.rating}</p>
        <p>discount: {product.discount}</p>
      </Card>
    </div>
  );
}
