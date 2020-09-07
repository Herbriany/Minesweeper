document.addEventListener('DOMContentLoaded', () => {
    
    const gridButton = document.getElementById('gridButton')

    gridButton.addEventListener('click', (e) => {
        // checking for non zero value submissions
        let bombAmount = parseInt(document.getElementById('mineAmount').value)
        let width = parseInt(document.getElementById('gridSize').value)

        if ((width > 0 && bombAmount > 0 ) && ((width*width) > bombAmount))  {

            e.preventDefault()
            var squares = []
            var flags = 0;
            var isGameOver = false;
            
            //setting grid size
            var grid = document.querySelector('.grid');
            let gridWidth = width*40
            grid.style.width = gridWidth + 'px'
            grid.style.height = gridWidth + 'px'

            document.getElementById('gridForm').style.display = 'none'

            //create board
            createBoard(bombAmount, width)
        }
        else {
            alert('Must have a positive numbers for both Bomb Amount and Grid Size. Bomb amount can not be bigger than the amount of squares on the grid.')
        }
        
        function createBoard(bombAmount, width) {
            const bombArray = Array(bombAmount).fill('bomb');
            const emptyArray = Array(width*width - bombAmount).fill('empty');
            const gameArray = emptyArray.concat(bombArray);
            const shuffledArray = gameArray.sort(() => Math.random() - 0.5)
            for(let i=0; i<width*width; i++){
                
                const square = document.createElement('div');
                square.setAttribute('id', i);
                square.classList.add(shuffledArray[i]);
                grid.appendChild(square);
                squares.push(square);

                // normal click
                square.addEventListener('click', function(e){
                    click(square)
                })

                //right click
                square.oncontextmenu = function(e) {
                    e.preventDefault()
                    addFlag(square)
                }

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

        function addFlag(square) {
            if (isGameOver) return
            if (!square.classList.contains('checked')) {
                if (!square.classList.contains('flagged')) {
                    square.classList.add('flagged')
                    square.innerHTML = '&#x1F6A9'
                    flags ++
                    checkForWin()
                }
                else {
                    square.classList.remove('flagged')
                    square.innerHTML = ''
                    flags --
                    checkForWin()
                }
            }
        }

        //click on square functions
        function click(square){
            let currentId = square.id
            if (isGameOver) return
            if (square.classList.contains('checked') || square.classList.contains('flagged')) return
            if (square.classList.contains('bomb')) {
                gameOver(square)
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
            const isLeftEdge = (currentId % width === 0);
            const isRightEdge = (currentId % width === width - 1);

            setTimeout(() => {
                // checking left square
                if (currentId > 0 && !isLeftEdge) {
                    const newId = squares[parseInt(currentId) -1].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking directly above square 9
                if (currentId > width-1) {
                    const newId = squares[parseInt(currentId) - width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking top left square 10
                if (currentId > width && !isLeftEdge) {
                    const newId = squares[parseInt(currentId) - (width+1)].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking top right square 8
                if (currentId > (width-1) && !isRightEdge) {
                    const newId = squares[parseInt(currentId) + (1-width)].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking right square 98
                if (currentId < (width*width-1) && !isRightEdge) {
                    const newId = squares[parseInt(currentId) + 1].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking bottom left square 90
                if (currentId < (width*width-width) && !isLeftEdge) {
                    const newId = squares[parseInt(currentId) - 1 + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking bottom right square 88
                if (currentId < (width*width-width-2) && !isRightEdge) {
                    const newId = squares[parseInt(currentId) + 1 + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
                // checking bottom square 89
                if (currentId < (width*width-width)) {
                    const newId = squares[parseInt(currentId) + width].id
                    const newSquare = document.getElementById(newId)
                    click(newSquare)
                }
            } , 10)
        }

        function gameOver(square) {
            alert('BOOM!')
            console.log('Boom!')
            isGameOver = true;

            squares.forEach(square => {
                if (square.classList.contains('bomb')) {
                    square.innerHTML = '&#x1F4A3'
                }
            })
        }

        function checkForWin() {
            let matches = 0;
            for (let i = 0; i < squares.length; i++){
                if (squares[i].classList.contains('flagged') && squares[i].classList.contains('bomb')) {
                    matches ++
                }
                if (squares[i].classList.contains('flagged') && !squares[i].classList.contains('bomb')) {
                    matches --
                }
                if (matches === bombAmount) {
                    isGameOver = true
                    alert('YOU WON!')
                    return
                }
            }

        }
    })
})