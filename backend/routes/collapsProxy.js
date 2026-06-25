const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing TMDB ID" });
  }

  const url = `https://collaps.org/embed/movie/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*",
      },
    });

    const html = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: "Proxy error", details: err.message });
  }
});

module.exports = router;
