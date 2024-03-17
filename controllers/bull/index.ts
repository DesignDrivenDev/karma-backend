import Bull, { Job } from "bull";
import { RedisOptions } from "bullmq";
import { sendEmail } from "./workers/sendemails";
import { upsertData } from "./workers/upsert";

export interface VerifyQueue {
  email: string | undefined;
  ogprice: number;
  price: number;
}

export interface UpsertQueueData {
  date: string;
}

export const connection: RedisOptions = {
  host: process.env.REDIS_HOST || "",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 25061,
  // password: process.env.REDIS_PASSWORD || "",
};

export const EmailQueue = new Bull<VerifyQueue>("emailQueue", {
  redis: connection,
});

export const UpsertQueue = new Bull<UpsertQueueData>("upsertQueue", {
  redis: connection,
});

UpsertQueue.process(upsertData);
export const addToUpsertQueue = async () => {
  await UpsertQueue.add(
    { date: new Date().toString() },
    {
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
  console.log("Added to upsert queue", new Date().toString());
};

EmailQueue.process(sendEmail);
export const addToEmailQueue = async (data: VerifyQueue) => {
  console.log("Added to queue", data);
  await EmailQueue.add(data, {
    removeOnComplete: true,
    removeOnFail: false,
  });
};
