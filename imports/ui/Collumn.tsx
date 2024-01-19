import React from "react";
import type { Collumn } from "../api/boards";
import { Button, Flex, TextInput } from "@mantine/core";
import { api } from "./api";
import { useParams } from "react-router-dom";

export const CollumnComponent = ({ title, cards }: Collumn) => {
  const { boardId } = useParams();
  const [cardDescription, setCardDescription] = React.useState("");
  if (!boardId) {
    return <div>Board not found</div>;
  }
  return (
    <div>
      <h2>{title}</h2>
      <Flex align="center">
        <TextInput
          size="md"
          placeholder="Add a new card"
          value={cardDescription}
          onChange={(e) => setCardDescription(e.currentTarget.value)}
        />
        <Button
          onClick={async () => {
            console.log("Add a card to the to do column");
            await api.boards.addCard({
              boardId,
              collumnTitle: title,
              card: {
                description: cardDescription,
              },
            });
            setCardDescription("");
            const b = await api.boards.find(boardId);
            console.log(b);
          }}
          color="orange"
          radius="md"
          size="md"
        >
          Add
        </Button>
      </Flex>

      {cards.map(({ _id, description }) => {
        return (
          <div key={_id}>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
};
