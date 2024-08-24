import StateManager from "../lib/state-manager/stateManager";
import { AllChatsMapType } from "../types/types";
import { sidebarSelector } from "./constants/elementSelectors";
import {
  createAttributesObserverCallback,
  createAttributesObserverForElement,
} from "../lib/observers/attr-observer";
import { createNewChatGroup } from "../utils/helpers/chat-group-manager";
import { chatsAndGrpsTest } from "./test/chats-and-grps";

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
  //TODO: I future create a Vitest for this
  chatsAndGrpsTest(allChatsMap, stateManager);
}
