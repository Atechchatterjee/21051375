const express = require("express");
const axios = require("axios");
const app = express();
const port = 5000;
const crypto = require("crypto");

app.get("/", function (req, res) {
  res.send("Hello World!");
});

let topProducts = [];
let bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTUwNDQwLCJpYXQiOjE3MTUxNTAxNDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjM3MTVhNTYyLWEzNjktNDk4Ny1hZTVjLTgzM2I0NTRhOTEyYyIsInN1YiI6ImF0ZWNoY2hhdHRlcmplZWVAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiIzNzE1YTU2Mi1hMzY5LTQ5ODctYWU1Yy04MzNiNDU0YTkxMmMiLCJjbGllbnRTZWNyZXQiOiJEZUVRTkx5cE1HVmJ3cWRPIiwib3duZXJOYW1lIjoiQW5pc2ggQ2hhdHRvcGFkaHlheSIsIm93bmVyRW1haWwiOiJhdGVjaGNoYXR0ZXJqZWVlQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDUxMzc1In0.tKUGT7qAWEuIYj-xtdaJuA0vy-jURiu6Rr8LdOyBObQ";

function setUniqueIdentifiersForProducts() {
  topProducts = topProducts.map((prd) => ({
    ...prd,
    id: crypto.createHash("sha256").update(JSON.stringify(prd)).digest("hex"),
  }));
}

app.get("/categories/:categoryname/products/:productId", function (req, res) {
  const { productId } = req.params;
  let requiredProduct = null;
  for (const product of topProducts) {
    if (productId === product.id) {
      requiredProduct = product;
    }
  }
  res.json({ product: requiredProduct });
});

app.get(
  "/categories/:categoryname/products/:n?/:page?/:minprice?/:maxprice?",
  async function (req, res) {
    const { categoryname, minprice, maxprice, n } = req.params;
    const companyNames = ["AMZ", "FLP", "MYN", "AZO"];
    try {
      let allProducts = [];
      for (const companyName of companyNames) {
        const res = await axios.get(
          `http://20.244.56.144/test/companies/${companyName}/categories/${categoryname}/products?top=${n}&minPrice=${minprice}&maxPrice=${maxprice}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        allProducts.push(...res.data);
      }

      allProducts.sort((i, j) => i.rating - j.rating);
      topProducts = allProducts.slice(1).slice(-10).reverse();

      setUniqueIdentifiersForProducts();

      return res.json({
        topProducts,
      });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
