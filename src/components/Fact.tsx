import cx from "classnames";
import type { FunctionComponent } from "react";
import { dndClasses } from "../utils/constants";
import { Fact$div } from "./styled/Fact.styled";
import type { DndClassProps, Fact } from "../utils/types";

export const SingleFact: FunctionComponent<{
  fact: Fact;
  dndProps?: DndClassProps;
}> = ({ fact, dndProps }) => {
  const { isDragging, isSelected, isGhosting, isDragOverlay } = dndProps;
  return (
    <Fact$div
      className={cx({
        [dndClasses.dragging]: isDragging,
        [dndClasses.ghosting]: isGhosting,
        [dndClasses.selected]: isSelected,
        [dndClasses.dragOverlay]: isDragOverlay
      })}
    >
      {fact.content}
    </Fact$div>
  );
};

export default SingleFact;
