import { Meteor } from "meteor/meteor";
import { BoardsCollection } from "./boards/collection";
import { check } from "meteor/check";

Meteor.publish("singleBoard", function publishBoards(boardId) {
  check(boardId, String);
  return BoardsCollection.find({ _id: boardId });
});
