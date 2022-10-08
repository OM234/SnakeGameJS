import { Component } from "react";
import Snake from "./Snake";
import data from "../data/data"
import Canvas from "./Canvas";

class Board extends Component {
    render() {
        return (
            <Canvas style={{ border: '1px solid #d3d3d3' }} draw={c => this.drawBoard(c)} />
        )
    }

    drawBoard = (ctx) => {
        ctx.beginPath();
        for (let i = 0; i < data.numCellsHigh; i++) {
            data.cellFillings[data.cellHeight * i] = [];
            for (let j = 0; j < data.numCellsHigh; j++) {
                ctx.rect(data.cellHeight * i, data.cellWidth * j, data.cellWidth, data.cellHeight);
                ctx.stroke();
            }
        }
    }

    // componentDidMount() {
    //     // var ctx = this.drawBoard();
    //     // new Snake(ctx);
    //     // new Snake(ctx).render()
    // }

    // drawBoard() {
    //     var c = document.getElementById("canvas");
    //     var ctx = c.getContext("2d");
    //     ctx.beginPath();

    //     for (let i = 0; i < data.numCellsHigh; i++) {
    //         data.cellFillings[data.cellHeight * i] = [];
    //         for (let j = 0; j < data.numCellsHigh; j++) {
    //             ctx.rect(data.cellHeight * i, data.cellWidth * j, data.cellWidth, data.cellHeight);
    //             ctx.stroke();
    //             data.cellFillings[data.cellHeight * i].push(data.cellWidth * j);
    //         }
    //     }
    //     return ctx;
    // }
}

export default Board;