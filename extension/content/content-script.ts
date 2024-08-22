// // Wait until the sidebar element is loaded
// function waitForElement(selector, callback) {
//   const interval = setInterval(() => {
//     const element = document.querySelector(selector);
//     if (element) {
//       clearInterval(interval);
//       callback(element);
//     }
//   }, 100);
// }

import {
  waitForElementPromise,
  getChildren,
  waitForAllElementPromise,
} from "../utils/helpers/helpers.js";
import {
  sidebarParentSelector,
  sidebarSelector,
  sidebarContentSelector,
  chatsContainerSelector,
} from "./elementSelectors.js";
import main from "./main.js";

const getElements = async () => {
  try {
    const sidebarParent = await waitForElementPromise(sidebarParentSelector);
    // console.log("[getElements]: Sidebar Parent Element found:", sidebarParent);

    const sidebar = await waitForElementPromise(sidebarSelector);
    // console.log("[getElements]: Sidebar Element found:", sidebar);

    const sidebarContent = await waitForElementPromise(sidebarContentSelector);
    // console.log(
    //   "[getElements]: Sidebar Content Element found:",
    //   sidebarContent
    // );

    const allChatsContainers =
      await waitForAllElementPromise<HTMLAnchorElement>(chatsContainerSelector);

    return { sidebarParent, sidebar, sidebarContent, allChatsContainers };
  } catch (error) {
    console.error("Error:", error);
  }
};

getElements().then((elements) => {
  if (!elements) {
    return;
  }

  const { sidebarParent, sidebar, sidebarContent, allChatsContainers } =
    elements;
  // Sidebar parent
  sidebarParent.id = "sidebar-parent";

  // Sidebar
  sidebar.id = "sidebar";
  sidebar.style.width = "500px";

  // Sidebar Content
  sidebarContent.id = "sidebar-content";
  sidebarContent.style.width = "500px";

  // All chats containers
  allChatsContainers.forEach((chatContainer, idx) => {
    console.log(`(${idx}) - ${chatContainer}`);
    chatContainer.classList.add("chat-container");
    getChildren(chatContainer, "div").forEach((child) => {
      console.log("Chat Title: ", child.textContent);
    });
  });

  main(elements);
});

// // Apply the resizable functionality to the sidebar
// waitForElement(".sidebar-selector", (sidebar) => {
//   interact(sidebar).resizable({
//     edges: { left: true, right: false, bottom: false, top: false }, // Allow resizing only from the left edge
//     listeners: {
//       move(event) {
//         let { x } = event.target.dataset; // Only handle horizontal movement

//         x = (parseFloat(x) || 0) + event.deltaRect.left;

//         // Apply the width changes
//         Object.assign(event.target.style, {
//           width: `${event.rect.width}px`,
//           transform: `translateX(${x}px)`, // Ensure the element is only moved horizontally
//         });

//         // Store the horizontal position
//         Object.assign(event.target.dataset, { x });
//       },
//     },
//     modifiers: [
//       interact.modifiers.restrictEdges({
//         outer: "parent",
//       }),
//       interact.modifiers.restrictSize({
//         min: { width: 150 }, // Minimum width
//       }),
//     ],
//     inertia: true,
//   });
// });
