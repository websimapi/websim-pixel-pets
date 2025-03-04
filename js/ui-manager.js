export class UIManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentScreen = null;
    }
    
    setupEventListeners() {
        // Welcome screen listeners
        document.querySelectorAll('.pet-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.pet-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        document.getElementById('start-game').addEventListener('click', () => {
            const selectedPet = document.querySelector('.pet-option.selected');
            const petName = document.getElementById('pet-name').value.trim();
            
            if (!selectedPet) {
                this.showNotification('Please select a pet type!', 'error');
                return;
            }
            
            if (!petName) {
                this.showNotification('Please enter a name for your pet!', 'error');
                return;
            }
            
            const petType = selectedPet.dataset.type;
            this.gameManager.startNewGame(petType, petName);
            this.switchToScreen('main-screen');
        });
        
        // Action buttons
        document.getElementById('feed-btn').addEventListener('click', () => {
            if (this.gameManager.pet.feed()) {
                this.showNotification(`You fed ${this.gameManager.pet.name}!`);
            }
        });
        
        document.getElementById('play-btn').addEventListener('click', () => {
            if (this.gameManager.pet.play()) {
                this.showNotification(`You played with ${this.gameManager.pet.name}!`);
            } else if (this.gameManager.pet.energy < 10) {
                this.showNotification(`${this.gameManager.pet.name} is too tired to play!`, 'error');
            }
        });
        
        document.getElementById('sleep-btn').addEventListener('click', () => {
            const pet = this.gameManager.pet;
            if (pet.sleep()) {
                if (pet.state === 'sleeping') {
                    this.showNotification(`${pet.name} is now sleeping.`);
                } else {
                    this.showNotification(`${pet.name} woke up!`);
                }
            }
        });
        
        document.getElementById('clean-btn').addEventListener('click', () => {
            if (this.gameManager.pet.clean()) {
                this.showNotification(`You cleaned ${this.gameManager.pet.name}!`);
            } else if (!this.gameManager.pet.isDirty) {
                this.showNotification(`${this.gameManager.pet.name} is already clean!`);
            }
        });
        
        document.getElementById('heal-btn').addEventListener('click', () => {
            if (this.gameManager.pet.heal()) {
                this.showNotification(`You healed ${this.gameManager.pet.name}!`);
            } else if (!this.gameManager.pet.isSick) {
                this.showNotification(`${this.gameManager.pet.name} is not sick!`);
            }
        });
        
        document.getElementById('train-btn').addEventListener('click', () => {
            if (this.gameManager.pet.train()) {
                this.showNotification(`You trained ${this.gameManager.pet.name}!`);
            } else if (this.gameManager.pet.energy < 20) {
                this.showNotification(`${this.gameManager.pet.name} is too tired to train!`, 'error');
            }
        });
        
        // Navigation buttons
        document.getElementById('shop-btn').addEventListener('click', () => {
            this.switchToScreen('shop-screen');
            this.gameManager.shop.renderShopItems();
            this.updateShopCoins();
        });
        
        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.switchToScreen('inventory-screen');
            this.gameManager.inventory.renderInventory();
        });
        
        document.getElementById('minigames-btn').addEventListener('click', () => {
            this.switchToScreen('minigames-screen');
        });
        
        // Back buttons
        document.getElementById('back-from-shop').addEventListener('click', () => {
            this.switchToScreen('main-screen');
        });
        
        document.getElementById('back-from-inventory').addEventListener('click', () => {
            this.switchToScreen('main-screen');
        });
        
        document.getElementById('back-from-minigames').addEventListener('click', () => {
            this.switchToScreen('main-screen');
        });
        
        document.getElementById('back-from-minigame-play').addEventListener('click', () => {
            if (this.gameManager.minigames.isPlaying) {
                this.gameManager.minigames.endGame();
            }
            this.switchToScreen('minigames-screen');
        });
        
        // Minigame buttons
        document.querySelectorAll('.play-minigame-btn').forEach(button => {
            button.addEventListener('click', () => {
                const gameType = button.dataset.game;
                this.switchToScreen('minigame-play-screen');
                this.gameManager.minigames.startGame(gameType);
            });
        });
        
        // Game over button
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.gameManager.resetGame();
        });
        
        // Pet preview in selection screen
        this.setupPetPreviews();
    }
    
    setupPetPreviews() {
        const catPreview = document.querySelector('.pet-option[data-type="cat"] .pet-preview');
        const dogPreview = document.querySelector('.pet-option[data-type="dog"] .pet-preview');
        const birdPreview = document.querySelector('.pet-option[data-type="bird"] .pet-preview');
        const rabbitPreview = document.querySelector('.pet-option[data-type="rabbit"] .pet-preview');
        
        // Cat preview
        catPreview.innerHTML = `
            <circle cx="50" cy="50" r="30" fill="#999" />
            <circle cx="40" cy="45" r="5" fill="black" />
            <circle cx="60" cy="45" r="5" fill="black" />
            <polygon points="30,35 45,25 50,40" fill="#999" />
            <polygon points="70,35 55,25 50,40" fill="#999" />
            <path d="M40,60 Q50,65 60,60" stroke="black" fill="transparent" />
            <path d="M80,50 Q85,40 90,50" stroke="#999" stroke-width="5" fill="transparent" />
        `;
        
        // Dog preview
        dogPreview.innerHTML = `
            <circle cx="50" cy="50" r="30" fill="#D2B48C" />
            <circle cx="40" cy="45" r="5" fill="black" />
            <circle cx="60" cy="45" r="5" fill="black" />
            <ellipse cx="25" cy="30" rx="15" ry="20" fill="#D2B48C" transform="rotate(-30, 25, 30)" />
            <ellipse cx="75" cy="30" rx="15" ry="20" fill="#D2B48C" transform="rotate(30, 75, 30)" />
            <ellipse cx="50" cy="60" rx="15" ry="10" fill="#E8BEAC" />
            <circle cx="50" cy="55" r="5" fill="black" />
            <path d="M45,65 Q50,70 55,65" stroke="black" fill="transparent" />
            <path d="M80,50 Q90,40 95,35" stroke="#D2B48C" stroke-width="5" fill="transparent" />
        `;
        
        // Bird preview
        birdPreview.innerHTML = `
            <circle cx="50" cy="40" r="25" fill="#5DA9E9" />
            <circle cx="40" cy="35" r="5" fill="black" />
            <circle cx="60" cy="35" r="5" fill="black" />
            <polygon points="45,50 55,50 50,65" fill="#FFA500" />
            <ellipse cx="25" cy="50" rx="15" ry="25" fill="#3A8AD7" transform="rotate(-20, 25, 50)" />
            <ellipse cx="75" cy="50" rx="15" ry="25" fill="#3A8AD7" transform="rotate(20, 75, 50)" />
            <line x1="45" y1="80" x2="45" y2="90" stroke="#FFA500" stroke-width="3" />
            <line x1="55" y1="80" x2="55" y2="90" stroke="#FFA500" stroke-width="3" />
        `;
        
        // Rabbit preview
        rabbitPreview.innerHTML = `
            <circle cx="50" cy="60" r="25" fill="#F5F5F5" />
            <circle cx="40" cy="55" r="4" fill="black" />
            <circle cx="60" cy="55" r="4" fill="black" />
            <ellipse cx="35" cy="25" rx="10" ry="25" fill="#F5F5F5" transform="rotate(-10, 35, 25)" />
            <ellipse cx="65" cy="25" rx="10" ry="25" fill="#F5F5F5" transform="rotate(10, 65, 25)" />
            <ellipse cx="35" cy="25" rx="6" ry="20" fill="#FFCBDD" transform="rotate(-10, 35, 25)" />
            <ellipse cx="65" cy="25" rx="6" ry="20" fill="#FFCBDD" transform="rotate(10, 65, 25)" />
            <ellipse cx="50" cy="65" rx="5" ry="4" fill="#FFCBDD" />
            <path d="M45,70 Q50,75 55,70" stroke="black" fill="transparent" />
            <circle cx="80" cy="60" r="8" fill="#F5F5F5" />
        `;
    }
    
    switchToScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show the requested screen
        document.getElementById(screenId).classList.remove('hidden');
        this.currentScreen = screenId;
    }
    
    updateUI() {
        if (!this.gameManager.pet) return;
        
        // Update pet name display
        document.getElementById('pet-name-display').textContent = this.gameManager.pet.name;
        
        // Update pet stats
        this.updatePetStats();
        
        // Update pet level and XP
        this.updatePetLevel();
        
        // Update coins
        this.updateCoins();
        
        // Update status indicators
        this.updateStatusIndicators();
        
        // Update pet animation
        this.updatePetAnimation();
    }
    
    updatePetStats() {
        if (!this.gameManager.pet) return;
        
        // Update stat bars
        document.getElementById('hunger-fill').style.width = `${this.gameManager.pet.hunger}%`;
        document.getElementById('energy-fill').style.width = `${this.gameManager.pet.energy}%`;
        document.getElementById('happiness-fill').style.width = `${this.gameManager.pet.happiness}%`;
        document.getElementById('health-fill').style.width = `${this.gameManager.pet.health}%`;
        
        // Update color based on value
        this.updateStatColor('hunger-fill', this.gameManager.pet.hunger);
        this.updateStatColor('energy-fill', this.gameManager.pet.energy);
        this.updateStatColor('happiness-fill', this.gameManager.pet.happiness);
        this.updateStatColor('health-fill', this.gameManager.pet.health);
    }
    
    updateStatColor(elementId, value) {
        const element = document.getElementById(elementId);
        if (value < 30) {
            element.style.backgroundColor = '#FF5252'; // Red for low
        } else if (value < 60) {
            element.style.backgroundColor = '#FFC107'; // Yellow for medium
        } else {
            // Use default colors for good levels
            switch (elementId) {
                case 'hunger-fill':
                    element.style.backgroundColor = '#FF9800';
                    break;
                case 'energy-fill':
                    element.style.backgroundColor = '#42A5F5';
                    break;
                case 'happiness-fill':
                    element.style.backgroundColor = '#FF6B6B';
                    break;
                case 'health-fill':
                    element.style.backgroundColor = '#4CD964';
                    break;
            }
        }
    }
    
    updatePetLevel() {
        if (!this.gameManager.pet) return;
        
        document.getElementById('pet-level').textContent = this.gameManager.pet.level;
        
        // Update XP bar
        const xpPercentage = (this.gameManager.pet.xp / this.gameManager.pet.xpToNextLevel) * 100;
        document.getElementById('xp-fill').style.width = `${xpPercentage}%`;
    }
    
    updateCoins() {
        document.getElementById('coin-amount').textContent = this.gameManager.coins;
    }
    
    updateShopCoins() {
        document.getElementById('shop-coin-amount').textContent = this.gameManager.coins;
    }
    
    updateStatusIndicators() {
        if (!this.gameManager.pet) return;
        
        // Update sick indicator
        const sickIndicator = document.getElementById('sick-indicator');
        sickIndicator.classList.toggle('hidden', !this.gameManager.pet.isSick);
        
        // Update dirty indicator
        const dirtyIndicator = document.getElementById('dirty-indicator');
        dirtyIndicator.classList.toggle('hidden', !this.gameManager.pet.isDirty);
    }
    
    updatePetAnimation() {
        if (!this.gameManager.pet) return;
        
        // Redraw the pet to update its animation state
        this.gameManager.pet.drawPet();
    }
    
    updateInventory() {
        if (this.currentScreen === 'inventory-screen') {
            this.gameManager.inventory.renderInventory();
        }
    }
    
    showNotification(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationArea.appendChild(notification);
        
        // Add animation class
        setTimeout(() => notification.style.opacity = '1', 10);
        
        // Remove notification after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notificationArea.contains(notification)) {
                    notificationArea.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

