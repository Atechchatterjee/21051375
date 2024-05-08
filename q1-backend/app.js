const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = 5000;
const crypto = require("crypto");

app.use(cors());

app.get("/", function (req, res) {
  res.send("Hello World!");
});

let topProducts = [];
let bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTUyNDQ2LCJpYXQiOjE3MTUxNTIxNDYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjM3MTVhNTYyLWEzNjktNDk4Ny1hZTVjLTgzM2I0NTRhOTEyYyIsInN1YiI6ImF0ZWNoY2hhdHRlcmplZWVAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiIzNzE1YTU2Mi1hMzY5LTQ5ODctYWU1Yy04MzNiNDU0YTkxMmMiLCJjbGllbnRTZWNyZXQiOiJEZUVRTkx5cE1HVmJ3cWRPIiwib3duZXJOYW1lIjoiQW5pc2ggQ2hhdHRvcGFkaHlheSIsIm93bmVyRW1haWwiOiJhdGVjaGNoYXR0ZXJqZWVlQGdtYWlsLmNvbSIsInJvbGxObyI6IjIxMDUxMzc1In0.YJK63iFxMXKV5WkteXsZIpJFXXH2ok30y3TlPSlglxE";

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

async function refetchBearerToken() {
  try {
    const res = await axios.post("http://20.244.56.144/test/auth", {
      companyName: "goMart",
      clientId: "3715a562-a369-4987-ae5c-833b454a912c",
      clientSecret: "DeEQNLypMGVbwqdO",
      ownerName: "Anish Chattopadhyay",
      ownerEmail: "atechchatterjeee@gmail.com",
      rollNo: "21051375",
    });
    bearerToken = res.data.access_token;
    return Promise.resolve(res.data.access_token);
  } catch (err) {
    return Promise.reject(err);
  }
}

app.get(
  "/categories/:categoryname/products/:n?/:page?/:minprice?/:maxprice?",
  async function (req, res) {
    const { categoryname, minprice, maxprice, n } = req.params;
    const companyNames = ["AMZ", "FLP", "MYN", "AZO"];
    try {
      let allProducts = [];
      let retries = 5; // number of retries allowed to refetch bearer token

      for (const companyName of companyNames) {
        while (retries > 0) {
          try {
            const res = await axios.get(
              `http://20.244.56.144/test/companies/${companyName}/categories/${categoryname}/products?top=${n}&minPrice=${minprice}&maxPrice=${maxprice}`,
              {
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                },
              }
            );
            allProducts.push(...res.data);
          } catch (err) {
            try {
              await refetchBearerToken();
              break;
            } catch (err) {
              setTimeout(async () => {
                await refetchBearerToken();
                retries--;
              }, 5000);
            }
          }
        }
      }

      allProducts.sort((i, j) => i.rating - j.rating);
      topProducts = allProducts.slice(1).slice(-10).reverse();

      setUniqueIdentifiersForProducts();

      return res.json({
        topProducts,
      });
    } catch (err) {
      console.error(err);
      // refetchBearerToken();
      return res.sendStatus(400);
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
