import { Boards, BoardsCollection } from "./boards/collection";
import { z } from "zod";
import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

export const boardsModule = createModule("boards")
  .addMethod("createDefault", z.undefined(), async () => {
    const board: Boards = {
      collumns: [
        {
          title: "To Do",
          cards: [
            {
              index: 0,
              description: "Add a new card",
              color: "green",
            },
          ],
        },
        {
          title: "In Progress",
          cards: [
            {
              index: 0,
              description: "Add a new card",
              color: "green",
            },
            {
              index: 1,
              description: "Add a new card",
              color: "red",
            },
          ],
        },
        {
          title: "Done",
          cards: [
            {
              index: 0,
              description: "Add a new card",
              color: "green",
            },
          ],
        },
        {
          title: "Blocked",
          cards: [
            {
              index: 0,
              description: "Add a new card",
              color: "green",
            },
          ],
        },
      ],
    };
    return await BoardsCollection.insertAsync(board);
  })
  .addMethod("find", z.string(), async (boardId) => {
    return await BoardsCollection.findOneAsync(boardId);
  })
  .addMethod(
    "addCard",
    z.object({
      boardId: z.string(),
      collumnTitle: z.string(),
      card: z.object({
        index: z.number().default(0),
        description: z.string(),
        color: z.string().default("green"),
      }),
    }),
    async ({ boardId, collumnTitle, card }) => {
      const board = await BoardsCollection.findOneAsync(boardId);
      if (!board) {
        throw new Meteor.Error("Board not found");
      }
      // TODO: verifiy if there is another collumn with the same title
      const collumn = board.collumns.find((c) => c.title === collumnTitle);
      if (!collumn) {
        throw new Meteor.Error("Collumn not found");
      }
      collumn.cards.push(card);
      await BoardsCollection.updateAsync(boardId, board);
    }
  )
  .buildSubmodule();
