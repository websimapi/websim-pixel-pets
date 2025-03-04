import { Pet } from 'petjs';
import { Shop } from 'shopjs';
import { Inventory } from 'inventoryjs';
import { Minigames } from 'minigamesjs';
import { UIManager } from 'uijs';

export class GameManager {
    constructor() {
        this.pet = null;
        this.shop = null;
        this.inventory = null;
        this.minigames = null;
        this.ui = null;
        this.gameActive = false;
        this.coins = 0;
        this.saveInterval = null;
    }

    initialize() {
        this.ui = new UIManager(this);
        this.shop = new Shop(this);
        this.inventory = new Inventory(this);
        this.minigames = new Minigames(this);

        this.ui.setupEventListeners();
        this.loadGame();
        
        // Set up auto-save every 30 seconds
        this.saveInterval = setInterval(() => this.saveGame(), 30000);
    }

    startNewGame(petType, petName) {
        this.pet = new Pet(petType, petName, this);
        this.coins = 50; // Starting coins
        this.gameActive = true;
        this.ui.updateUI();
        this.saveGame();
    }

    loadGame() {
        const savedGame = localStorage.getItem('pixelPetsGame');
        if (savedGame) {
            try {
                const gameData = JSON.parse(savedGame);
                this.coins = gameData.coins || 0;
                
                if (gameData.pet) {
                    this.pet = new Pet(
                        gameData.pet.type,
                        gameData.pet.name,
                        this,
                        gameData.pet
                    );
                    this.gameActive = true;
                    this.ui.switchToScreen('main-screen');
                } else {
                    this.ui.switchToScreen('welcome-screen');
                }
                
                if (gameData.inventory) {
                    this.inventory.loadInventory(gameData.inventory);
                }
                
                this.ui.updateUI();
            } catch (error) {
                console.error('Error loading game:', error);
                this.ui.switchToScreen('welcome-screen');
            }
        } else {
            this.ui.switchToScreen('welcome-screen');
        }
    }

    saveGame() {
        if (!this.gameActive) return;
        
        const gameData = {
            pet: this.pet ? this.pet.getSaveData() : null,
            coins: this.coins,
            inventory: this.inventory.getSaveData()
        };
        
        localStorage.setItem('pixelPetsGame', JSON.stringify(gameData));
    }

    addCoins(amount) {
        this.coins += amount;
        this.ui.updateCoins();
        this.ui.showNotification(`You earned ${amount} coins!`);
    }

    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.ui.updateCoins();
            return true;
        }
        return false;
    }

    gameOver() {
        this.gameActive = false;
        this.ui.switchToScreen('game-over-screen');
        
        // Stop game systems
        if (this.pet) {
            this.pet.stopTimers();
        }
    }

    resetGame() {
        localStorage.removeItem('pixelPetsGame');
        this.pet = null;
        this.coins = 0;
        this.gameActive = false;
        this.inventory.clearInventory();
        this.ui.switchToScreen('welcome-screen');
    }
}

