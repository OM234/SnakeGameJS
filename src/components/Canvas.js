import { useEffect, useRef } from "react";
import data from "../data/data";

let tickNum = 0;
const seperation =20;
const speed = 1;
let lastMoveEntered = '';

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    switch(event.key) {
        case 'ArrowUp':
            lastMoveEntered = 'u';
            break;
        case 'ArrowDown':
            lastMoveEntered = 'd';
            break;
        case 'ArrowLeft':
            lastMoveEntered = 'l';
            break;
        case 'ArrowRight':
            lastMoveEntered = 'r';
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
    const lastMoveRef = useRef(['l']);
    const handleKeyDown = (e) => {
        e.preventDefault();
        console.log('press');
    }

    const updateSnake = () => {
        tickNum++;
        const snake = snakeRef.current;
        const move = moveRef.current;
        const lastMove = lastMoveRef.current;
        
        // if(tickNum%30 === 0) {
        //     snakeRef.current.push({x: data.height/2 + seperation, y: data.width/2})
        // }

        switch(lastMoveEntered) {
            case '':
                break;
            case 'l':
                move[0] = 'l';
                snake[0].x -= speed;
                lastMove[0] = 'l';
                break;
            case 'r':
                move[0] = 'r';
                snake[0].x += speed;
                lastMove[0] = 'r';
                break;
            case 'u':
                move[0] = 'u';
                snake[0].y -= speed;
                lastMove[0] = 'u';
                break;
            case 'd':
                move[0] = 'd';
                snake[0].y += speed;
                lastMove[0] = 'd';
                break;
        }

        for(let i = 1; i < snake.length; i++) {
            // if(directionChanged(move[i], lastMove[0])) {
            //     console.log(`changed at ${i} from ${lastMove[0]} to ${move[i]}}`)
            // }
            const distanceX = snake[i-1].x - snake[i].x;
            const distanceY = snake[i-1].y - snake[i].y;
            if(lastMove[0] === 'l' || lastMove[0] === 'r') {
                const moveX = distanceX >= 0 ? distanceX-seperation : distanceX+seperation;
                if(Math.abs(distanceX) >= seperation) {
                    snake[i].x += moveX;
                    snake[i].y += distanceY;
                    const prevMove = move[i];
                    if(moveX > 0) {
                        move[i] = lastMove[0];
                    } else {
                        move[i] = lastMove[0];
                    }
                    lastMove[0] = prevMove;
                } else {
                    lastMove[0] = move[i];
                }
            }
            else if(lastMove[0] === 'u' || lastMove[0] === 'd') {
                const moveY = distanceY >= 0 ? distanceY-seperation : distanceY+seperation;
                if(Math.abs(distanceY) >= seperation) {
                    snake[i].y += moveY;
                    snake[i].x += distanceX;
                    const prevMove = move[i];
                    if(moveY > 0) {
                        move[i] = lastMove[0];
                    } else {
                        move[i] = lastMove[0];
                    }
                    lastMove[0] = prevMove;
                } else {
                    lastMove[0] = move[i];
                }
            }
            console.log(snake);
        }
    }

    const directionChanged = (curr, last) => {
        if(curr === 'u' || curr === 'd') {
            if(last === 'l' || last === 'r') {
                return true;
            }
            return false;
        }
        if(last === 'u' || last === 'd') {
            return true;
        }
        return false;
    }

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