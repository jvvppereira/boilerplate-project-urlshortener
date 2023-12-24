require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const URLs = [];

// body parser to have access to request.body
app.use(require("body-parser").urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl/:url_id", function (req, res) {
  const URLid = req.params.url_id;
  console.log("get", URLs, URLid, URLs[URLid]);
  res.redirect(URLs[URLid]);
});

app.post("/api/shorturl", function (req, res) {
  const dns = require("dns");
  const originalURL = req.body.url;
  const shortURL = originalURL;

  dns.lookup(originalURL, (err, address, family) => {
    if (
      err &&
      !originalURL.startsWith("https://boilerplate-project-urlshortener")
    ) {
      res.json({ error: "invalid url" });
    } else {
      URLs.push(originalURL);
      console.log(URLs);
      res.json({ original_url: originalURL, short_url: URLs.length - 1 });
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
  
