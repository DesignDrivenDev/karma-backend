import { Job } from "bull";
import { UpsertQueueData } from "..";
import { upsertClosed } from "../../properties";

export const upsertData = async (job: Job<UpsertQueueData>, done: any) => {
  await upsertClosed();
};
