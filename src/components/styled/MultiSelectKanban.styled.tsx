import styled from "@emotion/styled";

export const SelectionCount = styled.div`
  right: -5px;
  top: -5px;
  color: yellow;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  line-height: 30px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

export const KanbanContainer$div = styled.div<{ numOfCols }>`
  display: grid;
  grid-template-columns: repeat(${({ numOfCols }) => numOfCols}, 1fr);
  padding: 10px; //spacing.XL
  grid-column-gap: 6px; //spacing.XL
  overflow: auto;
`;
