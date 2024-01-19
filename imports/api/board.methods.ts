import { Boards, BoardsCollection } from "./boards/collection";
import { z } from "zod";
import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

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
              _id: new Mongo.ObjectID().toHexString(),
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
              _id: new Mongo.ObjectID().toHexString(),
            },
            {
              index: 1,
              description: "Add a new card",
              color: "red",
              _id: new Mongo.ObjectID().toHexString(),
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
              _id: new Mongo.ObjectID().toHexString(),
            },
          ],
        },
        {
          title: "Blocked",
          cards: [
            {
              _id: new Mongo.ObjectID().toHexString(),
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
      collumn.cards.push({
        ...card,
        _id: new Mongo.ObjectID().toHexString(),
        index: collumn.cards.length,
      });
      await BoardsCollection.updateAsync(boardId, board);
    }
  )
  .addMethod(
    "updateCardDescription",
    z.object({
      boardId: z.string(),
      collumnTitle: z.string(),
      cardId: z.string(),
      newDescription: z.string(),
    }),
    async ({ boardId, collumnTitle, cardId, newDescription }) => {
      const board = await BoardsCollection.findOneAsync(boardId);
      if (!board) {
        throw new Meteor.Error("Board not found");
      }
      const collumn = board.collumns.find((c) => c.title === collumnTitle);
      if (!collumn) {
        throw new Meteor.Error("Collumn not found");
      }
      const card = collumn.cards.find((c) => c._id === cardId);
      if (!card) {
        throw new Meteor.Error("Card not found");
      }
      card.description = newDescription;
      await BoardsCollection.updateAsync(boardId, board);
    }
  )
  .addMethod("deleteCard", z.object({
    boardId: z.string(),
    collumnTitle: z.string(),
    cardId: z.string(),
  }), async ({boardId, collumnTitle, cardId}) => {
    const board = await BoardsCollection.findOneAsync(boardId);
    if (!board) {
      throw new Meteor.Error("Board not found");
    }
    const collumn = board.collumns.find((c) => c.title === collumnTitle);
    if (!collumn) {
      throw new Meteor.Error("Collumn not found");
    }
    const cardIndex = collumn.cards.findIndex((c) => c._id === cardId);
    if (cardIndex === -1) {
      throw new Meteor.Error("Card not found");
    }
    collumn.cards.splice(cardIndex, 1);
    await BoardsCollection.updateAsync(boardId, board);
  })
  .buildSubmodule();
