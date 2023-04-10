import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import cx from "classnames";
import type { FunctionComponent } from "react";
import { dndClasses } from "../utils/constants";
import { Handle } from "./handle";
import { Fact } from "../utils/types";
import { getSelectedMap } from "../utils/helpers";
import { SortableFact } from "./SortableFact";
import {
  ColumnContainer$div,
  ColumnLabel$p,
  FactCount$div,
  FactsContainer$div,
  HandleContainer$div,
  Header$div,
  LabelAndHandleContainer$div
} from "./styled/DroppableKanbanColumn.styled";

export const DroppableKanbanColumn: FunctionComponent<{
  id: string;
  facts: Fact[];
  selectedFactUids: string[];
  toggleSelection: (factUid: string) => void;
  toggleSelectionInGroup: (factUid: string) => void;
  multiSelectTo: (newFactId: string) => void;
  activeId: string;
}> = ({
  id,
  facts,
  selectedFactUids,
  toggleSelection,
  toggleSelectionInGroup,
  multiSelectTo,
  activeId
}) => {
  const { setNodeRef: setFactNodeRef } = useDroppable({ id });
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef: setColumnNodeRef,
    transition,
    transform,
    over: draggedOver
  } = useSortable({
    id
  });
  const factUids = facts.reduce((acc, curr) => {
    acc[curr.uid] = true;
    return acc;
  }, {});
  const isOverContainer = draggedOver?.id in factUids;

  return (
    <ColumnContainer$div
      ref={setColumnNodeRef}
      transform={transform}
      transition={transition}
      className={cx({
        [dndClasses.dragging]: isDragging,
        [dndClasses.overContainer]: !isDragging && isOverContainer
      })}
    >
      <Header$div>
        <LabelAndHandleContainer$div>
          <HandleContainer$div className="kanbanColumnHandle">
            <Handle
              attributes={attributes}
              listeners={listeners}
              isDragging={isDragging}
            />
          </HandleContainer$div>
          <ColumnLabel$p>{id}</ColumnLabel$p>
        </LabelAndHandleContainer$div>
        <FactCount$div>{facts.length}</FactCount$div>
      </Header$div>

      <SortableContext
        id={id}
        items={facts.map((fact) => fact.uid)}
        strategy={verticalListSortingStrategy}
      >
        <FactsContainer$div ref={setFactNodeRef}>
          {facts.map((fact) => {
            const isSelected: boolean = Boolean(
              getSelectedMap(selectedFactUids)[fact.uid]
            );
            const isGhosting: boolean =
              isSelected && Boolean(activeId) && activeId !== fact.uid;
            return (
              <SortableFact
                key={fact.uid}
                fact={fact}
                isSelected={isSelected}
                isGhosting={isGhosting}
                toggleSelection={toggleSelection}
                toggleSelectionInGroup={toggleSelectionInGroup}
                multiSelectTo={multiSelectTo}
                activeId={activeId}
              />
            );
          })}
        </FactsContainer$div>
      </SortableContext>
    </ColumnContainer$div>
  );
};
