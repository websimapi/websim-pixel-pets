export class Pet {
    constructor(type, name, gameManager, savedData = null) {
        this.type = type;
        this.name = name;
        this.gameManager = gameManager;
        
        // Initialize with default values or saved data
        if (savedData) {
            this.loadSavedData(savedData);
        } else {
            this.initializeDefaults();
        }
        
        this.statDecayInterval = setInterval(() => this.updateStats(), 10000); // Every 10 seconds
        this.randomEventInterval = setInterval(() => this.checkRandomEvents(), 60000); // Every minute
        
        // Draw the pet
        this.drawPet();
    }
    
    initializeDefaults() {
        this.hunger = 100;
        this.energy = 100;
        this.happiness = 100;
        this.health = 100;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.age = 0; // Age in days
        this.isSick = false;
        this.isDirty = false;
        this.state = 'idle'; // idle, eating, playing, sleeping
        this.lastStatUpdate = Date.now();
        this.sleepStartTime = null; // Tracking sleep duration
    }
    
    loadSavedData(data) {
        this.hunger = data.hunger ?? 100;
        this.energy = data.energy ?? 100;
        this.happiness = data.happiness ?? 100;
        this.health = data.health ?? 100;
        this.level = data.level ?? 1;
        this.xp = data.xp ?? 0;
        this.xpToNextLevel = data.xpToNextLevel ?? 100;
        this.age = data.age ?? 0;
        this.isSick = data.isSick ?? false;
        this.isDirty = data.isDirty ?? false;
        this.state = data.state ?? 'idle';
        this.lastStatUpdate = Date.now();
        this.sleepStartTime = data.state === 'sleeping' ? Date.now() : null;
    }
    
    getSaveData() {
        return {
            type: this.type,
            name: this.name,
            hunger: this.hunger,
            energy: this.energy,
            happiness: this.happiness,
            health: this.health,
            level: this.level,
            xp: this.xp,
            xpToNextLevel: this.xpToNextLevel,
            age: this.age,
            isSick: this.isSick,
            isDirty: this.isDirty,
            state: this.state
        };
    }
    
    updateStats() {
        const now = Date.now();
        const timePassed = (now - this.lastStatUpdate) / 1000; // in seconds
        this.lastStatUpdate = now;
        
        // Skip stat decay if sleeping
        if (this.state === 'sleeping') {
            // Regenerate energy while sleeping
            const energyRegen = this.type === 'bird' ? 10 : 5; // Birds regenerate energy faster
            this.energy = Math.min(100, this.energy + energyRegen);
            return;
        }
        
        // Decrease stats over time
        this.hunger = Math.max(0, this.hunger - 2);
        this.energy = Math.max(0, this.energy - 1);
        
        // Happiness decay rate depends on pet type
        const happinessDecay = this.type === 'dog' ? 1 : 2; // Dogs lose happiness slower
        this.happiness = Math.max(0, this.happiness - happinessDecay);
        
        // Health is affected by other stats
        if (this.hunger < 30 || this.energy < 20 || this.happiness < 20 || this.isSick) {
            this.health = Math.max(0, this.health - 3);
        } else if (this.hunger > 70 && this.energy > 50 && this.happiness > 50 && !this.isSick) {
            this.health = Math.min(100, this.health + 1);
        }
        
        // Increment age (1 day per 10 minutes of real time)
        this.age += timePassed / 600;
        
        // Check for death condition
        if (this.health <= 0) {
            this.gameManager.gameOver();
        }
        
        // Update UI
        this.gameManager.ui.updatePetStats();
    }
    
    checkRandomEvents() {
        // Only run events if not sleeping
        if (this.state === 'sleeping') return;
        
        const randomValue = Math.random();
        
        // Chance to get sick (less for cats due to "Nine Lives" ability)
        if (randomValue < (this.type === 'cat' ? 0.05 : 0.1)) {
            this.getSick();
        }
        // Chance to get dirty
        else if (randomValue < 0.2) {
            this.getDirty();
        }
        // Chance for XP boost (more for rabbits due to "Rapid Growth" ability)
        else if (randomValue < 0.3) {
            const xpBoost = this.type === 'rabbit' ? 15 : 10;
            this.addXP(xpBoost);
            this.gameManager.ui.showNotification(`${this.name} had a growth spurt! +${xpBoost} XP`);
        }
    }
    
    feed(foodType = 'basic') {
        if (this.state !== 'idle') return false;
        
        this.changeState('eating');
        this.hunger = Math.min(100, this.hunger + (foodType === 'premium' ? 50 : 30));
        
        if (foodType === 'premium') {
            this.health = Math.min(100, this.health + 10);
        }
        
        setTimeout(() => {
            this.changeState('idle');
            this.gameManager.ui.updatePetStats();
            this.gameManager.ui.updatePetAnimation();
        }, 2000);
        
        this.gameManager.ui.updatePetStats();
        this.gameManager.ui.updatePetAnimation();
        return true;
    }
    
    play() {
        if (this.state !== 'idle' || this.energy < 10) return false;
        
        this.changeState('playing');
        
        // Dogs gain more happiness from play due to "Loyalty Boost"
        this.happiness = Math.min(100, this.happiness + (this.type === 'dog' ? 30 : 20));
        
        // Birds use less energy for activities
        this.energy = Math.max(0, this.energy - (this.type === 'bird' ? 10 : 15));
        this.addXP(5);
        
        setTimeout(() => {
            this.changeState('idle');
            this.gameManager.ui.updatePetStats();
            this.gameManager.ui.updatePetAnimation();
        }, 3000);
        
        this.gameManager.ui.updatePetStats();
        this.gameManager.ui.updatePetAnimation();
        return true;
    }
    
    sleep() {
        if (this.state === 'sleeping') {
            // Wake up if already sleeping
            const sleepDuration = (Date.now() - this.sleepStartTime) / 1000; // in seconds
            
            // Give XP for sleeping
            const xpGained = Math.floor(sleepDuration / 10);
            if (xpGained > 0) {
                this.addXP(xpGained);
            }
            
            this.changeState('idle');
            this.sleepStartTime = null;
        } else if (this.state === 'idle') {
            // Go to sleep
            this.changeState('sleeping');
            this.sleepStartTime = Date.now();
        } else {
            return false;
        }
        
        this.gameManager.ui.updatePetStats();
        this.gameManager.ui.updatePetAnimation();
        return true;
    }
    
    clean() {
        if (this.state !== 'idle') return false;
        
        if (this.isDirty) {
            this.isDirty = false;
            this.happiness = Math.min(100, this.happiness + 10);
            this.addXP(3);
            this.gameManager.ui.updateStatusIndicators();
            this.gameManager.ui.updatePetStats();
            return true;
        }
        return false;
    }
    
    heal() {
        if (this.state !== 'idle') return false;
        
        if (this.isSick) {
            this.isSick = false;
            this.health = Math.min(100, this.health + 20);
            this.addXP(5);
            this.gameManager.ui.updateStatusIndicators();
            this.gameManager.ui.updatePetStats();
            return true;
        }
        return false;
    }
    
    train() {
        if (this.state !== 'idle' || this.energy < 20) return false;
        
        // Rabbits gain more XP from training due to "Rapid Growth"
        const xpGain = this.type === 'rabbit' ? 15 : 10;
        this.addXP(xpGain);
        
        // Birds use less energy for activities
        this.energy = Math.max(0, this.energy - (this.type === 'bird' ? 15 : 20));
        this.gameManager.ui.updatePetStats();
        this.gameManager.ui.showNotification(`${this.name} learned something new! +${xpGain} XP`);
        return true;
    }
    
    addXP(amount) {
        this.xp += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
        this.gameManager.ui.updatePetLevel();
    }
    
    levelUp() {
        this.level++;
        this.xp = this.xp - this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        
        // Boost stats on level up
        this.hunger = 100;
        this.energy = 100;
        this.happiness = 100;
        this.health = 100;
        
        this.gameManager.ui.showNotification(`${this.name} leveled up to level ${this.level}!`);
        this.gameManager.ui.updatePetStats();
        this.gameManager.ui.updatePetLevel();
    }
    
    getSick() {
        if (!this.isSick) {
            this.isSick = true;
            this.gameManager.ui.showNotification(`${this.name} is feeling sick!`);
            this.gameManager.ui.updateStatusIndicators();
        }
    }
    
    getDirty() {
        if (!this.isDirty) {
            this.isDirty = true;
            this.gameManager.ui.showNotification(`${this.name} got dirty!`);
            this.gameManager.ui.updateStatusIndicators();
        }
    }
    
    changeState(newState) {
        this.state = newState;
    }
    
    stopTimers() {
        clearInterval(this.statDecayInterval);
        clearInterval(this.randomEventInterval);
    }
    
    drawPet() {
        const petSvg = document.getElementById('pet-svg');
        petSvg.innerHTML = '';
        
        switch (this.type) {
            case 'cat':
                this.drawCat(petSvg);
                break;
            case 'dog':
                this.drawDog(petSvg);
                break;
            case 'bird':
                this.drawBird(petSvg);
                break;
            case 'rabbit':
                this.drawRabbit(petSvg);
                break;
        }
    }
    
    drawCat(svg) {
        // Body
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        body.setAttribute('cx', '100');
        body.setAttribute('cy', '120');
        body.setAttribute('rx', '40');
        body.setAttribute('ry', '30');
        body.setAttribute('fill', '#999');
        svg.appendChild(body);
        
        // Head
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '100');
        head.setAttribute('cy', '80');
        head.setAttribute('r', '30');
        head.setAttribute('fill', '#999');
        svg.appendChild(head);
        
        // Eyes
        const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leftEye.setAttribute('cx', '85');
        leftEye.setAttribute('cy', '75');
        leftEye.setAttribute('r', '5');
        leftEye.setAttribute('fill', 'black');
        svg.appendChild(leftEye);
        
        const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rightEye.setAttribute('cx', '115');
        rightEye.setAttribute('cy', '75');
        rightEye.setAttribute('r', '5');
        rightEye.setAttribute('fill', 'black');
        svg.appendChild(rightEye);
        
        // Ears
        const leftEar = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        leftEar.setAttribute('points', '70,65 85,45 95,70');
        leftEar.setAttribute('fill', '#999');
        svg.appendChild(leftEar);
        
        const rightEar = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        rightEar.setAttribute('points', '130,65 115,45 105,70');
        rightEar.setAttribute('fill', '#999');
        svg.appendChild(rightEar);
        
        // Mouth
        const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        if (this.state === 'sleeping') {
            mouth.setAttribute('d', 'M90,90 Q100,95 110,90');
            
            // Close eyes when sleeping
            leftEye.setAttribute('rx', '5');
            leftEye.setAttribute('ry', '1');
            rightEye.setAttribute('rx', '5');
            rightEye.setAttribute('ry', '1');
        } else if (this.state === 'playing') {
            mouth.setAttribute('d', 'M90,90 Q100,100 110,90');
        } else if (this.state === 'eating') {
            mouth.setAttribute('d', 'M90,90 Q100,105 110,90');
        } else {
            mouth.setAttribute('d', 'M90,90 Q100,95 110,90');
        }
        
        mouth.setAttribute('stroke', 'black');
        mouth.setAttribute('fill', 'transparent');
        svg.appendChild(mouth);
        
        // Tail
        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tail.setAttribute('d', 'M140,120 Q160,100 170,120');
        tail.setAttribute('stroke', '#999');
        tail.setAttribute('stroke-width', '8');
        tail.setAttribute('fill', 'transparent');
        svg.appendChild(tail);
        
        // Animation for the tail
        if (this.state === 'playing') {
            const animateTail = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateTail.setAttribute('attributeName', 'transform');
            animateTail.setAttribute('type', 'rotate');
            animateTail.setAttribute('from', '0 140 120');
            animateTail.setAttribute('to', '20 140 120');
            animateTail.setAttribute('dur', '0.5s');
            animateTail.setAttribute('repeatCount', 'indefinite');
            animateTail.setAttribute('additive', 'sum');
            animateTail.setAttribute('calcMode', 'spline');
            animateTail.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
            animateTail.setAttribute('keyTimes', '0; 0.5; 1');
            animateTail.setAttribute('values', '0 140 120; 20 140 120; 0 140 120');
            tail.appendChild(animateTail);
        }
    }
    
    drawDog(svg) {
        // Body
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        body.setAttribute('cx', '100');
        body.setAttribute('cy', '120');
        body.setAttribute('rx', '40');
        body.setAttribute('ry', '30');
        body.setAttribute('fill', '#D2B48C');
        svg.appendChild(body);
        
        // Head
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '100');
        head.setAttribute('cy', '80');
        head.setAttribute('r', '30');
        head.setAttribute('fill', '#D2B48C');
        svg.appendChild(head);
        
        // Eyes
        const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leftEye.setAttribute('cx', '85');
        leftEye.setAttribute('cy', '75');
        leftEye.setAttribute('r', '5');
        leftEye.setAttribute('fill', 'black');
        svg.appendChild(leftEye);
        
        const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rightEye.setAttribute('cx', '115');
        rightEye.setAttribute('cy', '75');
        rightEye.setAttribute('r', '5');
        rightEye.setAttribute('fill', 'black');
        svg.appendChild(rightEye);
        
        // Ears
        const leftEar = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leftEar.setAttribute('cx', '75');
        leftEar.setAttribute('cy', '60');
        leftEar.setAttribute('rx', '15');
        leftEar.setAttribute('ry', '20');
        leftEar.setAttribute('fill', '#D2B48C');
        leftEar.setAttribute('transform', 'rotate(-30, 75, 60)');
        svg.appendChild(leftEar);
        
        const rightEar = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        rightEar.setAttribute('cx', '125');
        rightEar.setAttribute('cy', '60');
        rightEar.setAttribute('rx', '15');
        rightEar.setAttribute('ry', '20');
        rightEar.setAttribute('fill', '#D2B48C');
        rightEar.setAttribute('transform', 'rotate(30, 125, 60)');
        svg.appendChild(rightEar);
        
        // Muzzle
        const muzzle = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        muzzle.setAttribute('cx', '100');
        muzzle.setAttribute('cy', '90');
        muzzle.setAttribute('rx', '15');
        muzzle.setAttribute('ry', '10');
        muzzle.setAttribute('fill', '#E8BEAC');
        svg.appendChild(muzzle);
        
        // Nose
        const nose = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        nose.setAttribute('cx', '100');
        nose.setAttribute('cy', '85');
        nose.setAttribute('r', '5');
        nose.setAttribute('fill', 'black');
        svg.appendChild(nose);
        
        // Mouth
        const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        if (this.state === 'sleeping') {
            mouth.setAttribute('d', 'M90,95 Q100,100 110,95');
            
            // Close eyes when sleeping
            leftEye.setAttribute('rx', '5');
            leftEye.setAttribute('ry', '1');
            rightEye.setAttribute('rx', '5');
            rightEye.setAttribute('ry', '1');
        } else if (this.state === 'playing') {
            mouth.setAttribute('d', 'M90,95 Q100,105 110,95');
        } else if (this.state === 'eating') {
            mouth.setAttribute('d', 'M90,95 Q100,110 110,95');
        } else {
            mouth.setAttribute('d', 'M90,95 Q100,100 110,95');
        }
        
        mouth.setAttribute('stroke', 'black');
        mouth.setAttribute('fill', 'transparent');
        svg.appendChild(mouth);
        
        // Tail
        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tail.setAttribute('d', 'M140,120 Q160,100 170,90');
        tail.setAttribute('stroke', '#D2B48C');
        tail.setAttribute('stroke-width', '8');
        tail.setAttribute('fill', 'transparent');
        svg.appendChild(tail);
        
        // Animation for the tail
        if (this.state === 'playing' || this.state === 'eating') {
            const animateTail = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateTail.setAttribute('attributeName', 'transform');
            animateTail.setAttribute('type', 'rotate');
            animateTail.setAttribute('from', '0 140 120');
            animateTail.setAttribute('to', '20 140 120');
            animateTail.setAttribute('dur', '0.5s');
            animateTail.setAttribute('repeatCount', 'indefinite');
            animateTail.setAttribute('additive', 'sum');
            animateTail.setAttribute('calcMode', 'spline');
            animateTail.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
            animateTail.setAttribute('keyTimes', '0; 0.5; 1');
            animateTail.setAttribute('values', '0 140 120; 20 140 120; 0 140 120');
            tail.appendChild(animateTail);
        }
    }
    
    drawBird(svg) {
        // Body
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        body.setAttribute('cx', '100');
        body.setAttribute('cy', '120');
        body.setAttribute('rx', '30');
        body.setAttribute('ry', '25');
        body.setAttribute('fill', '#5DA9E9');
        svg.appendChild(body);
        
        // Head
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '100');
        head.setAttribute('cy', '85');
        head.setAttribute('r', '25');
        head.setAttribute('fill', '#5DA9E9');
        svg.appendChild(head);
        
        // Eyes
        const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leftEye.setAttribute('cx', '90');
        leftEye.setAttribute('cy', '80');
        leftEye.setAttribute('r', '5');
        leftEye.setAttribute('fill', 'black');
        svg.appendChild(leftEye);
        
        const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rightEye.setAttribute('cx', '110');
        rightEye.setAttribute('cy', '80');
        rightEye.setAttribute('r', '5');
        rightEye.setAttribute('fill', 'black');
        svg.appendChild(rightEye);
        
        // Beak
        const beak = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        if (this.state === 'eating') {
            beak.setAttribute('points', '95,95 105,95 100,110');
        } else {
            beak.setAttribute('points', '95,90 105,90 100,105');
        }
        
        beak.setAttribute('fill', '#FFA500');
        svg.appendChild(beak);
        
        // Wings
        const leftWing = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leftWing.setAttribute('cx', '75');
        leftWing.setAttribute('cy', '120');
        leftWing.setAttribute('rx', '15');
        leftWing.setAttribute('ry', '25');
        leftWing.setAttribute('fill', '#3A8AD7');
        leftWing.setAttribute('transform', 'rotate(-20, 75, 120)');
        svg.appendChild(leftWing);
        
        const rightWing = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        rightWing.setAttribute('cx', '125');
        rightWing.setAttribute('cy', '120');
        rightWing.setAttribute('rx', '15');
        rightWing.setAttribute('ry', '25');
        rightWing.setAttribute('fill', '#3A8AD7');
        rightWing.setAttribute('transform', 'rotate(20, 125, 120)');
        svg.appendChild(rightWing);
        
        // Feet
        const leftFoot = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        leftFoot.setAttribute('x1', '90');
        leftFoot.setAttribute('y1', '145');
        leftFoot.setAttribute('x2', '90');
        leftFoot.setAttribute('y2', '160');
        leftFoot.setAttribute('stroke', '#FFA500');
        leftFoot.setAttribute('stroke-width', '3');
        svg.appendChild(leftFoot);
        
        const rightFoot = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rightFoot.setAttribute('x1', '110');
        rightFoot.setAttribute('y1', '145');
        rightFoot.setAttribute('x2', '110');
        rightFoot.setAttribute('y2', '160');
        rightFoot.setAttribute('stroke', '#FFA500');
        rightFoot.setAttribute('stroke-width', '3');
        svg.appendChild(rightFoot);
        
        // Animation for the wings during playing
        if (this.state === 'playing') {
            const animateLeftWing = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateLeftWing.setAttribute('attributeName', 'transform');
            animateLeftWing.setAttribute('type', 'rotate');
            animateLeftWing.setAttribute('from', '-20 75 120');
            animateLeftWing.setAttribute('to', '-40 75 120');
            animateLeftWing.setAttribute('dur', '0.5s');
            animateLeftWing.setAttribute('repeatCount', 'indefinite');
            animateLeftWing.setAttribute('additive', 'replace');
            animateLeftWing.setAttribute('calcMode', 'spline');
            animateLeftWing.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
            animateLeftWing.setAttribute('keyTimes', '0; 0.5; 1');
            animateLeftWing.setAttribute('values', '-20 75 120; -40 75 120; -20 75 120');
            leftWing.appendChild(animateLeftWing);
            
            const animateRightWing = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateRightWing.setAttribute('attributeName', 'transform');
            animateRightWing.setAttribute('type', 'rotate');
            animateRightWing.setAttribute('from', '20 125 120');
            animateRightWing.setAttribute('to', '40 125 120');
            animateRightWing.setAttribute('dur', '0.5s');
            animateRightWing.setAttribute('repeatCount', 'indefinite');
            animateRightWing.setAttribute('additive', 'replace');
            animateRightWing.setAttribute('calcMode', 'spline');
            animateRightWing.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
            animateRightWing.setAttribute('keyTimes', '0; 0.5; 1');
            animateRightWing.setAttribute('values', '20 125 120; 40 125 120; 20 125 120');
            rightWing.appendChild(animateRightWing);
        }
        
        if (this.state === 'sleeping') {
            // Close eyes when sleeping
            leftEye.setAttribute('rx', '5');
            leftEye.setAttribute('ry', '1');
            rightEye.setAttribute('rx', '5');
            rightEye.setAttribute('ry', '1');
        }
    }
    
    drawRabbit(svg) {
        // Body
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        body.setAttribute('cx', '100');
        body.setAttribute('cy', '130');
        body.setAttribute('rx', '30');
        body.setAttribute('ry', '25');
        body.setAttribute('fill', '#F5F5F5');
        svg.appendChild(body);
        
        // Head
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', '100');
        head.setAttribute('cy', '90');
        head.setAttribute('r', '25');
        head.setAttribute('fill', '#F5F5F5');
        svg.appendChild(head);
        
        // Eyes
        const leftEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        leftEye.setAttribute('cx', '90');
        leftEye.setAttribute('cy', '85');
        leftEye.setAttribute('r', '4');
        leftEye.setAttribute('fill', 'black');
        svg.appendChild(leftEye);
        
        const rightEye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        rightEye.setAttribute('cx', '110');
        rightEye.setAttribute('cy', '85');
        rightEye.setAttribute('r', '4');
        rightEye.setAttribute('fill', 'black');
        svg.appendChild(rightEye);
        
        // Ears
        const leftEar = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leftEar.setAttribute('cx', '85');
        leftEar.setAttribute('cy', '55');
        leftEar.setAttribute('rx', '10');
        leftEar.setAttribute('ry', '25');
        leftEar.setAttribute('fill', '#F5F5F5');
        leftEar.setAttribute('transform', 'rotate(-10, 85, 55)');
        svg.appendChild(leftEar);
        
        const rightEar = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        rightEar.setAttribute('cx', '115');
        rightEar.setAttribute('cy', '55');
        rightEar.setAttribute('rx', '10');
        rightEar.setAttribute('ry', '25');
        rightEar.setAttribute('fill', '#F5F5F5');
        rightEar.setAttribute('transform', 'rotate(10, 115, 55)');
        svg.appendChild(rightEar);
        
        // Inner ears
        const leftInnerEar = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leftInnerEar.setAttribute('cx', '85');
        leftInnerEar.setAttribute('cy', '55');
        leftInnerEar.setAttribute('rx', '6');
        leftInnerEar.setAttribute('ry', '20');
        leftInnerEar.setAttribute('fill', '#FFCBDD');
        leftInnerEar.setAttribute('transform', 'rotate(-10, 85, 55)');
        svg.appendChild(leftInnerEar);
        
        const rightInnerEar = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        rightInnerEar.setAttribute('cx', '115');
        rightInnerEar.setAttribute('cy', '55');
        rightInnerEar.setAttribute('rx', '6');
        rightInnerEar.setAttribute('ry', '20');
        rightInnerEar.setAttribute('fill', '#FFCBDD');
        rightInnerEar.setAttribute('transform', 'rotate(10, 115, 55)');
        svg.appendChild(rightInnerEar);
        
        // Nose
        const nose = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        nose.setAttribute('cx', '100');
        nose.setAttribute('cy', '95');
        nose.setAttribute('rx', '5');
        nose.setAttribute('ry', '4');
        nose.setAttribute('fill', '#FFCBDD');
        svg.appendChild(nose);
        
        // Mouth
        const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        if (this.state === 'sleeping') {
            mouth.setAttribute('d', 'M95,100 Q100,105 105,100');
            
            // Close eyes when sleeping
            leftEye.setAttribute('rx', '4');
            leftEye.setAttribute('ry', '1');
            rightEye.setAttribute('rx', '4');
            rightEye.setAttribute('ry', '1');
        } else if (this.state === 'playing') {
            mouth.setAttribute('d', 'M95,100 Q100,110 105,100');
        } else if (this.state === 'eating') {
            mouth.setAttribute('d', 'M95,100 Q100,108 105,100');
        } else {
            mouth.setAttribute('d', 'M95,100 Q100,105 105,100');
        }
        
        mouth.setAttribute('stroke', 'black');
        mouth.setAttribute('fill', 'transparent');
        svg.appendChild(mouth);
        
        // Feet
        const leftFoot = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leftFoot.setAttribute('cx', '85');
        leftFoot.setAttribute('cy', '150');
        leftFoot.setAttribute('rx', '8');
        leftFoot.setAttribute('ry', '5');
        leftFoot.setAttribute('fill', '#FFCBDD');
        svg.appendChild(leftFoot);
        
        const rightFoot = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        rightFoot.setAttribute('cx', '115');
        rightFoot.setAttribute('cy', '150');
        rightFoot.setAttribute('rx', '8');
        rightFoot.setAttribute('ry', '5');
        rightFoot.setAttribute('fill', '#FFCBDD');
        svg.appendChild(rightFoot);
        
        // Tail
        const tail = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        tail.setAttribute('cx', '130');
        tail.setAttribute('cy', '130');
        tail.setAttribute('r', '8');
        tail.setAttribute('fill', '#F5F5F5');
        svg.appendChild(tail);
        
        // Animation for the ears during playing
        if (this.state === 'playing') {
            const animateLeftEar = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateLeftEar.setAttribute('attributeName', 'transform');
            animateLeftEar.setAttribute('type', 'rotate');
            animateLeftEar.setAttribute('from', '-10 85 55');
            animateLeftEar.setAttribute('to', '-20 85 55');
            animateLeftEar.setAttribute('dur', '0.7s');
            animateLeftEar.setAttribute('repeatCount', 'indefinite');
            animateLeftEar.setAttribute('additive', 'replace');
            animateLeftEar.setAttribute('calcMode', 'spline');
            animateLeftEar.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
            animateLeftEar.setAttribute('keyTimes', '0; 0.5; 1');
            animateLeftEar.setAttribute('values', '-10 85 55; -20 85 55; -10 85 55');
            leftEar.appendChild(animateLeftEar);
            leftInnerEar.appendChild(animateLeftEar.cloneNode(true));
            
            const animateRightEar = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateRightEar.setAttribute('attributeName', 'transform');
            animateRightEar.setAttribute('type', 'rotate');
            animateRightEar.setAttribute('from', '10 115 55');
            animateRightEar.setAttribute('to', '20 115 55');
            animateRightEar.setAttribute('dur', '0.7s');
            animateRightEar.setAttribute('repeatCount', 'indefinite');
            animateRightEar.setAttribute('additive', 'replace');
            animateRightEar.setAttribute('calcMode', 'spline');
            animateRightEar.setAttribute('keySplines', '0.5 0 0.5 1; 0.5 0 0.5 1');
            animateRightEar.setAttribute('keyTimes', '0; 0.5; 1');
            animateRightEar.setAttribute('values', '10 115 55; 20 115 55; 10 115 55');
            rightEar.appendChild(animateRightEar);
            rightInnerEar.appendChild(animateRightEar.cloneNode(true));
        }
    }
}

