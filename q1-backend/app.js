const express = require("express");
const app = express();
const port = 5000;

app.get("/", function (req, res) {
  res.send("Hello World!");
});

const products = [];

app.get(
  "/categories/:categoryname/products/:n?/:page?/:minprice?/:maxprice",
  function (req, res) {
    const { categoryname, minprice, maxprice } = req.params;
    const companyName = "AMZ";
    res.send(`category you're looking for ${categoryname}`);
    axios.get(
      `http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products?top=${n}&minPrice=${minprice}&maxPrice=${maxprice}`
    );
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
