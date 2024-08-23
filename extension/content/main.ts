import StateManager from "../lib/state-manager/stateManager";
import { AllChatsMapType } from "../types/types";
import { sidebarSelector } from "./constants/elementSelectors";
import {
  createAttributesObserverCallback,
  createAttributesObserverForElement,
} from "../lib/observers/attr-observer";
import { createNewChatGroup } from "../utils/helpers/chat-group-manager";

interface ReceivedElements {
  sidebarParent: HTMLElement;
  sidebar: HTMLElement;
  sidebarContent: HTMLElement;
  allChatsMap: AllChatsMapType;
}

export default async function (elements: ReceivedElements) {
  const { sidebarParent, sidebar, sidebarContent, allChatsMap } = elements;

  if (!sidebarParent) {
    console.log("Main: Could not find sidebar parent element");
    return;
  }

  if (!sidebar) {
    console.log("Main: Could not find sidebar element");
    return;
  }

  if (!sidebarContent) {
    console.log("Main: Could not find sidebar content element");
    return;
  }

  if (!allChatsMap || Array.from(allChatsMap.entries()).length === 0) {
    console.log("Main: Could not find chats containers");
    return;
  }

  // Intializing State Manager
  const stateManager = await StateManager.getInstance(); // can be "local" or "sync", defaults to "local"

  let userPrefs: any; //TODO: Replace any with actual type
  try {
    userPrefs = await stateManager.getState("userPrefs");
  } catch (error) {
    console.error("[StateManager Error]: ", error);
  }

  // This is currently written for testing. This will be replaced with the actual logic from user's prefs
  const applySidebarMods = () => {
    if (sidebar.style.visibility === "hidden") {
      sidebar.classList.add("closed");
      sidebar.style.width = "0px";

      sidebarContent.classList.add("closed");
      sidebarContent.style.width = "0px";

      return;
    }

    // Sidebar
    sidebar.classList.remove("closed");
    sidebar.id = "sidebar";
    sidebar.style.width = "500px";

    // Sidebar Content
    sidebarContent.classList.remove("closed");
    sidebarContent.id = "sidebar-content";
    sidebarContent.style.width = "500px";
  };

  // Creating a MutationObserver to observe changes in the sidebar
  const observerCallback = createAttributesObserverCallback(
    "style",
    applySidebarMods
  );
  const sidebarObserver = createAttributesObserverForElement(
    sidebarSelector,
    observerCallback,
    {
      attributes: true,
      attributeFilter: ["style"],
    }
  );

  // Listen for message from popup, to disconnect the observer
  chrome.runtime.onMessage.addListener((message) => {
    if (message === "stopExtention") {
      if (sidebarObserver) sidebarObserver.disconnect();
    } else if (message === "startExtention") {
      const sidebar = document.querySelector(sidebarSelector);
      if (!sidebar) {
        console.log("Observer: Could not find sidebar element");
        return;
      }
      if (sidebarObserver)
        sidebarObserver.observe(sidebar),
          {
            attributes: true,
          };
    }
  });

  // 🧪 For testing purposes
  // Create a new chat group
  await stateManager.addGroup("Test Chat Group 1");
  await stateManager.addGroup("Test Chat Group 2");

  // Add one chat to each group
  const chatId_1 = "4a327c77-4383-4d77-b675-68d888434805";
  const chatId_2 = "e82ab09e-46f6-4dac-9667-ed74465ca115";
  if (
    allChatsMap.size >= 2 &&
    allChatsMap.has(chatId_1) &&
    allChatsMap.has(chatId_2)
  ) {
    const chat1 = allChatsMap.get(chatId_1);
    const chat2 = allChatsMap.get(chatId_2);

    if (!chat1 || !chat2) {
      console.error("Chat 1 or Chat 2 not found");
      return;
    }
    // Converting ChatMap Records to ChatObjects
    const chatObj_1 = { ...chat1, id: chatId_1 };
    const chatObj_2 = { ...chat2, id: chatId_2 };

    // Get the groups
    const groups = await stateManager.getGroups();
    if (groups.length < 2) {
      console.error("Groups not found");
      return;
    }

    const chatGroup1 = groups.find(
      (group) => group.title === "Test Chat Group 1"
    );
    const chatGroup2 = groups.find(
      (group) => group.title === "Test Chat Group 2"
    );

    if (!chatGroup1 || !chatGroup2) {
      console.error("Chat Groups not found");
      return;
    }

    await stateManager.addChatToGroup(chatObj_1, chatGroup1);
    await stateManager.addChatToGroup(chatObj_2, chatGroup2);

    console.log("");
    console.log("🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉");
    console.log("The Stored Chat Groups: ", await stateManager.getGroups());
    console.log("🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉");
    console.log("");
  }
}
