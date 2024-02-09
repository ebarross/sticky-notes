# Sticky Notes

## About the project

The project was built using Vite, React, TypeScript and Styled Components.

### Solution

**1. Create a new note of the specified size at the specified position**  
 The mouse event handlers (`onmousedown`, `onmousemove`, `onmouseup`) were used to create a square for the note shape. Thus, the user can make a new note by drawing it on a board, specifying its size and position. It is created with a random color and a "Lorem Ipsum" text, that can be edited by clicking on it and pressing `Enter` to save.

**2. Change note size by dragging**  
 Not implemented

**3. Move a note by dragging**  
 The Drag and Drop API was used to allow moving a note, changing its position on the board. The note receives a `draggable` property and an event handler (`ondragstart`) passing the cursor position based on its current position. On the other hand, the board (drop zone) receives another event handler (`ondrop`) to calculate the target position to move the note.

**4. Remove a note by dragging it over a predefined "trash" zone**  
 To remove a note, the `ondrop` event handler calculates the target position, then identifies when the note is being moved into a "trash" zone created inside the board.

## Running the project

This is an example of how you can run the project locally.

### Installation

1. Go to project directory

```sh
cd sticky-notes
```

2. Install NPM packages

```sh
npm install
```

### Running

Run the project locally

```sh
npm run dev
```

The project will run on `http://localhost:5173`.
