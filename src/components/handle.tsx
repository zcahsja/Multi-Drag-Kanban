import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import styled from "@emotion/styled";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import cx from "classnames";
import type { FunctionComponent } from "react";
import { dndClasses } from "../utils/constants";

const DragIndicatorIcon$Mui = styled(DragIndicatorIcon)`
  cursor: grab;
  &.${dndClasses.dragging} {
    cursor: grabbing;
  }
`;

interface HandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap;
  isDragging: boolean;
}

export const Handle: FunctionComponent<HandleProps> = ({
  attributes,
  listeners,
  isDragging
}) => {
  return (
    <DragIndicatorIcon$Mui
      {...attributes}
      {...listeners}
      className={cx({
        [dndClasses.dragging]: isDragging
      })}
    />
  );
};
