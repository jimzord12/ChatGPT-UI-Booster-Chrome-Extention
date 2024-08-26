import { consoleStyles } from "../../content/constants/console-styles";
import { createNewColorPicker } from "../../lib/colorPicker/createPickr";
import { IdCounterSingleton } from "../../lib/id-counter/id-counter";
import {
  AllChatsMapType,
  ChatGroupType,
  ChatObject,
  PickrRoot,
} from "../../types/types";

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
// Adding grp info to Chats (At Init)
export async function attachMetadataToChats(
  allChatsMap: AllChatsMapType,
  allGrps: ChatGroupType[]
) {
  // const chats = Array.from(allChatsMap.entries());

  for (const grp of allGrps) {
    for (const chat of grp.chats) {
      const specificChat = allChatsMap.get(chat.id);

      if (!specificChat) {
        console.error(
          "[attachMetadataToChats]: AllChatsMap does not have: ",
          chat
        );
      } else {
        specificChat.grpId = grp.id; // 1. Add grp ID to Chats Map
        modifyChatHTMLElement(specificChat, grp);
      }
      // for (const [chatId, chat] of chats) {
      //   if (chatInGrp.grpId)
      // }
    }
  }
}

async function modifyChatHTMLElement(
  chat: Omit<ChatObject, "id">,
  chatGrp: ChatGroupType
) {
  console.log("%c🐱‍👤 Modifying HTML of: ", consoleStyles.info, chat);
  // 1. Add a custom data-* attribute so that the HTML has some metadata just in case.
  chat.htmlRef.setAttribute("data-grp-id", chatGrp.id.toString());

  // 2. Create the ChatGroup Identifier and append it to the chat
  const colorPickerContainer = document.createElement("div");
  chat.htmlRef.appendChild(colorPickerContainer);

  const pickrInstance = await createNewColorPicker(
    colorPickerContainer,
    (selectedColor) => {
      console.log(
        "%cYOU SELECTED THIS COLOR: ",
        consoleStyles.highlight,
        selectedColor
      );
    }
  );

  const colorPickerRoot = pickrInstance?.getRoot() as PickrRoot;
  if (!colorPickerRoot) {
    console.log("colorPickerRoot: ", colorPickerRoot);
    throw new Error("[modifyChatHTMLElement]: Problem with Color Picker HTML");
  }
  console.log("colorPickerRoot: ", colorPickerRoot);

  const pickrBtn = colorPickerRoot.button;

  pickrBtn.style.cssText = `--pcr-color: ${chatGrp.color}`;
  pickrBtn.classList.add("group-circle");

  // chat.htmlRef.appendChild(grpColorCircleDiv);

  console.log("%c children: ", consoleStyles.highlight, chat.htmlRef.children);

  // chat.htmlRef.appendChild(grpColorCircleDiv);

  // Manually trigger Coloris on click
  colorPickerHTML.addEventListener("click", () => {
    console.log(
      "%c(Personal OnClick handler): Clicked the Color Picker!",
      consoleStyles.info
    );
  });

  console.log("%c🐱‍👤 Modifycation Completed", consoleStyles.success);
}
