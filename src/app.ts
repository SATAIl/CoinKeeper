import express, { Request, Response, NextFunction } from "express";
import healthcheckRouter from "./routes/healthcheck";
import usersRouter from "./routes/users";
import categoriesRouter from "./routes/categories";
import recordsRouter from "./routes/records";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome to CoinKeeper!");
});

app.use(healthcheckRouter);
app.use(usersRouter);
app.use(categoriesRouter);
app.use(recordsRouter);

app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    if (err.name === "PrismaClientKnownRequestError") {
      return res.status(400).json({
        error: "Database error",
        code: err.code,
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
);

export default app;
