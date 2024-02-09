import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Note as NoteType } from "../interfaces/note";

type StyledProps = Pick<NoteType, "color" | "position" | "size">;

const Container = styled.div<StyledProps>`
  width: ${(props) => props.size.width}px;
  height: ${(props) => props.size.height}px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  position: absolute;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  font-size: 0.8rem;
  padding: 8px;
  box-shadow: 1px 3px 8px -2px #72727269;
  cursor: pointer;

  input {
    width: 100%;
  }
`;

type Props = {
  data: NoteType;
  onEdit: (id: number, newText: string) => void;
};

function Note({ data, onEdit }: Props) {
  const [value, setValue] = useState(data.text);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const mousePositionX = event.clientX - event.currentTarget.offsetLeft;
    const mousePositionY = event.clientY - event.currentTarget.offsetTop;
    event.dataTransfer.setData("x", String(mousePositionX));
    event.dataTransfer.setData("y", String(mousePositionY));
    event.dataTransfer.setData("id", String(data.id));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      saveInput();
    }
  };

  const saveInput = () => {
    setEditing(false);
    onEdit(data.id, value);
  };

  return (
    <Container
      draggable
      onClick={() => setEditing(true)}
      onDragStart={handleDragStart}
      color={data.color}
      position={data.position}
      size={data.size}
    >
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={saveInput}
        />
      ) : (
        <span>{data.text}</span>
      )}
    </Container>
  );
}

export default Note;
