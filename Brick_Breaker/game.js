document.addEventListener('DOMContentLoaded', () => {
    let elements = {
        Game: document.querySelector('.frame'),
        Pad: document.querySelector('.pad'),
        wallContainer: document.querySelector('.walls'),
        Ball: document.querySelector('.ball'),
        topWall: document.querySelector('.top_wall'),
        bottomWall: document.querySelector('.bottom_wall'),
        leftWall: document.querySelector('.left_wall'),
        rightWall: document.querySelector('.right_wall'),
        walls: [],
        scoreElem: document.querySelector('.score'),
        overElem: document.querySelector('.over')
    }
    let styleRoot = document.querySelector(':root')
    let gameWidth = elements.Game.getBoundingClientRect().width
    let gameHeight = elements.Game.getBoundingClientRect().height
    let wallNumber = 40
    let enableUpdate = true
    let ballPhisics = {
        x: getStyleProperty('--ballX'),
        y: getStyleProperty('--ballY'),
        w: elements.Ball.getBoundingClientRect().width,
        h: elements.Ball.getBoundingClientRect().height,
        vx: 3,
        vy: 3,
        speed: 1.5
    }
    let score = 0


    defData()
    requestAnimationFrame(update);

    function update() {
        if(!enableUpdate) {return}
        checkGameOver()
        ballCatchDesk()
        requestAnimationFrame(update)
    }

    function defData() {
        mouseMove()
        createWall()
    }
    function ballCatchDesk() {
        elements.walls.forEach((item) => {
            if(collision(elements.Ball.getBoundingClientRect(), item.getBoundingClientRect())) {
                crashWall(parseInt(item.getAttribute('data')))
            }
            
        })

        if(collision(elements.Pad.getBoundingClientRect(), elements.Ball.getBoundingClientRect())) {
            let random = randomNumber(2)
            if(random === 1) {
                ballPhisics.vx *= 1
                ballPhisics.vy *= -1
            } else {
                ballPhisics.vx *= -1
                ballPhisics.vy *= -1
            }
        } else if(collision(elements.rightWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())) {
            ballPhisics.vx *= -1
            ballPhisics.vy *= 1
        }
        else if(collision(elements.leftWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())) {
            ballPhisics.vx *= -1
            ballPhisics.vy *= 1
        } else if(collision(elements.topWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())) {
            ballPhisics.vx *= 1
            ballPhisics.vy *= -1
        }

        setStyleProperty('--ballX', `${ballPhisics.x += ballPhisics.vx}px`)
        setStyleProperty('--ballY', `${ballPhisics.y += ballPhisics.vy}px`)
    }
    function crashWall(id) {
        elements.walls.forEach((item) => {
            if(parseInt(item.getAttribute('data')) == id) {
                if(item.classList.contains('disable')) {return}
                item.classList.add('disable')
                ballPhisics.vx *= 1
                ballPhisics.vy *= -1
                score++
                elements.scoreElem.textContent = `Score ${score}`
                if(score % 5 == 0) {
                    ballPhisics.speed = ballPhisics.speed + 1
                    ballPhisics.vx = ballPhisics.speed 
                    ballPhisics.vy = ballPhisics.speed
                }
                if(score === wallNumber) {
                    gameWin()
                }
            }
        })
    }
    function mouseMove() {
        elements.Game.addEventListener('mousemove', (e) => {
            if(!enableUpdate) {return}
            setStyleProperty('--deskX', `${e.offsetX}px`)
        })
    }
    function setStyleProperty(variable, value) {
        styleRoot.style.setProperty(variable, value)
    }
    function getStyleProperty(variable) {
        return parseFloat(getComputedStyle(styleRoot).getPropertyValue(variable))
    }
    function createWall() {
        for(let i = 0; i < wallNumber; i++) {
            let elem = document.createElement('div')
            elem.classList.add('wall')
            elem.setAttribute('data', i)
            elements.walls.push(elem)
            elements.wallContainer.appendChild(elem)
        }
    }
    function checkGameOver() {
        if(collision(elements.Ball.getBoundingClientRect(), elements.bottomWall.getBoundingClientRect())) {
            gameOver()
        }
    }
    function gameOver() {
        enableUpdate = false;
        elements.overElem.textContent = 'Game Over'
        elements.overElem.style.display = 'block'
    }

    function gameWin() {
        enableUpdate = false;
        elements.overElem.textContent = 'You Win'
        elements.overElem.style.display = 'block'
    }

    function collision(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
            return true
        } else {
            return false
        }
    }
    function randomNumber(max) {
        return Math.floor(Math.random() * max)
    }
})