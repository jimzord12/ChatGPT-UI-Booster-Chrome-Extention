import Pickr from "@simonwep/pickr";
import { consoleStyles } from "../../content/constants/console-styles";

export async function createNewColorPicker(
  element: HTMLElement,
  onChangeColorCb: (selectedColor: string) => void
): Promise<Pickr | undefined> {
  console.log("%cInitialzing Pickr", consoleStyles.info);
  // Initialize Pickr
  try {
    const pickr = new Pickr({
      el: element,
      theme: "nano", // or 'monolith', 'nano'

      // Color picker options
      swatches: [
        "rgba(244, 67, 54, 1)",
        "rgba(233, 30, 99, 1)",
        "rgba(156, 39, 176, 1)",
        "rgba(103, 58, 183, 1)",
        "rgba(63, 81, 181, 1)",
        "rgba(33, 150, 243, 1)",
        "rgba(3, 169, 244, 1)",
        "rgba(0, 188, 212, 1)",
        "rgba(0, 150, 136, 1)",
        "rgba(76, 175, 80, 1)",
        "rgba(139, 195, 74, 1)",
        "rgba(205, 220, 57, 1)",
        "rgba(255, 235, 59, 1)",
        "rgba(255, 193, 7, 1)",
      ],

      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: true,
          save: true,
        },
      },
    });

    // Event listener for color change
    pickr.on("change", (color: Pickr.HSVaColor) => {
      const selectedColor = color.toHEXA().toString();
      console.log("Selected Color:", selectedColor);

      onChangeColorCb(selectedColor);
    });

    return new Promise<Pickr>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject("ColorPicker Initialazation TimedOut!");
        clearTimeout(timeout);
      }, 1000);

      pickr.on("init", (instance: Pickr) => {
        clearTimeout(timeout);
        resolve(instance);
      });
    });
  } catch (error) {
    console.error("[Init]: Pickr Error: ", error);
  }
}
