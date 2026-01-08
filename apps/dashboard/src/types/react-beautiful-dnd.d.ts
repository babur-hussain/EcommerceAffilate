/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react-beautiful-dnd' {
  import * as React from 'react';
  
  export interface DraggableLocation {
    droppableId: string;
    index: number;
  }

  export interface DropResult {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    reason: 'DROP' | 'CANCEL';
    mode: 'FLUID' | 'SNAP';
    destination?: DraggableLocation;
    combine?: {
      draggableId: string;
      droppableId: string;
    };
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: any) => void;
    onDragUpdate?: (initial: any) => void;
    children: React.ReactNode;
  }

  export interface DroppableProps {
    droppableId: string;
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    ignoreContainerClipping?: boolean;
    renderClone?: any;
    getContainerForClone?: () => HTMLElement;
    children: (provided: any, snapshot: any) => React.ReactElement;
  }

  export interface DraggableProps {
    draggableId: string;
    index: number;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
    children: (provided: any, snapshot: any, rubric: any) => React.ReactElement;
  }

  export const DragDropContext: React.FC<DragDropContextProps>;
  export const Droppable: React.FC<DroppableProps>;
  export const Draggable: React.FC<DraggableProps>;
}
