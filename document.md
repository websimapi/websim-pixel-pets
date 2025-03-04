# Pixel Pets: Virtual Pet Game Documentation

## Overview
Pixel Pets is an interactive virtual pet game where players can adopt, raise, and care for digital pets. The game features a comprehensive pet care system, mini-games, a shop, and an inventory system. Players select from different pet types (cats, dogs, birds, or rabbits), each with unique characteristics and special abilities, and interact with their pets through various actions to maintain their happiness, health, and well-being.

## Core Game Systems

### Pet System
- **Pet Types**: Four distinct pet types (cat, dog, bird, rabbit) with unique appearances and animations
- **Pet Attributes**: Each pet has hunger, energy, happiness, health, level, XP, age, and can experience status conditions
- **Special Abilities**:
  - Cats: "Nine Lives" - recover from sickness faster and have lower chances of getting sick
  - Dogs: "Loyalty Boost" - gain more happiness from interactions and lose happiness slower
  - Birds: "Energy Flight" - restore energy faster when sleeping and consume less energy
  - Rabbits: "Rapid Growth" - gain XP faster from all activities
- **Pet States**: Pets can be idle, eating, playing, or sleeping, with appropriate animations
- **Stat Decay Mechanism**: Every 10 seconds, pet stats naturally decrease (hunger by 2, energy by 1, happiness varies by pet type)
- **Health Dynamics**: Health decreases when other stats are low or pet is sick, and slowly regenerates when other stats are high
- **Age Progression**: Pet age increases gradually (1 day per 10 minutes of real time)

### Core Gameplay Loop
- **Time-Based Effects**: Pet stats decay over time, requiring regular care
- **Pet Care Actions**: Players interact through feeding, playing, sleeping, cleaning, healing, and training
- **Leveling System**: Pets gain XP from activities and level up with increasing XP thresholds (50% increase per level)
- **Random Events**: Pets may experience events like sickness, getting dirty, or XP boosts
- **Automated Timers**: Two main timing systems control stat decay (10-second intervals) and random events (60-second intervals)

### Minigames
The game features three mini-games for earning coins and XP:

1. **Quick Catch**:
   - Test reflexes by clicking on your pet when it appears in random locations
   - 30-second time limit with score based on successful clicks (10 points per catch)
   - Features pet-specific SVG graphics based on the player's chosen pet
   - Pet appears in random locations with randomized timing for unpredictable gameplay
   - Includes hide-and-seek mechanics where pet disappears if not clicked quickly

2. **Memory Match**:
   - Match pairs of cards with pet-related items (8 different pairs)
   - 60-second time limit with bonus points for efficiency
   - Includes SVG icons representing different pet items
   - Scoring system: 20 points per match + time bonus + moves efficiency bonus
   - Cards flip with animations and remain visible when matched
   - Game tracks matches and automatically ends when all pairs are found

3. **Balloon Pop**:
   - Pop colorful balloons as they float up the screen
   - Different colored balloons have different point values (5-25 points)
   - 30-second time limit with animated balloon popping effects
   - Balloons float upward with animation and disappear after 8 seconds
   - Popping creates a visual scoring effect showing points earned
   - Balloons spawn randomly across the game area at 1-second intervals

### Shop System
The shop offers various items for purchase using in-game coins:
- Food items (Basic Food, Premium Food, Treats)
- Toys (Toy Ball)
- Health items (Medicine, Energy Drink, Grooming Kit)
- Special items (Training Book, Luxury Bed)
- Pricing structure ranges from 10 coins (Basic Food) to 60 coins (Luxury Bed)
- Each item has specific effects and value propositions for different pet needs
- Dynamic rendering of shop items with user-friendly layout and descriptions

### Inventory System
- Players can purchase and store items for later use
- Items are stored with their quantities in an object-based structure
- Using items from inventory applies their effects immediately
- The inventory persists between game sessions
- Empty inventory displays a helpful message guiding users to the shop
- Clean interface for item management with quantity tracking

## User Interface

### Main Interface
- **Pet Display**: Center area showing the pet with SVG animations
- **Status Indicators**: Visual indicators for conditions like sickness or dirtiness
- **Stat Bars**: Visual bars for hunger, energy, happiness, and health that change color based on value
- **Level Information**: Displays current level and XP progress bar
- **Coin Counter**: Shows available currency for purchases
- **Action Buttons**: Six main buttons for pet interactions (Feed, Play, Sleep, Clean, Heal, Train)
- **Navigation**: Buttons to access Shop, Inventory, and Mini-games

### Pet Animations and Visual Feedback
- **SVG-based Graphics**: All pets and UI elements use scalable vector graphics
- **State Animations**: Different animations based on pet's current activity
  - Sleeping pets close their eyes
  - Playing pets have tail/ear/wing animations
  - Eating pets have different mouth positions
- **Interactive Elements**: All pets have multiple animated components (ears, tails, wings, etc.)
- **Animation Technologies**: Uses native SVG animation elements (animateTransform) for smooth motion
- **Pet-Specific Features**: Each pet type has unique visual details (cat's whiskers, dog's ears, bird's wings, rabbit's ears)

### Notification System
- **Event Notifications**: Pop-up messages for important events
- **Fading Animation**: Notifications appear and fade out automatically after 3 seconds
- **Color Coding**: Different types of notifications (info, error)
- **Queue Management**: Multiple notifications stack in sequence
- **CSS Animation**: Uses keyframes for smooth entry and exit animations

## Game Progression

### Pet Development
- **Aging**: Pet age increases over time (1 day per 10 minutes of real time)
- **Leveling**: XP requirements increase with each level (multiplied by 1.5 each level)
- **Stat Management**: Becomes more challenging as the pet ages
- **Level-Up Benefits**: Full stat restoration on level-up for a gameplay reward

### Economy Progression
- **Starting Balance**: Players begin with 50 coins
- **Earning Coins**: Primarily through mini-games (approximately 1 coin per 10 points scored)
- **Item Costs**: Range from 10 coins (Basic Food) to 60 coins (Luxury Bed)
- **Reward Calculation**: Mini-game rewards scaled to performance (coins = score/10, XP = score/5)
- **Minimum Rewards**: Games guarantee at least 5 coins and 3 XP regardless of performance

## Technical Features

### Save System
- **Automatic Saving**: Game state saves automatically every 30 seconds
- **Local Storage**: Uses browser localStorage to persist game data
- **Save Data**: Includes pet stats, inventory items, and coins
- **Error Handling**: Gracefully handles corrupted save data
- **Data Structure**: Uses JSON serialization for save data storage

### Game Over Conditions
- **Health Threshold**: Game over when pet health reaches zero
- **Reset Option**: Players can start a new game after a game over
- **Resource Cleanup**: Stops all game timers when game over is triggered
- **Data Management**: Option to completely reset saved data for fresh start

## Game Design Considerations

### User Experience Flow
1. **Initial Welcome Screen**: Select pet type and name
2. **Main Game Screen**: Care for pet and monitor stats
3. **Shop Screen**: Purchase items using coins
4. **Inventory Screen**: Manage and use owned items
5. **Mini-games Screen**: Select and play games to earn rewards
6. **Game Over Screen**: Provides closure and restart options

### Visual Design
- **Pet Visuals**: Simple, charming SVG-based pet designs with pet-specific features
- **Color Scheme**: Bright, friendly colors with stat-specific color coding
- **Responsive Design**: Interface adapts to different screen sizes
- **Consistent Styling**: Unified design language across all screens
- **Visual Feedback**: Interactive elements provide clear state changes
- **Color Psychology**: Green for health, blue for energy, orange for hunger, red for happiness

### Code Structure
- **Modular Architecture**: Separate classes for different game systems
- **GameManager**: Central controller coordinating all game systems
- **Event-Based Interactions**: UI events trigger appropriate game actions
- **SVG Rendering**: Dynamic SVG creation for all pet animations
- **Object-Oriented Design**: Each system encapsulated in its own class with clear responsibilities
- **Clean Inheritance**: Systems reference each other through the central GameManager

## Implementation Details

### Class Structure
- **Pet**: Manages pet attributes, states, and rendering
- **GameManager**: Coordinates overall game state and systems
- **Shop**: Handles item definitions and purchasing
- **Inventory**: Manages owned items and their effects
- **Minigames**: Contains all mini-game logic and rendering
- **UIManager**: Controls screen switching and UI updates

### Rendering Approach
- **SVG-Based Graphics**: All visuals use scalable vector graphics
- **Dynamic Element Creation**: UI elements created through JavaScript
- **CSS Animations**: Used for visual effects and transitions
- **DOM Manipulation**: Direct manipulation of SVG elements
- **Animation Control**: Programmatic animation control based on game state

### State Management
- **Object-Oriented Design**: Each game system maintains its own state
- **Central Coordination**: GameManager oversees integration between systems
- **Persistent Storage**: Regular saving of game state to localStorage
- **Event-Driven Updates**: Systems communicate through events and callbacks
- **Clean Separation**: UI updates separated from game logic

## Browser Compatibility and Performance
- **SVG Rendering**: Uses standard SVG elements compatible with all modern browsers
- **JS Modules**: Employs ES6 modules with import maps for code organization
- **No External Dependencies**: Pure vanilla JavaScript implementation
- **Performance Optimizations**: Efficient DOM updates and animation throttling
- **Responsive Design**: CSS media queries for different screen sizes
- **Lightweight Architecture**: Minimal memory footprint with efficient resource usage

## Future Enhancement Opportunities
- Pet accessories for customization
- Additional pet types with unique abilities
- Habitat customization options
- Pet interaction features
- Achievement system for milestones
- Seasonal events with special rewards
- Advanced pet skills system
- Social features for sharing and competition
- Sound effects and background music
- Tutorial system for new players
- Difficulty levels for mini-games
- Expanded item crafting system

This virtual pet game provides an engaging, casual experience that rewards regular interaction and strategic resource management while creating an emotional connection with the virtual pet. The technical implementation is lightweight yet robust, offering smooth performance across a variety of devices while maintaining an accessible codebase for future enhancements.

