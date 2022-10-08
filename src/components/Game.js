import { Component } from "react";
import Board from "./Board";
import Snake from "./Snake";

class Game extends Component {
    render() {
        return (
            <div>
                <Board />
                <Snake />
            </div>
        )
    }
}

export default Game;