import { ChatGroupType, ChatObject, StateKey } from "../../types/types";
import { createNewChatGroup } from "../../utils/helpers/chat-group-manager";
import { IdCounterSingleton } from "../id-counter/id-counter";

export default class StateManager {
  private static instance: StateManager;
  private storage: chrome.storage.LocalStorageArea;
  private _initialized: Promise<void>;

  private constructor(storageType = "local") {
    this.storage =
      storageType === "sync" ? chrome.storage.sync : chrome.storage.local;

    this._initialized = this.setup(); // Ensure setup is handled via a promise
  }

  static async getInstance(storageType = "local"): Promise<StateManager> {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager(storageType);
    }
    await StateManager.instance._initialized;
    return StateManager.instance;
  }

  private async setup(): Promise<void> {
    const grpCounter = await this.getState<number>("chatGroupIdCounter");
    if (typeof grpCounter !== "number" || grpCounter < 0) {
      IdCounterSingleton.getInstance(0); // Initialize the counter to 0
      await this.setState("chatGroupIdCounter", 0);
    } else {
      IdCounterSingleton.getInstance(grpCounter);
    }
  }

  async getState<T>(key: StateKey): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve, reject) => {
      this.storage.get([key], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[key]);
      });
    });
  }

  async setState(key: StateKey, value: unknown): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storage.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  async removeState(key: StateKey): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storage.remove([key], () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  async clearState(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  onStateChange(callback: (changes: chrome.storage.StorageChange) => void) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (
        areaName === (this.storage === chrome.storage.sync ? "sync" : "local")
      ) {
        callback(changes);
      }
    });
  }

  async getGroups(): Promise<ChatGroupType[]> {
    return (await this.getState<ChatGroupType[]>("chatGroups")) || [];
  }

  async addGroup(name: string): Promise<void> {
    const groups = (await this.getGroups()) || [];

    if (groups.some((grp) => grp.title === name)) {
      throw new Error(`Group title (${name}) already exists`);
    }

    // Internally it uses the IdCounterSingleton to generate the id
    const newGroup = createNewChatGroup(name);
    groups.push(newGroup);

    await this.updateCounter();
    await this.setState("chatGroups", groups);
  }

  async removeGroup(group: ChatGroupType): Promise<void> {
    const groups = await this.getGroups();
    const updatedGroups = groups.filter((grp) => grp.id !== group.id);
    await this.setState("chatGroups", updatedGroups);
  }

  async addChatToGroup(chat: ChatObject, group: ChatGroupType): Promise<void> {
    const groups = await this.getGroups();
    const desiredGroup = groups.find((grp) => grp.id === group.id);
    if (!desiredGroup) {
      throw new Error("Group not found");
    }

    desiredGroup.chats.push(chat);
    await this.setState("chatGroups", groups);
  }

  async removeChatFromGroup(chat: ChatObject): Promise<void> {
    const groups = await this.getGroups();
    const desiredGroup = groups.find((grp) => chat.grpId === grp.id);
    if (!desiredGroup) {
      throw new Error("Group not found");
    }

    desiredGroup.chats = desiredGroup.chats.filter((c) => c.id !== chat.id);
    await this.setState("chatGroups", groups);
  }

  async updateCounter() {
    const counter = IdCounterSingleton.getInstance();
    await this.setState("chatGroupIdCounter", counter.current);
  }
}
