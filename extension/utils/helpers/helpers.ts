export const waitForElement = (
  selector: string,
  callback: (element: HTMLElement) => void
) => {
  const interval = setInterval(() => {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 250);
};

export const waitForElementPromise = async (selector: string) => {
  return new Promise<HTMLElement>((resolve, reject) => {
    const interval = setInterval(() => {
      const element = document.querySelector(selector) as HTMLElement | null;
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else {
        const timer = setTimeout(() => {
          reject("TimedOut (10s): Element not found");
          clearTimeout(timer);
          clearInterval(interval);
        }, 10 * 1000);
      }
    }, 250);
  });
};

export const waitForAllElementPromise = async <T extends Element>(
  selector: string
) => {
  return new Promise<NodeListOf<T>>((resolve, reject) => {
    const interval = setInterval(() => {
      const elements = document.querySelectorAll<T>(selector);
      if (elements.length > 0) {
        clearInterval(interval);
        resolve(elements);
      } else {
        const timer = setTimeout(() => {
          reject("TimedOut (10s): Elements not found");
          clearTimeout(timer);
          clearInterval(interval);
        }, 10 * 1000);
      }
    }, 250);
  });
};

export const getChildren = (parentElement: HTMLElement, selector: string) => {
  return parentElement.querySelectorAll(selector);
};
