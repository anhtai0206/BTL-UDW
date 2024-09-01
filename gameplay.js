document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const size = 10;
    const bombAmounts = 20;
    let isGameOver = false;
    let flags = 0;
    let gameBoard = [];

    //Tao bang
    function createBoard() {
        document.getElementById('flags-left').innerHTML = bombAmounts; // gan so la co = so bomb

        //Tao thuoc tinh bombs va o trong
        const bombArry = Array(bombAmounts).fill('bomb');
        const emptyArray = Array(size * size - bombAmounts).fill('none');
        const gameArray = emptyArray.concat(bombArry);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5); // random cac thuoc tinh trong mang

        //Tao bang va gan thuoc tinh cho cac o
        for (let i = 0; i < size*size;i++) {
            const square = document.createElement('div'); // dung vong lap de tao cac div la moi trong bang
            square.id = i;
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            gameBoard.push(square);
        
        // Them bat su kien cho cac o 
        //click chuot trai
        square.addEventListener('click', function() {
            click(square);
        })
        //click chuot phai
        square.addEventListener('contextmenu', function () {
            addFlag(square);
        });
        }
        //Dem so bomb xung quanh o dc click
        for (let i = 0; i < gameBoard.length; i++) {
            let count = 0;
            const isLeftEdge = (i % size === 0);
            const isRightEdge = (i % size === size - 1);
            if(gameBoard[i].classList.contains('none')) {
                if (i > 11 && !isLeftEdge && gameBoard[i - 1 - size].classList.contains('bomb')) count++;
                if (i > 10 && gameBoard[i - size].classList.contains('bomb')) count++;
                if (i > 9 && !isRightEdge && gameBoard[i + 1 - size].classList.contains('bomb')) count++;
                if (i < 98 && !isRightEdge && gameBoard[i + 1].classList.contains('bomb')) count++;
                if (i < 88 && !isRightEdge && gameBoard[i + 1 + size].classList.contains('bomb')) count++;
                if (i < 89 && gameBoard[i + size].classList.contains('bomb')) count++;
                if (i < 90 && !isLeftEdge && gameBoard[i - 1 + size].classList.contains('bomb')) count++;
                if (i > 0 && !isLeftEdge && gameBoard[i - 1].classList.contains('bomb')) count++;
                gameBoard[i].setAttribute('data', count);
            }
        }
    }
    createBoard();

    // Danh dau la co = chuot phai va cap nhat so flag con lai
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('empty') && (flags < bombAmounts || square.classList.contains('flag'))) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                flags++;
                document.getElementById('flags-left').innerHTML = bombAmounts - flags;
                checkForWin();
            } 
            else {
                square.classList.remove('flag');
                flags--;
                document.getElementById('flags-left').innerHTML = bombAmounts - flags;
            }
        }
    }

    //KT dieu kien thang
    function checkForWin() {
        let count = 0;
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i].classList.contains('flag') && gameBoard[i].classList.contains('bomb'))
                count++;
            if (count == bombAmounts) {
                alert("CONGRATULATION! YOU WIN 🎉🏆");
                document.getElementById('result').innerHTML = "YOU WIN!";
                isGameOver = true;
                return;
            }
        }
    }

    function gameOver() { //Thua
        alert("BOOM💣💥! GAMEOVER!");
        document.getElementById("result").innerHTML = "YOU LOSE!"
        isGameOver = true;

        //Hien tat ca qua bomb dang co
        gameBoard.forEach(function(square) {
            if (square.classList.contains('bomb')) {
                square.classList.remove('bomb');
                square.classList.add('lose');
            }
        });
    }

    // ham khi click vao 1 o
    function click(square) {
        if (isGameOver || square.classList.contains('empty') || square.classList.contains('flag'))
            return;
        if (square.classList.contains('bomb'))
            gameOver();
        else {
            let total = square.getAttribute('data');
            if (total != 0) {
                if (total == 1) square.classList.add('one');
                if (total == 2) square.classList.add('two');
                if (total == 3) square.classList.add('three');
                if (total == 4) square.classList.add('four');
                if (total == 5) square.classList.add('five');
                return;
            }
            else
                checkSquare(square);
        }
        square.classList.add('empty');
    }

    // check tat ca cac o trong xung quanh o dc click neu co thi se mo cac o do
    function checkSquare(square) {
        const id = parseInt(square.id);
        const isLeftEdge = (id % size === 0);
        const isRightEdge = (id % size === size - 1);

        setTimeout(function() {
            if (id > 11 && !isLeftEdge) {
                const newId = parseInt(id) - 1 - size;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id > 10) {
                const newId = parseInt(id) - size;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id > 9 && !isRightEdge) {
                const newId = parseInt(id) + 1 - size;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id < 98 && !isRightEdge) {
                const newId = parseInt(id) + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id < 88 && !isRightEdge) {
                const newId = parseInt(id) + 1 + size;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id < 89) {
                const newId = parseInt(id) + size;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id < 90 && !isLeftEdge) {
                const newId = parseInt(id) - 1 + size;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (id > 0 && !isLeftEdge) {
                const newId = parseInt(id) - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10)
    }
    // Reset lai game khi click vao nut
        function resetGame() {
            grid.innerHTML = '';
            
            isGameOver = false;
            flags = 0;
            gameBoard = [];
            document.getElementById('flags-left').innerHTML = bombAmounts;
            document.getElementById('result').innerHTML = '';
            
            createBoard();
        }
        document.getElementById('reset-button').addEventListener('click', function() {
            resetGame();
        });
})
