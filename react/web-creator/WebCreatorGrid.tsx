import React, { forwardRef, useImperativeHandle, useState } from "react";
import { WebCreatorComponent } from "./WebCreatorComponentList";

export interface WebCreatorGridCell {
    uuid: string;
    colSpan: number;
    component: WebCreatorComponent | null;
}

export interface WebCreatorGridRef {
}

interface WebCreatorGridProps {
    grid: WebCreatorGridCell[][];
    onCellClick: (cell: WebCreatorGridCell) => void
}

export const WebCreatorGrid = forwardRef<WebCreatorGridRef, WebCreatorGridProps>((
    { grid, onCellClick },
    ref
) => {

    const [selectedCell, setSelectedCell] = useState<WebCreatorGridCell | null>(null);

    useImperativeHandle(ref, () => ({}));

    return (
        <>
            {grid.map((row, index) => (
                <div className="row p-2" key={index}>
                    {row.map((column, index) => (
                        <div
                            className={`col-md-${column.colSpan} cursor-pointer ${selectedCell?.uuid === column.uuid ? "border border-3 border-primary " : ""}`}
                            key={index}
                            onClick={() => {
                                setSelectedCell(column);
                                onCellClick(column);
                            }}>
                            x
                            {column.component?.name}
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
});