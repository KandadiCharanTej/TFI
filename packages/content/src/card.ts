import { z } from "zod";

export const CardSchema = z.object({
  id: z.string().min(1),
  deck: z.string().min(1),
  game: z.string().min(1),
  te: z.string().min(1, "Telugu text is required"),
  en: z.string().min(1, "English letters are required"),
  answerTe: z.string().optional(),
  answerEn: z.string().optional(),
  hint: z.string().optional(),
  year: z.number().int().min(1930).max(new Date().getFullYear()).optional(),
  filmId: z.string().optional(),
  actorId: z.string().optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  tags: z.array(z.string()),
  verified: z.boolean(),
  source: z.string().optional(),
});

export type GameCard = z.infer<typeof CardSchema>;
