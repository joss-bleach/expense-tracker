import { z } from "zod";

export const createProjectSchema = z
  .object({
    name: z.string().min(1, "Project name is required"),
    restDays: z.number().optional().default(0),
    dailyExpense: z
      .number()
      .min(0.01, "Daily expense must be greater than 0")
      .optional()
      .default(50),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
  })
  .refine(
    (data: { startDate: Date; endDate: Date }) => data.endDate > data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  );
