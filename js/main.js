import { GameManager } from 'gamejs';

// Initialize the game when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    gameManager.initialize();
});

