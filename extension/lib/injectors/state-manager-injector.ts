// content-script.js

import StateManager from "../state-manager/stateManager";

function injectClearStateManager() {
  window.clearStateManager = async function () {
    // Ensure the StateManager is properly initialized
    const stateManager = await StateManager.getInstance();

    // Clear the StateManager (which also clears the extension storage)
    await stateManager.clearState();

    console.log("StateManager and extension storage cleared.");
  };
}

// Inject the function into the window object
const script = document.createElement("script");
script.id = "clearStateManager";
script.textContent = `(${injectClearStateManager.toString()})();`;
(document.body || document.documentElement).appendChild(script);
// script.remove();
