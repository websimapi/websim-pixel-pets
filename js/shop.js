export class Shop {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.items = this.initializeItems();
    }
    
    initializeItems() {
        return [
            {
                id: 'basic_food',
                name: 'Basic Food',
                description: 'Standard meal for your pet. Restores hunger.',
                price: 10,
                effect: {
                    type: 'feed',
                    foodType: 'basic'
                }
            },
            {
                id: 'premium_food',
                name: 'Premium Food',
                description: 'High-quality food that improves health and hunger.',
                price: 25,
                effect: {
                    type: 'feed',
                    foodType: 'premium'
                }
            },
            {
                id: 'treats',
                name: 'Treats',
                description: 'Delicious treats that boost happiness.',
                price: 15,
                effect: {
                    type: 'happiness',
                    value: 20
                }
            },
            {
                id: 'toy_ball',
                name: 'Toy Ball',
                description: 'A fun ball for playing. Increases happiness.',
                price: 30,
                effect: {
                    type: 'happiness',
                    value: 30
                }
            },
            {
                id: 'medicine',
                name: 'Medicine',
                description: 'Cures sickness and restores health.',
                price: 35,
                effect: {
                    type: 'health',
                    value: 30,
                    cureSickness: true
                }
            },
            {
                id: 'energy_drink',
                name: 'Energy Drink',
                description: 'Quickly restores energy.',
                price: 20,
                effect: {
                    type: 'energy',
                    value: 40
                }
            },
            {
                id: 'grooming_kit',
                name: 'Grooming Kit',
                description: 'Cleans dirty pets.',
                price: 15,
                effect: {
                    type: 'clean'
                }
            },
            {
                id: 'training_book',
                name: 'Training Book',
                description: 'Provides XP boost and teaches new skills.',
                price: 50,
                effect: {
                    type: 'xp',
                    value: 25
                }
            },
            {
                id: 'luxury_bed',
                name: 'Luxury Bed',
                description: 'Improves sleep quality and energy recovery.',
                price: 60,
                effect: {
                    type: 'energy',
                    value: 100
                }
            }
        ];
    }
    
    renderShopItems() {
        const shopItemsContainer = document.querySelector('.shop-items');
        shopItemsContainer.innerHTML = '';
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <h3 class="shop-item-name">${item.name}</h3>
                <p class="shop-item-description">${item.description}</p>
                <div class="shop-item-price">
                    ${item.price}
                    <svg class="coin-icon" viewBox="0 0 24 24" width="16" height="16">
                        <circle cx="12" cy="12" r="10" fill="gold" stroke="#b88700" stroke-width="1"/>
                        <circle cx="12" cy="12" r="7" fill="#ffd700" stroke="#b88700" stroke-width="0.5"/>
                    </svg>
                </div>
                <button class="buy-btn" data-item-id="${item.id}">Buy</button>
            `;
            shopItemsContainer.appendChild(itemElement);
        });
        
        // Add event listeners to buy buttons
        const buyButtons = document.querySelectorAll('.buy-btn');
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemId = button.dataset.itemId;
                this.buyItem(itemId);
            });
        });
    }
    
    buyItem(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (!item) return;
        
        if (this.gameManager.spendCoins(item.price)) {
            this.gameManager.inventory.addItem(item);
            this.gameManager.ui.showNotification(`Purchased ${item.name}!`);
            this.gameManager.ui.updateShopCoins();
        } else {
            this.gameManager.ui.showNotification('Not enough coins!', 'error');
        }
    }
    
    getItemById(itemId) {
        return this.items.find(item => item.id === itemId);
    }
}

