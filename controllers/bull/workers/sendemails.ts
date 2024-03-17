import { Job } from "bull";
import { sendEmailToNotify } from "../emailer";

export interface VerifyQueue {
  email: string | undefined;
  ogprice : number;
  price: number;
}

export const sendEmail = async (job: Job<VerifyQueue>) => {
  console.log("job processed", job.id)
  await sendEmailToNotify({
    email: job.data.email,
    ogprice : job.data.ogprice,
    price: job.data.price,
  });
};
