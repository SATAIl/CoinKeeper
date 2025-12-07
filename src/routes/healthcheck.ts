import { Router } from "express";

const router = Router();

router.get("/healthcheck", (_req, res) => {
  res.json({
    date: new Date().toISOString(),
    status: "OK",
    message: "Healthcheck passed"
  });
});

export default router;
