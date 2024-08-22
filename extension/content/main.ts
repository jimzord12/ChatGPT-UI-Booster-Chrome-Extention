import { sidebarSelector } from "./elementSelectors";
import {
  createAttributesObserverCallback,
  createAttributesObserverForElement,
} from "./observer";

interface ReceivedElements {
  sidebarParent: HTMLElement;
  sidebar: HTMLElement;
  sidebarContent: HTMLElement;
  allChatsContainers: NodeListOf<HTMLAnchorElement>;
}

export default function (elements: ReceivedElements) {
  const { sidebarParent, sidebar, sidebarContent, allChatsContainers } =
    elements;

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

  if (!allChatsContainers) {
    console.log("Main: Could not find chats containers");
    return;
  }

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
}
