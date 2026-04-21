import express from "express";
import cors from "cors";
import router from "./router";

const app = express();
app.disable("x-powered-by");

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`🎪 Server running at: http://localhost:${port} 🎪`);
});
