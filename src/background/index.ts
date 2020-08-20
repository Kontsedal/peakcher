import { Logger } from "common/services/Logger";
import { main } from "./background";

main().catch((error) => Logger.error("Background script startup error", error));
