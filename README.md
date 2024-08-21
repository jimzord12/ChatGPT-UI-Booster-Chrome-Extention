# A ChatGPT UI Booster Chrome Extention

## Purpose

To enchance the current UI provided by OpenAI's ChatGPT Web App.

## Features

1. Modify UI

   - Sidebar's Width (from default up to 50%)
   - Chat's Content Width (from default up to 100% of the container's width)

2. Chat Searching using keywords (_can read only title, not content_)

3. Chat Grouping

   - Group Filtering, only show chats that belong to the selected group.
   -

## Requirements (How to set up)

### Popup (Frontend part)

#### 1. Vite's Vanilla Typescript Template was used.

#### 2. ESLint, required plugins:

    ```
    eslint-config-standard
    eslint-plugin-tailwindcss
    eslint-config-prettier
    @typescript-eslint/eslint-plugin
    @typescript-eslint/parser
    ```

    see this [ChatGPT chat](https://chatgpt.com/share/ae1cdf29-25bf-46bd-ac77-7aaf891c69e6) for more details

#### 3. Tailwindcss [Vite Guide](https://tailwindcss.com/docs/guides/vite)

    1. Install and Initialize it

    ```
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

    2. Go to the generated tailwindcss.config.js file and override the content property like so:

    ```
      content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
    ```

    3. Go to your base/global .css file and add these to the top:

    ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

    4. Tailwindcss should work now.

    5. I also do not know why Vite does not include Tailwindcss in its templates.

#### Vite Custom Plugin

Because Vite was not built for creating the UI for Chrome extentions, we need to configure it.

To configure Vite you need a `vite.config.js` file at the root of the project.

Additionally, the required logic is encapulated inside a custom-made plugin:

```
vite_plugins/custom-chrome-ext-plugin
```

### Content Script (Web Page Modifier Script)

_what is a [content-script.js (Google Extensions Docs)](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)?_

_In a nutshell, it allows us to manipulate Web Pages. As in our case we want to boost the ChatGPT UI functionalities, this is ideal._

We shall consider this script as a different part of the Extension, therefore we need to setup a different environment for this `content-script.js` file.

Thankfully, we can use [Parcel](https://parceljs.org/) a JS Bundler which will allow us to write using TypeScript and all the modern features with almost no configurations.

Start by installing it:

```
pnpm install --save-dev parcel
```

Afterwards, we only to add a single run script to our `package.json` file:

```
"parcel-build": "parcel build extension/content/content-script.ts --dist-dir extension/content/dist"
```
