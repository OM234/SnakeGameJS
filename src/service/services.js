import data from "../data/data";

export class NodeIndex {
    constructor(i, j) {
        this.iIndex = i;
        this.jIndex = j;
    }
}

export function getCoordinates(i, j) {
    const iIndex = data.cellHeight * i;
    const jIndex = data.cellWidth * j;
    return new NodeIndex(iIndex, jIndex);
}