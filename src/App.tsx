import React, { useState } from "react";
import styled from "styled-components";
import Note from "./components/Note";
import GlobalStyles from "./styles/global";
import { Note as NoteType } from "./interfaces/note";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 28px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const Board = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  margin-top: 20px;
  padding: 28px;
  background-color: #dbdbdb6b;
  border-radius: 4px;
  display: flex;
  gap: 28px;
`;

const TrashZone = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background-color: #f437374c;
  border: 2px dashed #f43737;
  border-top: none;
  border-right: none;
  border-bottom-left-radius: 200px;
  z-index: 100;

  span {
    position: absolute;
    top: 30%;
    right: 20%;
    width: 50%;
    text-align: center;
    color: #e12626;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

type SquareType = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const Square = styled.div<SquareType>`
  position: absolute;
  border: 2px dashed #72727269;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const trashSize = {
  width: 200,
  height: 200,
};

const initialSquare = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
};

const colors = ["#fff9b5", "#d5f693", "#ff9e4a", "#7d93ff"];

function App() {
  const [notes, setNotes] = useState<NoteType[]>([
    {
      id: 1,
      text: "Lorem Ipsum",
      color: colors[0],
      position: { x: 50, y: 50 },
      size: { width: 120, height: 120 },
    },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [square, setSquare] = useState<SquareType>(initialSquare);

  const createNote = () => {
    if (square.width > 0 && square.height > 0) {
      const newId = notes.length > 0 ? notes[notes.length - 1].id + 1 : 1;
      const newColor = Math.floor(Math.random() * colors.length);
      setNotes([
        ...notes,
        {
          id: newId,
          text: "Lorem Ipsum",
          color: colors[newColor],
          position: { x: square.left, y: square.top },
          size: { width: square.width, height: square.height },
        },
      ]);
    }
    setSquare({ ...initialSquare });
  };

  const editNote = (id: number, newText: string) => {
    setNotes(
      notes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            text: newText,
          };
        }

        return note;
      })
    );
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const { currentTarget } = event;
    const id = Number(event.dataTransfer.getData("id"));

    setIsDragging(false);

    const noteOffset = [
      Number(event.dataTransfer.getData("x")) - currentTarget.offsetLeft,
      Number(event.dataTransfer.getData("y")) - currentTarget.offsetTop,
    ];
    const position = {
      x: event.clientX - currentTarget.offsetLeft - noteOffset[0],
      y: event.clientY - currentTarget.offsetTop - noteOffset[1],
    };

    const boardRect = currentTarget.getBoundingClientRect();

    if (
      position.x > boardRect.width - trashSize.width &&
      position.y < trashSize.height
    ) {
      setNotes(notes.filter((note) => note.id !== id));
    } else {
      setNotes(
        notes.map((note) => {
          if (note.id === id) {
            return {
              ...note,
              position,
            };
          }

          return note;
        })
      );
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const x = event.clientX - event.currentTarget.offsetLeft;
    const y = event.clientY - event.currentTarget.offsetTop;
    const isNote = notes.some((note) => {
      return (
        x >= note.position.x &&
        x <= note.position.x + note.size.width &&
        y >= note.position.y &&
        y <= note.position.y + note.size.height
      );
    });

    if (isNote) {
      return;
    }

    if (!isDragging) {
      setIsDrawing(true);
      setSquare({
        ...square,
        left: x,
        top: y,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && isDrawing) {
      setSquare({
        ...square,
        width: event.clientX - event.currentTarget.offsetLeft - square.left,
        height: event.clientY - event.currentTarget.offsetTop - square.top,
      });
    }
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      setIsDrawing(false);
      createNote();
    }
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <div>
          <Header>
            <Title>Sticky Notes</Title>
          </Header>
          <main>
            <Board
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {notes.length > 0 &&
                notes.map((note) => (
                  <Note key={note.id} data={note} onEdit={editNote} />
                ))}
              <TrashZone>
                <span>Drag here to remove</span>
              </TrashZone>
              {isDrawing && (
                <Square
                  top={square.top}
                  left={square.left}
                  width={square.width}
                  height={square.height}
                />
              )}
            </Board>
          </main>
        </div>
      </Container>
    </>
  );
}

export default App;
