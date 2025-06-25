import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:pincode", async (req, res) => {
  const { pincode } = req.params;

  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Pincode fetch error:", err);
    res.status(500).json({ error: "Failed to fetch pincode data." });
  }
});

export default router;
