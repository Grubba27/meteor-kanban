import React from "react";
import type { Collumn, Card } from "../api/boards";
import { IconEdit, IconCheck } from "@tabler/icons-react";

import {
  Button,
  Flex,
  Notification,
  Space,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { api } from "./api";
import { useParams } from "react-router-dom";

const CardComponent = ({
  _id,
  color,
  description,
  index,
  collumnTitle,
  boardId,
}: Card & { collumnTitle: string; boardId: string }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardDescription, setCardDescription] = React.useState(description);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
    setCardDescription(description);
  };
  return (
    <Notification
      withBorder
      color={color}
      onClose={async () => {
        if (isEditing) return toggleEdit();
        await api.boards.deleteCard({
          collumnTitle,
          boardId,
          cardId: _id,
        });
      }}
    >
      <Flex justify="space-between">
        {isEditing ? (
          <TextInput
            size="md"
            value={cardDescription}
            onChange={(e) => setCardDescription(e.currentTarget.value)}
          />
        ) : (
          <p>{description}</p>
        )}
        <UnstyledButton
          onClick={async () => {
            if (isEditing) {
              await api.boards.updateCardDescription({
                boardId,
                collumnTitle,
                cardId: _id,
                newDescription: cardDescription,
              });
              return toggleEdit();
            }
            toggleEdit();
          }}
        >
          {isEditing ? <IconCheck /> : <IconEdit />}
        </UnstyledButton>
      </Flex>
    </Notification>
  );
};

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
            if (!cardDescription) {
              return;
            }

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
      <Space h="sm" />
      {cards.map(({ _id, description, color, index }) => {
        return (
          <CardComponent
            key={_id}
            _id={_id}
            description={description}
            index={index}
            color={color}
            boardId={boardId}
            collumnTitle={title}
          />
        );
      })}
    </div>
  );
};
