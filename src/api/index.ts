import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.post("/publish", (req, res) => {
  const formData = req.body;
  console.log(formData);

  if (formData) {
    res.json({ message: "Data received successfully", formData });
  } else {
    res.json({ message: "Something fail" });
  }
});

router.use("/emojis", emojis);

export default router;
