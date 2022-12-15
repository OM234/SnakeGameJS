import { useEffect, useRef } from "react";
import data from "../data/data";

const seperation = 15;
const speed = 11;
let lastMoveEntered = '';
let didScore = false;

// const getFakeCoordinates = () => {
//     const arr = [];
//     for (let i = 0; i < 1; i++) {
//         arr.push({ x: data.height / 2 + i * seperation, y: data.width / 2 });
//     }
//     return arr;
// } 

const Canvas = () => {
    const canvasRef = useRef(null);
    const requestIdRef = useRef(null);
    const snakeRef = useRef([{ x: data.height / 2, y: data.width / 2 }]);
    const moveRef = useRef(['l']);
    const foodRef = useRef({x: data.width/3, y:data.height/3});

    useEffect(() => {
        requestIdRef.current = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(requestIdRef.current);
        }
    });

    const tick = () => {
        if (!canvasRef.current) {
            return;
        }
        renderFrame();
        requestIdRef.current = requestAnimationFrame(tick);
    }

    const renderFrame = () => {
        const ctx = canvasRef.current.getContext("2d");
        snakeRef.current.forEach(snakeNode => ctx.clearRect(snakeNode.x - 10, snakeNode.y - 10, 20, 20));
        ctx.clearRect(foodRef.current.x - 10, foodRef.current.y - 10, 20, 20);
        updateFood();
        updateSnake();
        renderSnake(ctx);
        renderFood(ctx);
    }

    const renderSnake = (ctx) => {
        //const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
        let i = snakeRef.current.length;
        while (i > 0) {
            i--;
            ctx.beginPath();
            ctx.arc(snakeRef.current[i].x, snakeRef.current[i].y, data.snakeRadius, 0, Math.PI * 2);
            //ctx.fillStyle = colors[i % colors.length];    
            ctx.fillStyle = i == 0 ? 'red' : 'black';
            ctx.fill();
        }
    }

    const renderFood = (ctx) => {
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.arc(foodRef.current.x, foodRef.current.y, data.snakeRadius, 0, Math.PI * 2);
        ctx.fill();
        //ctx.fillRect(foodRef.current.x, foodRef.current.y, data.snakeRadius*2, data.snakeRadius*2);
    }
    
    const updateFood = () => {
        const { xA, xB, yA, yB } = getHeadAndFoodCoordinates();
        const { xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD }
            = getNodesBoundaries(xA, xB, yA, yB);
        if(didCollideWith(xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD )) {
            onCollidedWithFood();
        }
    }

    const getHeadAndFoodCoordinates = () => {
        const xA = snakeRef.current[0].x;
        const yA = snakeRef.current[0].y;
        const xB = foodRef.current.x;
        const yB = foodRef.current.y;
        return { xA, xB, yA, yB };
    }

    const onCollidedWithFood = () => {
        didScore = true;
        let foodX, foodY;
        do {
            const border = 50;
            foodX = Math.floor(Math.random() * (data.width -2*border + 1 ) + border);
            foodY = Math.floor(Math.random() * (data.height -2*border + 1) + border );
        } while (!foodCanBePlacedHere(foodX, foodY));
        foodRef.current = { x: foodX, y: foodY };
    }

    const foodCanBePlacedHere = (foodX, foodY) => {
        return snakeRef.current.every(node => {
            const snakeX = node.x;
            const snakeY = node.y;
            const { xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD }
                = getNodesBoundaries(foodX, snakeX, foodY, snakeY);
            return !didCollideWith(xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD)
        });
    }

    const updateSnake = () => {
        if (didLose()) {
            alert('you lost');
        }
        onScoring();
        moveHead();
        moveBody();
    }

    const onScoring = () => {
        if(didScore) {
            //for(let i = 0; i < 5; i++)
            snakeRef.current.push({x: -5, y: -5});
            didScore = false;
        }
    }

    const moveHead = () => {
        const snake = snakeRef.current;
        const move = moveRef.current;

        switch (lastMoveEntered) {
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
    }

    const moveBody = () => {
        const snake = snakeRef.current;
        const move = moveRef.current;

        for (let i = 1; i < snake.length; i++) {
            const distanceX = snake[i - 1].x - snake[i].x;
            const distanceY = snake[i - 1].y - snake[i].y;
            switch (move[i - 1]) {
                case 'l':
                case 'r':
                    snake[i].y += distanceY;
                    if (Math.abs(distanceX) > seperation) {
                        const moveX = distanceX >= 0 ? distanceX - seperation : distanceX + seperation;
                        snake[i].x += moveX;
                    }
                    move[i] = getMove(distanceY, distanceX);
                    break;
                case 'u':
                case 'd':
                    snake[i].x += distanceX;
                    if (Math.abs(distanceY) > seperation) {
                        const moveY = distanceY >= 0 ? distanceY - seperation : distanceY + seperation;
                        snake[i].y += moveY;
                    }
                    move[i] = getMove(distanceY, distanceX);
                    break;
            }
        }
    }

    const getMove = (distanceY, distanceX) => {
        if (Math.abs(distanceX) >= seperation) {
            if (distanceX > 0) {
                return 'r';
            } else {
                return 'l';
            }
        }
        if (Math.abs(distanceY) >= seperation) {
            if (distanceY > 0) {
                return 'd';
            } else {
                return 'u';
            }
        }
    }

    const didLose = () => {
        const headX = snakeRef.current[0]['x'];
        const headY = snakeRef.current[0]['y'];

        //TODO: make i smaller, closer to 2
        for (let i = 4; i < snakeRef.current.length; i++) {
            const currX = snakeRef.current[i]['x'];
            const currY = snakeRef.current[i]['y'];
            if (didCollide(headX, headY, currX, currY)) {
                return true;
            }
        }

        const { xAL, xAR, yAU, yAD } = getNodeBoundaries(snakeRef.current[0].x, snakeRef.current[0].y);
        if(didCollideWithWall(xAL, xAR, yAU, yAD)) {
            return true;
        }

        return false;
    }

    //It is assumed that xA, xB refer to head node
    const didCollide = (xA, yA, xB, yB) => {
        const { xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD }
            = getNodesBoundaries(xA, xB, yA, yB);

        return didCollideWith(xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD )
    }

    const didCollideWithWall = (xAL, xAR, yAU, yAD) => {
        const tolerance = 0;
        return xAL + tolerance < 0
            || xAR - tolerance > data.width
            || yAU + tolerance < 0
            || yAD - tolerance > data.height;
    }

    const didCollideWith = (xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD) => {
        const overlappedX = (xBL >= xAL && xBL <= xAR) || (xBR >= xAL && xBR <= xAR);
        if (overlappedX) {
            const overLappedY = (yBU >= yAU && yBU <= yAD) || (yBD >= yAU && yBD <= yAD);
            if (overLappedY) {
                return true;
            }
        }
        return false;
    }

    const getNodeBoundaries = (xA, yA) => {
        const xAL = xA - data.snakeRadius;
        const xAR = xA + data.snakeRadius;
        const yAU = yA - data.snakeRadius;
        const yAD = yA + data.snakeRadius;
        return { xAL, xAR, yAU, yAD }
    }

    const getNodesBoundaries = (xA, xB, yA, yB) => {
        const xAL = xA - data.snakeRadius;
        const xAR = xA + data.snakeRadius;
        const xBL = xB - data.snakeRadius;
        const xBR = xB + data.snakeRadius;
        const yAU = yA - data.snakeRadius;
        const yAD = yA + data.snakeRadius;
        const yBU = yB - data.snakeRadius;
        const yBD = yB + data.snakeRadius;
        return { xAL, xAR, yAU, yAD, xBL, xBR, yBU, yBD }
    }

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Snake Game</h1>
            <h2 style={{ textAlign: 'center' }}>Version 1.0</h2>
            <h2 style={{ textAlign: 'center' }}>Score: {snakeRef.current.length}</h2>
            <canvas ref={canvasRef} height={data.height} width={data.width} style={{ border: '1px solid', background: 'AliceBlue', borderRadius: '5px', display: 'table', margin: '50px auto' }} />
        </div>
    );
}

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    switch (event.key) {
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

export default Canvas;

