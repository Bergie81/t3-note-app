import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const subscribeRouter = createTRPCRouter({
  sub: publicProcedure
    .input(
      z.object({
        text: z.string().min(5, "Must be at least 5 characters long"),
      })
    )
    .query(({ input }) => {
      return {
        pleaseSub: `Please do subscribe to: ${input?.text}`,
      };
    }),
});
