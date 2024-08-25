import StateManager from "../lib/state-manager/stateManager";
import { AllChatsMapType } from "../types/types";
import { attachMetadataToChats } from "../utils/helpers/chat-group-manager";

export const init = async (allChatsMap: AllChatsMapType) => {
  console.log();
  console.log("🤞 Starting Initialzation...");
  console.log();
  // Intializing State Manager
  const stateManager = await StateManager.getInstance(); // can be "local" or "sync", defaults to "local"
  const allStoredGroups = await stateManager.getGroups();
  attachMetadataToChats(allChatsMap, allStoredGroups);

  console.log();
  console.log("🤞 Initialzation Completed!");
  console.log();
  return {
    stateManager,
  };
};
