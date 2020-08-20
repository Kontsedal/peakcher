import { main } from "./background";
import { Logger } from "../common/services/Logger";

main().catch((error) => Logger.error("Background script startup error", error));
