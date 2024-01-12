import "/imports/api/boards";
import "/imports/api/board.publications";
import { boardsModule } from "/imports/api/board.methods";
import { Meteor } from "meteor/meteor";
import { createModule } from "grubba-rpc";

Meteor.startup(async () => {});

const server = createModule().addSubmodule(boardsModule).build();

export type Server = typeof server;
