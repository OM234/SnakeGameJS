import { useEffect, useRef } from "react";
import data from "../data/data";

let tickNum = 0;
const seperation = 15;
const speed = 8;
let lastMoveEntered = '';

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    switch(event.key) {
        case 'ArrowUp':
            lastMoveEntered = lastMoveEntered === 'd' ? 'd' : 'u';
            break;
        case 'ArrowDown':
            lastMoveEntered = lastMoveEntered === 'u' ? 'u' : 'd';
            break;
        case 'ArrowLeft':
            lastMoveEntered = lastMoveEntered === 'r' ? 'r' : 'l';
            break;
        case 'ArrowRight':
            lastMoveEntered = lastMoveEntered === 'l' ? 'l' : 'r';
            break;
    }
});

const getFakeCoordinates = () => {
    const arr = [];
    for(let i = 0; i < 20; i++) {
        arr.push({x: data.height/2 + i*seperation, y: data.width/2});
    }
    return arr;
}


const Canvas = () => {
    const canvasRef = useRef(null);
    const requestIdRef = useRef(null);
    const snakeRef = useRef(getFakeCoordinates());
    const moveRef = useRef(['l']);
    const handleKeyDown = (e) => {
        e.preventDefault();
        console.log('press');
    }

    const updateSnake = () => {
        tickNum++;
        const snake = snakeRef.current;
        const move = moveRef.current;
        
        // if(tickNum%30 === 0) {
        //     snakeRef.current.push({x: data.height/2 + seperation, y: data.width/2})
        // }

        switch(lastMoveEntered) {
            case '':
                break;
            case 'l':
                move[0] = 'l';
                snake[0].x -= speed;
                break;
            case 'r':
                move[0] = 'r';
                snake[0].x += speed;
                break;
            case 'u':
                move[0] = 'u';
                snake[0].y -= speed;
                break;
            case 'd':
                move[0] = 'd';
                snake[0].y += speed;
                break;
        }

        for(let i = 1; i < snake.length; i++) {
            const distanceX = snake[i-1].x - snake[i].x;
            const distanceY = snake[i-1].y - snake[i].y;
            switch(move[i-1]) {
                case 'l':
                case 'r':
                    snake[i].y += distanceY;
                    if(Math.abs(distanceX) > seperation) {
                        const moveX = distanceX >= 0 ? distanceX-seperation : distanceX+seperation;
                        snake[i].x += moveX;
                    }
                    move[i] = getMove(distanceY, distanceX);
                    break;
                case 'u':
                case 'd':
                    snake[i].x += distanceX;
                    if(Math.abs(distanceY) > seperation) {
                        const moveY = distanceY >= 0 ? distanceY-seperation : distanceY+seperation;
                        snake[i].y += moveY;
                    }
                    move[i] = getMove(distanceY, distanceX);
                    break;

            }
        }
    }

    const getMove = (distanceY, distanceX) => {
        if(Math.abs(distanceX) >= seperation) {
            if(distanceX > 0) {
                return 'r';
            } else {
                return 'l';
            }
        }
        if(Math.abs(distanceY) >= seperation) {
            if (distanceY > 0) {
                return 'd';
            } else {
                return 'u';
            }
        }
        console.log('nothing');
    }

    // const directionChanged = (curr, last) => {
    //     if(curr === 'u' || curr === 'd') {
    //         if(last === 'l' || last === 'r') {
    //             return true;
    //         }
    //         return false;
    //     }
    //     if(last === 'u' || last === 'd') {
    //         return true;
    //     }
    //     return false;
    // }

    const renderFrame = () => {
        const ctx = canvasRef.current.getContext("2d");
        snakeRef.current.forEach(snakeNode => ctx.clearRect(snakeNode.x-10, snakeNode.y-10, 20, 20));
        updateSnake();
        let i = snakeRef.current.length;
        while(i > 0) {
            i--;
            ctx.beginPath();
            ctx.arc(snakeRef.current[i].x, snakeRef.current[i].y, 10, 0, Math.PI*2);
                ctx.fillStyle = i == 0 ? 'red' : 'black'
                ctx.fill();

        }
    }

    const tick = () => {
        if(!canvasRef.current) {
            return;
        }
        renderFrame();
        requestIdRef.current = requestAnimationFrame(tick);
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, true);
        requestIdRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(requestIdRef.current);
        }
    });

    return (
        <canvas ref={canvasRef} height={data.height} width={data.width} style={{ border: '1px solid', borderRadius: '5px', display: 'table', margin: '50px auto' }}/>
    );
}

export default Canvas;