import zod from "zod";

export const bookSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  author: zod.string().min(1, "Author is required"),
  genre: zod.enum(
    ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
    {
      error: "Genre is required and must be a valid option",
    }
  ),
  isbn: zod.string().min(1, "ISBN is required"),
  description: zod.string().optional(),
  copies: zod
    .number()
    .min(0, "Number of copies is required and cannot be negative"),
  available: zod.boolean().optional(),
});
