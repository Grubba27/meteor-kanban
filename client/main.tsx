import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import "@mantine/core/styles.css";

import { DEFAULT_THEME, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "/imports/ui/Home";
import { BoardPage } from "/imports/ui/Board";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/board/:boardId",
    element: <BoardPage />,
  },
]);

function Root() {
  return (
    <MantineProvider theme={DEFAULT_THEME}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container!);
  root.render(<Root />);
});
