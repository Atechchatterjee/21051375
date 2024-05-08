"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Home() {
  const [categories, setCategories] = useState<string>();
  const [numberOfProducts, setNumberOfProducts] = useState<string>();
  const [minPrice, setMinPrice] = useState<string>();
  const [maxPrice, setMaxPrice] = useState<string>();
  const [topProducts, setTopProducts] = useState<any[]>();

  async function handleSubmit() {
    const res = await fetch(
      `http://localhost:5000/categories/${categories}/products/${numberOfProducts}/1/${minPrice}/${maxPrice}`,
      { method: "GET" }
    );
    const data = await res.json();
    console.log(data);
    setTopProducts(data.topProducts);
  }

  return (
    <div className="w-[70%] m-auto">
      <h1 className="font-bold text-3xl mt-[5rem]">Get the top products</h1>
      <div className="flex gap-5 mt-[2rem]">
        <Select
          onValueChange={(value: any) => {
            setCategories(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {[
              "Phone",
              "Computer",
              "Laptop",
              "TV",
              "Earphone",
              "Tablet",
              "Charger",
              "Mouse",
              "Keypad",
              "Bluetooth",
              "Pendrive",
              "Remote",
              "Speaker",
              "Headset",
              "PC",
            ].map((cat) => (
              <SelectItem value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Number of products"
          onChange={(e) => setNumberOfProducts(e.target.value)}
        />
        <Input
          placeholder="Min Price"
          type="number"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <Input
          placeholder="Max Price"
          type="number"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <div className="flex flex-col gap-3 mt-[2rem]">
        {topProducts?.map((prd) => {
          return (
            <Card
              className="flex gap-5 p-3"
              onClick={() => {
                window.location.assign(`/product/${categories}/${prd.id}`);
              }}
            >
              <h3 className="font-bold text-xl">{prd.productName}</h3>
              <p>Price: {prd.price}</p>
              <p>rating: {prd.rating}</p>
              <p>discount: {prd.discount}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
