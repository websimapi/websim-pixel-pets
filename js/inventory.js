export class Inventory {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.items = {}; // Structure: { itemId: quantity }
    }
    
    addItem(item) {
        if (!this.items[item.id]) {
            this.items[item.id] = 0;
        }
        this.items[item.id]++;
        this.gameManager.ui.updateInventory();
    }
    
    useItem(itemId) {
        if (!this.items[itemId] || this.items[itemId] <= 0) {
            this.gameManager.ui.showNotification('Item not available!', 'error');
            return false;
        }
        
        const item = this.gameManager.shop.getItemById(itemId);
        if (!item) return false;
        
        const success = this.applyItemEffect(item);
        
        if (success) {
            this.items[itemId]--;
            if (this.items[itemId] <= 0) {
                delete this.items[itemId];
            }
            this.gameManager.ui.updateInventory();
            this.gameManager.ui.showNotification(`Used ${item.name}!`);
            return true;
        }
        
        return false;
    }
    
    applyItemEffect(item) {
        const pet = this.gameManager.pet;
        if (!pet) return false;
        
        switch (item.effect.type) {
            case 'feed':
                return pet.feed(item.effect.foodType);
            
            case 'happiness':
                pet.happiness = Math.min(100, pet.happiness + item.effect.value);
                this.gameManager.ui.updatePetStats();
                return true;
            
            case 'health':
                pet.health = Math.min(100, pet.health + item.effect.value);
                if (item.effect.cureSickness && pet.isSick) {
                    pet.isSick = false;
                    this.gameManager.ui.updateStatusIndicators();
                }
                this.gameManager.ui.updatePetStats();
                return true;
            
            case 'energy':
                pet.energy = Math.min(100, pet.energy + item.effect.value);
                this.gameManager.ui.updatePetStats();
                return true;
            
            case 'clean':
                if (pet.isDirty) {
                    pet.isDirty = false;
                    pet.happiness = Math.min(100, pet.happiness + 10);
                    this.gameManager.ui.updateStatusIndicators();
                    this.gameManager.ui.updatePetStats();
                    return true;
                }
                this.gameManager.ui.showNotification('Your pet is already clean!');
                return false;
            
            case 'xp':
                pet.addXP(item.effect.value);
                return true;
            
            default:
                return false;
        }
    }
    
    renderInventory() {
        const inventoryContainer = document.querySelector('.inventory-items');
        inventoryContainer.innerHTML = '';
        
        let hasItems = false;
        
        for (const itemId in this.items) {
            const item = this.gameManager.shop.getItemById(itemId);
            if (!item) continue;
            
            hasItems = true;
            const quantity = this.items[itemId];
            
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.innerHTML = `
                <h3 class="inventory-item-name">${item.name}</h3>
                <p class="inventory-item-quantity">Quantity: ${quantity}</p>
                <button class="use-btn" data-item-id="${itemId}">Use</button>
            `;
            inventoryContainer.appendChild(itemElement);
        }
        
        if (!hasItems) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Your inventory is empty. Visit the shop to purchase items!';
            emptyMessage.className = 'empty-inventory-message';
            inventoryContainer.appendChild(emptyMessage);
        } else {
            // Add event listeners to use buttons
            const useButtons = document.querySelectorAll('.use-btn');
            useButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const itemId = button.dataset.itemId;
                    this.useItem(itemId);
                });
            });
        }
    }
    
    clearInventory() {
        this.items = {};
    }
    
    loadInventory(inventoryData) {
        this.items = inventoryData;
    }
    
    getSaveData() {
        return this.items;
    }
}

