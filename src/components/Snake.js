import { Component } from "react"
import data from "../data/data";
import { getCoordinates, NodeIndex } from "../service/services";


class Snake extends Component {
    constructor(ctx) {
        super();
        this.ctx = ctx;
        // this.drawSnake = this.drawSnake.bind(this);
        // this.drawSnake();
        // this.nodes = [this.getHeadNode()]
    }

    drawSnake() {
        const midI = data.numCellsHigh / 2; 
        const midJ = data.numCellsWide / 2;
        const head = getCoordinates(midI, midJ);
        const coordinates = [getCoordinates(midI, midJ)];
        for(let i = 1; i <= 5; i++) {
            coordinates.push(new NodeIndex(head.iIndex + data.cellHeight*i, head.jIndex));
        }
        const newHead = coordinates[coordinates.length-1];
        for(let j = 1; j <= 5; j++) {
            coordinates.push(new NodeIndex(newHead.iIndex, head.jIndex+j*data.cellWidth));
        }
        const newHead2 = coordinates[coordinates.length-1];
        for(let i = 1; i <= 5; i++) {
            coordinates.push(new NodeIndex(newHead2.iIndex + data.cellHeight*i, newHead2.jIndex));
        }
        coordinates.forEach(node => this.ctx.fillRect(node.jIndex, node.iIndex, data.cellWidth, data.cellHeight))
    }

    getHeadNode() {
        const midI = data.numCellsHigh / 2; 
        const midJ = data.numCellsWide / 2;
        return getCoordinates(midI, midJ)
    }

    render() {
        return <div></div>
    }
    // render() {
    //     this.nodes.forEach(node => this.ctx.fillRect(node.jIndex, node.iIndex, data.cellWidth, data.cellHeight))
    // }

}

export default Snake