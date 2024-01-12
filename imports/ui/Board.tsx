import React, { Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "./api";
import {
  Center,
  Anchor,
  Box,
  rem,
  Flex,
  CopyButton,
  Button,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSubscribe } from "grubba-rpc/lib/utils/hooks/useSubscribe";
import { useFind } from "grubba-rpc/lib/utils/hooks/useFind";
import { Boards, BoardsCollection } from "../api/boards/collection";

function BackToHome() {
  return (
    <Anchor c="orange" underline="hover" component={Link} to="/">
      <Center inline>
        <IconArrowLeft style={{ width: rem(12), height: rem(12) }} />
        <Box ml={5}>Back to HomePage</Box>
      </Center>
    </Anchor>
  );
}

function CopyBoardId({ url }: { url: string }) {
  return (
    <CopyButton value={url}>
      {({ copied, copy }) => (
        <Button
          size="md"
          radius="md"
          color={copied ? "teal" : "orange"}
          onClick={copy}
        >
          {copied ? "Copied board url" : "Copy board url"}
        </Button>
      )}
    </CopyButton>
  );
}

function Board({ boardId }: { boardId: string }) {
  // @ts-ignore
  useSubscribe("singleBoard", boardId);
  // @ts-ignore
  const [board]: Boards[] = useFind(
    () => BoardsCollection.find(boardId),
    [boardId]
  );

  return (
    <Flex align="center" justify="space-between" wrap="wrap" direction="column">
      <h1>Board - {boardId}</h1>
      <Button
        onClick={async () => {
          console.log("Add a card to the to do column");
          await api.boards.addCard({
            boardId,
            collumnTitle: "To Do",
            card: {
              description: "New card description",
            },
          });
          console.log("board", board);
        }}
        color="orange"
        radius="md"
        size="lg"
      >
        Click here to add one more to To Do
      </Button>
      <Flex w="100%" direction="row" wrap="wrap" justify="space-evenly" align="flex-start">
        {board.collumns.map(({ title, cards }) => {
          return (
            <div>
              <h2>{title}</h2>
              {cards.map(({ description }) => {
                return (
                  <div>
                    <p>{description}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Flex>
    </Flex>
  );
}

// TODO: think you we should handle url
export const BoardPage = () => {
  const { boardId } = useParams();
  if (!boardId) {
    return <div>Board not found</div>;
  }
  return (
    <>
      <Flex align="center" justify="space-between" m={20}>
        <BackToHome />
        <CopyBoardId url={`http://localhost:3000/board/${boardId}`} />
      </Flex>
      <Suspense fallback={<div>Loading...</div>}>
        <Board boardId={boardId} />
      </Suspense>
    </>
  );
};
