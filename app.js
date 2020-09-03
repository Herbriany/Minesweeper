document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let squares=[];

    //create board
    function createBoard() {
        for(let i=0; i<width*width; i++){
            
            const bombArray = Array(bombAmount).fill('bomb');
            const emptyArray = Array(width*width - bombAmount).fill('empty');
            const gameArray = emptyArray.concat(bombArray);
            const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e){
                click(square)
            })
        }

        for(let i=0; i<squares.length; i++){
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            
            if (squares[i].classList.contains('empty')){
                // checking direct left square 0
                if (i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total++
                // checking directly above square 9
                if (i > (width-1) && squares[i - width].classList.contains('bomb')) total++
                // checking top left square 10
                if (i > width && !isLeftEdge && squares[i - (width+1)].classList.contains('bomb')) total++
                // checking top right square 8
                if (i > (width-1) && !isRightEdge && squares[i + (1-width)].classList.contains('bomb')) total++ 
                // checking right square 98
                if (i < (width*width-2) && !isRightEdge && squares[i+1].classList.contains('bomb')) total++
                // checking bottom left square 90
                if (i < (width*width-width) && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                // checking bottom right square 88
                if (i < (width*width-width-2) && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                // checking bottom square 89
                if (i < (width*width-width-1) && squares[i + width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total)
            }
           
        }
        
    }
    createBoard()

    //click on square functions
    function click(square){
        let currentId = square.id
        // if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            console.log('Game over!');
        }
        else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            } 
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }

    // recursive function to check surrouning squares once square is clicked
    function checkSquare(square, currentId) {
    }



})