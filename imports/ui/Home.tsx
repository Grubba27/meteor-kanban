import { Flex, Button } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";
export const Home = () => {
  const navigate = useNavigate();

  return (
    // TODO: Center in the page
    <Flex
      mih={50}
      gap="md"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <h1>Meteor Kanban</h1>
      <Button
        variant="outline"
        color="orange"
        size="xl"
        radius="md"
        onClick={async () => {
          const boardId = await api.boards.createDefault();
          console.log("boardId", boardId);
          navigate(`/board/${boardId}`);
        }}
      >
        Click here to generate your board
      </Button>
    </Flex>
  );
};
