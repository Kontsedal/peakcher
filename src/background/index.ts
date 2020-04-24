import { main } from "./background";

main().catch((error) =>
  console.error("Background script startup error", error)
);
