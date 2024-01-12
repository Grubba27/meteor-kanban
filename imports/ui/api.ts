import { createClient } from "grubba-rpc";
import type { Server } from "/server/main";

export const api = createClient<Server>();
