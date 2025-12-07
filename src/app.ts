import express from "express";
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

export default app;
