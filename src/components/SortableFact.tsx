import { useSortable } from "@dnd-kit/sortable";
import type { FunctionComponent } from "react";
import { primaryButton } from "../utils/constants";
import SingleFact from "./Fact";
import { FactContainer$div } from "./styled/SortableFact.styled";
import { Fact } from "../utils/types";
import {
  wasMultiSelectKeyUsed,
  wasToggleInSelectionGroupKeyUsed
} from "../utils/helpers";

export const SortableFact: FunctionComponent<{
  fact: Fact;
  toggleSelection: (factUid: string) => void;
  toggleSelectionInGroup: (factUid: string) => void;
  multiSelectTo: (newFactId: string) => void;
  isSelected: boolean;
  isGhosting: boolean;
  activeId: string;
}> = ({
  fact,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  isGhosting,
  isSelected,
  activeId
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: fact.uid });

  const performAction = (event: MouseEvent | KeyboardEvent) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      toggleSelectionInGroup(fact.uid);
      return;
    }
    if (wasMultiSelectKeyUsed(event)) {
      multiSelectTo(fact.uid);
      return;
    }
    toggleSelection(fact.uid);
  };

  // Using onClick as it will be correctly
  // preventing if there was a drag
  const handleClick = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.button !== primaryButton) {
      return;
    }
    // marking the event as used
    event.preventDefault();
    performAction(event);
  };

  const dndProps = { isSelected, isDragging, isGhosting };

  return (
    <FactContainer$div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      transition={transition}
      transform={transform}
    >
      <SingleFact fact={fact} dndProps={dndProps} />
    </FactContainer$div>
  );
};
