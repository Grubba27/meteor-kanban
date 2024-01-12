import { Mongo } from "meteor/mongo";
import { z } from "zod";

export const cardSchema = z.object({
  _id: z.string().optional(),
  index: z.number(),
  description: z.string(),
  color: z.string(),
});

export const collumnSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  cards: z.array(cardSchema).default([]),
});

export const boardSchema = z.object({
  _id: z.string().optional(),
  collumns: z.array(collumnSchema).default([]),
});
export type Card = z.infer<typeof cardSchema>;
export type Collumn = z.infer<typeof collumnSchema>;
export type Boards = z.infer<typeof boardSchema>;

export const BoardsCollection = new Mongo.Collection<Boards, Boards>("boards");
