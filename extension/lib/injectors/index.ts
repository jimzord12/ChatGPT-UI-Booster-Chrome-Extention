import { sidebarNavSelector } from "../../content/constants/elementSelectors";
import StateManager from "../state-manager/stateManager";

export function runInjectors() {
  injectClearStateManager();
  createAClearStateButton().then((button) => {
    const sidebarNav = document.querySelector(sidebarNavSelector);
    if (!sidebarNav) {
      console.log("🐱‍👤 Sidebar Nav not found");
      return;
    }
    sidebarNav.appendChild(button);
    console.log("🐱‍👤 This Button: ", button);
    console.log("🐱‍👤 Should be added to the Sidebar Navbar");
  });
}

async function injectClearStateManager() {
  //   const script = document.createElement("script");
  //   script.src = chrome.runtime.getURL("state-manager-injector.js");
  //   console.log("🐱‍👤 Script URL: ", script.src);
  //   console.log("🐱‍👤 Script Content: ", script);
  //   (document.body || document.documentElement).appendChild(script);
}

async function createAClearStateButton() {
  console.log("🐱‍👤 Trying to Add a Button...");

  const button = document.createElement("button");
  const classes = [
    "h-10",
    "rounded-lg",
    "px-2",
    "text-token-text-secondary",
    "focus-visible:outline-0",
    "disabled:text-token-text-quaternary",
    "focus-visible:bg-token-sidebar-surface-secondary",
    "enabled:hover:bg-token-sidebar-surface-secondary",
  ];

  button.classList.add(...classes);

  button.textContent = "Clear State";
  const stateManager = await StateManager.getInstance();

  button.onclick = async () => {
    console.log(
      "[1] - 🐱‍👤 The Current State: ",
      await stateManager.getGroups()
    );
    stateManager.clearState();
    console.log("[2] - 🐱‍👤 State Cleared");
    console.log("[3] - 🐱‍👤 The New State: ", await stateManager.getGroups());
  };

  return button;
}
