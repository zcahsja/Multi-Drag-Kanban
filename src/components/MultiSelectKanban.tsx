import type { UniqueIdentifier } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext
} from "@dnd-kit/sortable";
import type { FunctionComponent } from "react";
import { useEffect, useRef, useState } from "react";
import { getInitialBucketsData, kanbanBuckets } from "../utils/data";
import { useAppSensors } from "../hooks/useAppSensors";
import {
  KanbanContainer$div,
  SelectionCount
} from "./styled/MultiSelectKanban.styled";
import type { Bucket, ReorderResult } from "../utils/types";
import {
  customCollisionDetectionStrategy,
  getBucketFacts,
  getBucketIdx,
  multiDragAwareReorder,
  multiSelectTo as multiSelect
} from "../utils/helpers";
import { DroppableKanbanColumn } from "./DroppableKanbanColumn";
import { SingleFact } from "./Fact";

export const MultiSelectKanban: FunctionComponent<{}> = () => {
  const [data, setData] = useState(() => getInitialBucketsData(kanbanBuckets));
  const [activeId, setActiveId] = useState<string>(null);
  const [selectedFactUids, setSelectedFactUids] = useState(() => []);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const sensors = useAppSensors();

  const unselectAll = () => {
    setSelectedFactUids([]);
  };

  const handleWindowClick = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    unselectAll();
  };

  useEffect(() => {
    window.addEventListener("click", handleWindowClick);
    return () => {
      // Anything in here is fired on component unmount.
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const setBucketsAndSelectedFacts = (
    buckets: Bucket[],
    selectedFactUids: string[]
  ) => {
    if (!buckets) return;
    setData((oldData) => {
      return {
        ...oldData,
        buckets
      };
    });

    setSelectedFactUids(selectedFactUids);
  };

  const handleDragStart = ({ active }) => {
    const selected: string = selectedFactUids.find(
      (factUid: string): boolean => factUid === active.id
    );

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      unselectAll();
    }

    setActiveId(active.id);
  };
  const handleDragCancel = () => setActiveId(null);
  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;

    if (overId === null || active.id in data.bucketLabels) {
      return;
    }

    const processed: ReorderResult = multiDragAwareReorder({
      buckets: data.buckets,
      bucketLabels: data.bucketLabels,
      selectedFactIds: selectedFactUids,
      active,
      over,
      mapIdToFact: data.mapIdToFact
    });

    setBucketsAndSelectedFacts(processed?.buckets, processed?.selectedFactIds);
  };

  const handleDragEnd = ({ active, over }) => {
    if (active.id in data.bucketLabels && over?.id) {
      setData((data) => {
        const activeIndex = data.buckets.findIndex(
          (bucket) => bucket.label === active.id
        );
        const overIndex = data.buckets.findIndex(
          (bucket) => bucket.label === over.id
        );

        return {
          ...data,
          buckets: arrayMove(data.buckets, activeIndex, overIndex)
        };
      });
      setActiveId(null);
      return;
    }

    if (!over) {
      setActiveId(null);
      return;
    }

    const processed: ReorderResult = multiDragAwareReorder({
      buckets: data.buckets,
      bucketLabels: data.bucketLabels,
      selectedFactIds: selectedFactUids,
      active,
      over,
      mapIdToFact: data.mapIdToFact
    });

    setBucketsAndSelectedFacts(processed?.buckets, processed?.selectedFactIds);
    setActiveId(null);
  };

  const collisionDetectionStrategy = customCollisionDetectionStrategy({
    containerIds: data.bucketLabels,
    activeId,
    lastOverId,
    recentlyMovedToNewContainer,
    getContainerIdx: getBucketIdx(data.buckets),
    getContainerItems: getBucketFacts(data.buckets)
  });

  const toggleSelection = (factUid: string) => {
    const selectedFactIds: string[] = selectedFactUids;
    const wasSelected: boolean = selectedFactIds.includes(factUid);

    let newFactIds: string[] = [];
    // Task was not previously selected
    // now will be the only selected item
    if (!wasSelected) {
      newFactIds = [factUid];
    }

    // Task was part of a selected group
    // will now become the only selected item
    else if (selectedFactIds.length > 1) {
      newFactIds = [factUid];
    }

    setSelectedFactUids(newFactIds);
  };

  const toggleSelectionInGroup = (factUid: string) => {
    const selectedFactIds: string[] = selectedFactUids;
    const index: number = selectedFactIds.indexOf(factUid);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedFactUids([...selectedFactIds, factUid]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    setSelectedFactUids((previous) => {
      const filteredSelection = previous.filter((_, i) => i !== index);
      return filteredSelection;
    });
  };

  // This behaviour matches the MacOSX finder selection
  const multiSelectTo = (newFactId: string) => {
    const updated: string[] = multiSelect(
      data.buckets,
      selectedFactUids,
      newFactId
    );

    if (updated === null) {
      return;
    }

    setSelectedFactUids(updated);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <KanbanContainer$div numOfCols={data.buckets.length}>
        <SortableContext
          items={data.buckets.map((bucket) => bucket.label)}
          strategy={horizontalListSortingStrategy}
        >
          {data.buckets.map((bucket) => (
            <DroppableKanbanColumn
              key={bucket.label}
              id={bucket.label}
              facts={bucket.facts}
              selectedFactUids={selectedFactUids}
              toggleSelection={toggleSelection}
              toggleSelectionInGroup={toggleSelectionInGroup}
              multiSelectTo={multiSelectTo}
              activeId={activeId}
            />
          ))}
        </SortableContext>
      </KanbanContainer$div>

      {data.mapIdToFact[activeId] ? (
        <DragOverlay>
          <SingleFact
            fact={data.mapIdToFact[activeId]}
            dndProps={{ isDragOverlay: true }}
          />
          {selectedFactUids.length > 1 && (
            <SelectionCount>{selectedFactUids.length}</SelectionCount>
          )}
        </DragOverlay>
      ) : null}
    </DndContext>
  );
};
