# Project File and Component Explanation

This document provides a detailed explanation of the files and components in the Home Design project. This is intended to be a reference for recreating the application in Flutter.

## Project Overview

This is a web-based 2D home design tool created with React, TypeScript, and Vite. It allows users to define a plot size, and then add, move, resize, and customize rooms and other house elements like doors, windows, and stairs on a 2D canvas. The project is styled with Tailwind CSS.

**Core Technologies:**

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite:** A fast build tool and development server for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
*   **html2canvas:** A library to take "screenshots" of web pages or parts of it, directly on the users browser.
*   **lucide-react:** A library for simply beautiful open-source icons.

## Root Directory Files

*   `.gitignore`: Specifies which files and folders should be ignored by Git.
*   `index.html`: The main entry point for the web application. The React app is mounted into a `<div>` in this file.
*   `package.json`: Contains project metadata, scripts (for development, building, deploying), and a list of dependencies.
*   `package-lock.json`: Records the exact versions of all dependencies, ensuring consistent installations across different environments.
*   `postcss.config.js`: Configuration file for PostCSS, a tool for transforming CSS with JavaScript plugins. Used here for `autoprefixer`.
*   `tailwind.config.js`: Configuration file for Tailwind CSS. Used to customize the design system (colors, fonts, etc.).
*   `tsconfig.json` & `tsconfig.node.json`: TypeScript configuration files for the project and for Node.js-specific parts of the build process (like the Vite config).
*   `vite.config.ts`: Configuration file for Vite. It defines how the project is built and served.
*   `README.md` and other `.md` files: Documentation files.

## `src` Directory

This directory contains the main source code for the application.

*   `App.tsx`: The root component of the application. It manages the main state of the project (the `Project` object) and renders either the `PlotSetup` component or the main `Canvas` component.
*   `index.css`: Contains global CSS styles and Tailwind CSS imports.
*   `main.tsx`: The entry point of the React application. It renders the `App` component into the DOM.
*   `types.ts`: Contains all the TypeScript type definitions for the project, such as `Project`, `Room`, and `Element`. This is a crucial file for understanding the data structures.

### `src/components` Directory

This directory contains all the React components used in the application.

*   `Canvas.tsx`: This is the core component of the application. It handles the rendering of the plot, rooms, and elements. It also manages user interactions like dragging, resizing, panning, and zooming. It contains the main logic for adding, deleting, and updating rooms and elements.
*   `DoorElement.tsx`: A component that renders a door element on the canvas.
*   `ElementPalette.tsx`: A UI component that displays a palette of available elements (doors, windows, stairs) that can be added to the canvas.
*   `MobileTutorial.tsx`: A component that shows a tutorial for mobile users on their first visit.
*   `PlotSetup.tsx`: The initial screen where the user sets up the width and height of the plot.
*   `PropertiesPanel.tsx`: A panel that displays the properties of the selected room or element. It allows the user to edit properties like dimensions, opacity, and to delete or duplicate the selected item.
*   `RoomPalette.tsx`: A UI component that displays a palette of available room types (Bedroom, Kitchen, etc.) that can be added to the canvas.
*   `StairsElement.tsx`: A component that renders a stairs element on the canvas.
*   `Toast.tsx`: A component for displaying toast notifications (e.g., "Room added", "Project saved").
*   `Toolbar.tsx`: The toolbar component that allows the user to switch between different tools like 'select', 'erase', and 'rotate'.
*   `WindowElement.tsx`: A component that renders a window element on the canvas.

### `src/utils` Directory

This directory contains utility functions that can be reused across the application.

*   `exportImage.ts`: Contains functions for exporting the canvas content as a PNG or JPG image, using the `html2canvas` library.
