import { IdCounterSingleton } from "../../lib/id-counter/id-counter";
import { ChatGroupType } from "../../types/types";

/**
 * Creates a new chat group.
 *
 * @param name - The name of the chat group.
 * @returns The newly created chat group.
 */
export function createNewChatGroup(name: string): ChatGroupType {
  const counter = IdCounterSingleton.getInstance();
  const groupId = counter.provideCurrentAndIncrement();

  return {
    id: groupId,
    title: name,
    chats: [],
    color: generateColorBasedOnId(groupId),
  };
}

function generateColorBasedOnId(id: number) {
  const hue = (id * 137.508) % 360;
  const sat = 70;
  const light = 50;

  return `hsl(${hue}, ${sat}%, ${light}%)`;
}
