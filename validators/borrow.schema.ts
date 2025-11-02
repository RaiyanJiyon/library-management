import zod from "zod";
import { IBorrow } from "../interfaces/borrow.interface";

export const BorrowSchema: zod.ZodType<IBorrow> = zod.object({
  book: zod.string().min(1, "Book ID is required"),
  quantity: zod.number().min(1, "Quantity must be at least 1"),
  dueDate: zod.string()
    .transform((str) => new Date(str))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format"
    })
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
});
