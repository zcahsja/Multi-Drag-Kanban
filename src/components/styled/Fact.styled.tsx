import styled from "@emotion/styled";
import { dndClasses } from "../../utils/constants";

export const Fact$div = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 5px;
  padding-left: 5px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  cursor: grab;

  &.${dndClasses.dragging} {
    opacity: 0.3;
  }
  &.${dndClasses.ghosting} {
    opacity: 0.3;
    display: none;
  }
  &.${dndClasses.selected} {
    background-color: green;
  }
  &.${dndClasses.dragOverlay} {
    cursor: grabbing;
    background-color: green;
  }
`;
