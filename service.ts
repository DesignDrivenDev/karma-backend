import express, { Express, Request, Response } from "express";
import { connectToMongo } from "./db";
import propertyRoutes from "./routes/properties";
import cors from "cors";
import { EmailQueue, UpsertQueue } from "./controllers/bull";

const app: Express = express();
const port = 8080;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("running on server");
});

app.use("/api/v1/properties", propertyRoutes);

async function bootstrap() {
  await connectToMongo();
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });

  EmailQueue.on("completed", (job) => console.log(`sended email successfully`));
  EmailQueue.on("failed", (job, err) =>
    console.log(`Failed to send email`, err)
  );

  UpsertQueue.on("completed", (job) =>
    console.log(`Upsert Queue finished : ${job.id}`)
  );
  UpsertQueue.on("failed", (job, err) =>
    console.log(`Upsert Queue Failed : ${job.id}    Error : ${err.message}`)
  );
}

bootstrap();
