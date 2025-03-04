export class Minigames {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentGame = null;
        this.score = 0;
        this.timeLeft = 0;
        this.gameTimer = null;
        this.isPlaying = false;
    }
    
    startGame(gameType) {
        this.currentGame = gameType;
        this.score = 0;
        this.isPlaying = false;
        
        // Reset the game area
        const gameArea = document.getElementById('minigame-area');
        gameArea.innerHTML = '';
        
        // Set the game title
        const gameTitle = document.getElementById('minigame-title');
        const scoreDisplay = document.querySelector('#minigame-score span');
        const timerDisplay = document.querySelector('#minigame-timer span');
        
        scoreDisplay.textContent = '0';
        
        // Show the start button
        const startButton = document.getElementById('minigame-start');
        startButton.style.display = 'block';
        
        // Set up the game based on type
        switch (gameType) {
            case 'quick-catch':
                gameTitle.textContent = 'Quick Catch';
                this.timeLeft = 30;
                timerDisplay.textContent = this.timeLeft;
                
                // Set up the game area
                gameArea.innerHTML = `
                    <div id="quick-catch-game">
                        <div id="catch-pet" class="hidden"></div>
                    </div>
                `;
                
                // Add event listener to start button
                startButton.onclick = () => this.startQuickCatch();
                break;
                
            case 'memory-match':
                gameTitle.textContent = 'Memory Match';
                this.timeLeft = 60;
                timerDisplay.textContent = this.timeLeft;
                
                // Set up the game area
                gameArea.innerHTML = `
                    <div id="memory-match-game">
                        <div class="memory-grid"></div>
                    </div>
                `;
                
                // Add event listener to start button
                startButton.onclick = () => this.startMemoryMatch();
                break;
                
            case 'balloon-pop':
                gameTitle.textContent = 'Balloon Pop';
                this.timeLeft = 30;
                timerDisplay.textContent = this.timeLeft;
                
                // Set up the game area
                gameArea.innerHTML = `
                    <div id="balloon-pop-game"></div>
                `;
                
                // Add event listener to start button
                startButton.onclick = () => this.startBalloonPop();
                break;
                
            default:
                gameTitle.textContent = 'Mini Game';
                break;
        }
    }
    
    startQuickCatch() {
        this.isPlaying = true;
        this.score = 0;
        this.timeLeft = 30;
        
        const gameArea = document.getElementById('quick-catch-game');
        const catchPet = document.getElementById('catch-pet');
        const scoreDisplay = document.querySelector('#minigame-score span');
        const timerDisplay = document.querySelector('#minigame-timer span');
        const startButton = document.getElementById('minigame-start');
        
        startButton.style.display = 'none';
        catchPet.className = 'hidden';
        
        // Add the pet element based on the player's pet type
        const petType = this.gameManager.pet.type;
        
        catchPet.innerHTML = `
            <svg viewBox="0 0 100 100" width="60" height="60">
                <!-- Simple pet shape based on type -->
                ${this.getPetSvgForMinigame(petType)}
            </svg>
        `;
        
        // Add click event listener to the pet
        catchPet.addEventListener('click', () => {
            if (!this.isPlaying) return;
            
            this.score += 10;
            scoreDisplay.textContent = this.score;
            catchPet.className = 'hidden';
            
            // Make the pet appear somewhere else after a short delay
            setTimeout(() => {
                if (this.isPlaying) this.movePet(catchPet, gameArea);
            }, Math.random() * 300 + 200);
        });
        
        // Start the timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Start the first pet appearance
        setTimeout(() => this.movePet(catchPet, gameArea), 1000);
    }
    
    movePet(petElement, gameArea) {
        if (!this.isPlaying) return;
        
        const maxX = gameArea.clientWidth - 60;
        const maxY = gameArea.clientHeight - 60;
        
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        
        petElement.style.left = `${randomX}px`;
        petElement.style.top = `${randomY}px`;
        petElement.className = '';
        
        // Hide pet after a random time if not clicked
        setTimeout(() => {
            if (petElement.className !== 'hidden' && this.isPlaying) {
                petElement.className = 'hidden';
                
                // Make it appear somewhere else
                setTimeout(() => {
                    if (this.isPlaying) this.movePet(petElement, gameArea);
                }, Math.random() * 300 + 200);
            }
        }, Math.random() * 700 + 800);
    }
    
    startMemoryMatch() {
        this.isPlaying = true;
        this.score = 0;
        this.timeLeft = 60;
        this.moves = 0;
        this.matchedPairs = 0;
        
        const grid = document.querySelector('.memory-grid');
        const scoreDisplay = document.querySelector('#minigame-score span');
        const timerDisplay = document.querySelector('#minigame-timer span');
        const startButton = document.getElementById('minigame-start');
        
        startButton.style.display = 'none';
        
        // Card types (8 pairs = 16 cards)
        const cardTypes = [
            'basic_food', 'premium_food', 'treats', 'toy_ball',
            'medicine', 'energy_drink', 'grooming_kit', 'training_book'
        ];
        
        // Create card deck with pairs
        let cards = [...cardTypes, ...cardTypes];
        
        // Shuffle cards
        cards = this.shuffleArray(cards);
        
        // Create the grid
        grid.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            cardElement.dataset.type = card;
            cardElement.innerHTML = `
                <div class="card-back">?</div>
                <div class="card-front">
                    <div class="card-icon">${this.getCardIcon(card)}</div>
                </div>
            `;
            grid.appendChild(cardElement);
            
            // Add click event
            cardElement.addEventListener('click', () => this.flipCard(cardElement));
        });
        
        // Start the timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    flipCard(card) {
        if (!this.isPlaying || card.classList.contains('flipped') || 
            card.classList.contains('matched') || 
            document.querySelectorAll('.memory-card.flipped:not(.matched)').length >= 2) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        
        // Check if we have two flipped cards
        const flippedCards = document.querySelectorAll('.memory-card.flipped:not(.matched)');
        
        if (flippedCards.length === 2) {
            this.moves++;
            
            const firstCard = flippedCards[0];
            const secondCard = flippedCards[1];
            
            // Check if cards match
            if (firstCard.dataset.type === secondCard.dataset.type) {
                // Cards match
                setTimeout(() => {
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    this.matchedPairs++;
                    
                    // Add score
                    this.score += 20;
                    document.querySelector('#minigame-score span').textContent = this.score;
                    
                    // Check if all pairs are matched
                    if (this.matchedPairs === 8) {
                        // Bonus for completing the game
                        const timeBonus = this.timeLeft * 2;
                        const movesBonus = Math.max(0, 100 - (this.moves - 8) * 5);
                        const totalBonus = timeBonus + movesBonus;
                        
                        this.score += totalBonus;
                        document.querySelector('#minigame-score span').textContent = this.score;
                        
                        this.gameManager.ui.showNotification(`Game completed! Bonus: ${totalBonus} points`);
                        this.endGame();
                    }
                }, 500);
            } else {
                // Cards don't match, flip them back
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                }, 1000);
            }
        }
    }
    
    startBalloonPop() {
        this.isPlaying = true;
        this.score = 0;
        this.timeLeft = 30;
        
        const gameArea = document.getElementById('balloon-pop-game');
        const scoreDisplay = document.querySelector('#minigame-score span');
        const timerDisplay = document.querySelector('#minigame-timer span');
        const startButton = document.getElementById('minigame-start');
        
        startButton.style.display = 'none';
        gameArea.innerHTML = '';
        
        // Apply balloon pop game specific styles
        const style = document.createElement('style');
        style.id = 'balloon-game-style';
        style.textContent = `
            #balloon-pop-game {
                width: 100%;
                height: 100%;
                position: relative;
                overflow: hidden;
            }
            
            .balloon {
                position: absolute;
                bottom: -100px;
                width: 40px;
                height: 50px;
                cursor: pointer;
                animation: float-up 8s linear forwards;
            }
            
            @keyframes float-up {
                0% { transform: translateY(0); }
                100% { transform: translateY(-500px); }
            }
        `;
        document.head.appendChild(style);
        
        // Start the timer
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
                document.head.removeChild(document.getElementById('balloon-game-style'));
            }
        }, 1000);
        
        // Create balloons periodically
        this.balloonInterval = setInterval(() => {
            if (this.isPlaying) this.createBalloon(gameArea);
        }, 1000);
    }
    
    createBalloon(gameArea) {
        const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0'];
        const points = [5, 10, 15, 20, 25];
        
        const randomIndex = Math.floor(Math.random() * colors.length);
        const color = colors[randomIndex];
        const pointValue = points[randomIndex];
        
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.dataset.points = pointValue;
        
        const maxX = gameArea.clientWidth - 40;
        const randomX = Math.floor(Math.random() * maxX);
        
        balloon.style.left = `${randomX}px`;
        
        // Create balloon SVG
        balloon.innerHTML = `
            <svg viewBox="0 0 40 50" width="40" height="50">
                <path d="M20,5 Q30,5 30,20 Q30,35 20,45 Q10,35 10,20 Q10,5 20,5 Z" fill="${color}" />
                <path d="M20,45 L20,50" stroke="black" stroke-width="1" />
            </svg>
        `;
        
        gameArea.appendChild(balloon);
        
        // Add click event to pop balloon
        balloon.addEventListener('click', () => {
            if (!this.isPlaying) return;
            
            // Pop animation
            balloon.innerHTML = `
                <svg viewBox="0 0 40 50" width="40" height="50">
                    <circle cx="20" cy="25" r="15" fill="rgba(255,255,255,0.8)" />
                    <text x="20" y="30" text-anchor="middle" font-size="12" fill="black">+${pointValue}</text>
                </svg>
            `;
            
            // Add points
            this.score += parseInt(balloon.dataset.points);
            document.querySelector('#minigame-score span').textContent = this.score;
            
            // Remove the balloon after pop animation
            setTimeout(() => {
                if (gameArea.contains(balloon)) {
                    gameArea.removeChild(balloon);
                }
            }, 500);
        });
        
        // Remove balloon when animation ends
        setTimeout(() => {
            if (gameArea.contains(balloon)) {
                gameArea.removeChild(balloon);
            }
        }, 8000);
    }
    
    endGame() {
        this.isPlaying = false;
        clearInterval(this.gameTimer);
        
        if (this.currentGame === 'balloon-pop') {
            clearInterval(this.balloonInterval);
        }
        
        // Calculate rewards based on score
        let coinReward = Math.floor(this.score / 10);
        let xpReward = Math.floor(this.score / 5);
        
        // Ensure minimum rewards
        coinReward = Math.max(5, coinReward);
        xpReward = Math.max(3, xpReward);
        
        // Grant rewards
        this.gameManager.addCoins(coinReward);
        if (this.gameManager.pet) {
            this.gameManager.pet.addXP(xpReward);
        }
        
        // Show the start button again
        const startButton = document.getElementById('minigame-start');
        startButton.style.display = 'block';
        startButton.textContent = 'Play Again';
        
        // Show game over message
        this.gameManager.ui.showNotification(`Game Over! You earned ${coinReward} coins and ${xpReward} XP.`);
    }
    
    // Helper function to get SVG for minigame pet
    getPetSvgForMinigame(petType) {
        switch (petType) {
            case 'cat':
                return `
                    <circle cx="50" cy="50" r="30" fill="#999" />
                    <circle cx="35" cy="40" r="5" fill="black" />
                    <circle cx="65" cy="40" r="5" fill="black" />
                    <polygon points="30,25 45,15 50,30" fill="#999" />
                    <polygon points="70,25 55,15 50,30" fill="#999" />
                    <path d="M40,60 Q50,70 60,60" stroke="black" fill="transparent" />
                `;
            case 'dog':
                return `
                    <circle cx="50" cy="50" r="30" fill="#D2B48C" />
                    <circle cx="35" cy="40" r="5" fill="black" />
                    <circle cx="65" cy="40" r="5" fill="black" />
                    <ellipse cx="30" cy="30" rx="15" ry="20" fill="#D2B48C" transform="rotate(-30, 30, 30)" />
                    <ellipse cx="70" cy="30" rx="15" ry="20" fill="#D2B48C" transform="rotate(30, 70, 30)" />
                    <ellipse cx="50" cy="60" rx="10" ry="5" fill="#E8BEAC" />
                    <circle cx="50" cy="55" r="5" fill="black" />
                `;
            case 'bird':
                return `
                    <circle cx="50" cy="40" r="25" fill="#5DA9E9" />
                    <circle cx="40" cy="35" r="5" fill="black" />
                    <circle cx="60" cy="35" r="5" fill="black" />
                    <polygon points="45,50 55,50 50,65" fill="#FFA500" />
                    <ellipse cx="25" cy="50" rx="15" ry="25" fill="#3A8AD7" transform="rotate(-20, 25, 50)" />
                    <ellipse cx="75" cy="50" rx="15" ry="25" fill="#3A8AD7" transform="rotate(20, 75, 50)" />
                `;
            case 'rabbit':
                return `
                    <circle cx="50" cy="60" r="25" fill="#F5F5F5" />
                    <circle cx="40" cy="50" r="4" fill="black" />
                    <circle cx="60" cy="50" r="4" fill="black" />
                    <ellipse cx="35" cy="20" rx="10" ry="25" fill="#F5F5F5" transform="rotate(-10, 35, 20)" />
                    <ellipse cx="65" cy="20" rx="10" ry="25" fill="#F5F5F5" transform="rotate(10, 65, 20)" />
                    <ellipse cx="35" cy="20" rx="6" ry="20" fill="#FFCBDD" transform="rotate(-10, 35, 20)" />
                    <ellipse cx="65" cy="20" rx="6" ry="20" fill="#FFCBDD" transform="rotate(10, 65, 20)" />
                    <ellipse cx="50" cy="65" rx="5" ry="4" fill="#FFCBDD" />
                `;
            default:
                return `
                    <circle cx="50" cy="50" r="30" fill="#999" />
                    <circle cx="40" cy="40" r="5" fill="black" />
                    <circle cx="60" cy="40" r="5" fill="black" />
                    <path d="M40,60 Q50,70 60,60" stroke="black" fill="transparent" />
                `;
        }
    }
    
    // Helper function to get card icon for memory match
    getCardIcon(cardType) {
        switch (cardType) {
            case 'basic_food':
                return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFCC80" /></svg>`;
            case 'premium_food':
                return `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="#FFAB91" /></svg>`;
            case 'treats':
                return `<svg viewBox="0 0 24 24"><polygon points="12,2 5,22 19,22" fill="#FFECB3" /></svg>`;
            case 'toy_ball':
                return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#80DEEA" /></svg>`;
            case 'medicine':
                return `<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="4" fill="#EF9A9A" /><rect x="10" y="5" width="4" height="14" fill="#EF9A9A" /></svg>`;
            case 'energy_drink':
                return `<svg viewBox="0 0 24 24"><path d="M7,4 L17,4 L15,20 L9,20 Z" fill="#B39DDB" /></svg>`;
            case 'grooming_kit':
                return `<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="2" fill="#90CAF9" /></svg>`;
            case 'training_book':
                return `<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" fill="#A5D6A7" /><line x1="8" y1="10" x2="16" y2="10" stroke="white" stroke-width="2" /><line x1="8" y1="14" x2="14" y2="14" stroke="white" stroke-width="2" /></svg>`;
            default:
                return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#E0E0E0" /></svg>`;
        }
    }
    
    // Helper method to shuffle array
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}

