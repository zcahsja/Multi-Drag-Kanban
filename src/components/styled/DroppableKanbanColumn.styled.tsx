import styled from "@emotion/styled";
import { CSS } from "@dnd-kit/utilities";
import { dndClasses } from "../../utils/constants";
export const ColumnContainer$div = styled.div<{ transition; transform }>`
  border: 1px solid;
  border-color: black;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 6px;
  padding: 6px;
  background-color: grey;
  ${({ transform, transition }) => `
  transform: ${CSS.Transform.toString(transform)};
  transition: ${transition};
  `}
  &.${dndClasses.dragging} {
    opacity: 0.5;
  }
  &.${dndClasses.overContainer} {
    background-color: purple;
  }
`;
export const FactsContainer$div = styled.div`
  overflow: auto;
  flex: 1;
`;

export const ColumnLabel$p = styled.p`
  margin: 0;
`;

export const FactCount$div = styled.div`
  border-radius: 20%;
  border: 1px solid;
  height: 30px;
  width: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 1rem;
  cursor: pointer;
`;

export const Header$div = styled.div`
  padding: 6px;
  margin-bottom: 6px;
  color: black;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Footer$div = styled.div`
  padding: 0;
  margin-top: 6px;
  display: flex;
  flex-direction: row;
`;

export const LabelAndHandleContainer$div = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  :hover {
    .kanbanColumnHandle {
      display: flex;
    }
  }
`;

export const HandleContainer$div = styled.div`
  display: none;
`;
