export type ChatObject = {
  id: string;
  title: string;
  htmlRef: HTMLAnchorElement;
  grpId?: number;
};

export type ChatGroupType = {
  id: number;
  title: string;
  chats: ChatObject[];
  color: string;
};

export type AllChatsMapType = Map<string, Omit<ChatObject, "id">>;

export type FetchedElements =
  | {
      sidebarParent: HTMLElement;
      sidebar: HTMLElement;
      sidebarContent: HTMLElement;
      allChatsContainers: NodeListOf<HTMLAnchorElement>;
    }
  | undefined;

export type StateKey = "chatGroups" | "userPrefs" | "chatGroupIdCounter";

export type IdCounter = {
  current: number;
  increment: () => number;
  decrement: () => number;
  reset: () => number;
  specify: (num: number) => number;
};
