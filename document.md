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

### Core Gameplay Loop
- **Time-Based Effects**: Pet stats decay over time, requiring regular care
- **Pet Care Actions**: Players interact through feeding, playing, sleeping, cleaning, healing, and training
- **Leveling System**: Pets gain XP from activities and level up with increasing XP thresholds
- **Random Events**: Pets may experience events like sickness, getting dirty, or XP boosts

### Minigames
The game features three mini-games for earning coins and XP:

1. **Quick Catch**:
   - Test reflexes by clicking on your pet when it appears in random locations
   - 30-second time limit with score based on successful clicks
   - Features pet-specific SVG graphics based on the player's chosen pet

2. **Memory Match**:
   - Match pairs of cards with pet-related items
   - 60-second time limit with bonus points for efficiency
   - Includes SVG icons representing different pet items

3. **Balloon Pop**:
   - Pop colorful balloons as they float up the screen
   - Different colored balloons have different point values
   - 30-second time limit with animated balloon popping effects

### Shop System
The shop offers various items for purchase using in-game coins:
- Food items (Basic Food, Premium Food, Treats)
- Toys (Toy Ball)
- Health items (Medicine, Energy Drink, Grooming Kit)
- Special items (Training Book, Luxury Bed)

### Inventory System
- Players can purchase and store items for later use
- Items are stored with their quantities
- Using items from inventory applies their effects immediately
- The inventory persists between game sessions

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

### Notification System
- **Event Notifications**: Pop-up messages for important events
- **Fading Animation**: Notifications appear and fade out automatically
- **Color Coding**: Different types of notifications (info, error)

## Game Progression

### Pet Development
- **Aging**: Pet age increases over time (1 day per 10 minutes of real time)
- **Leveling**: XP requirements increase with each level
- **Stat Management**: Becomes more challenging as the pet ages

### Economy Progression
- **Starting Balance**: Players begin with 50 coins
- **Earning Coins**: Primarily through mini-games
- **Item Costs**: Range from 10 coins (Basic Food) to 60 coins (Luxury Bed)

## Technical Features

### Save System
- **Automatic Saving**: Game state saves automatically every 30 seconds
- **Local Storage**: Uses browser localStorage to persist game data
- **Save Data**: Includes pet stats, inventory items, and coins

### Game Over Conditions
- **Health Threshold**: Game over when pet health reaches zero
- **Reset Option**: Players can start a new game after a game over

## Game Design Considerations

### User Experience Flow
1. **Initial Welcome Screen**: Select pet type and name
2. **Main Game Screen**: Care for pet and monitor stats
3. **Shop Screen**: Purchase items using coins
4. **Inventory Screen**: Manage and use owned items
5. **Mini-games Screen**: Select and play games to earn rewards

### Visual Design
- **Pet Visuals**: Simple, charming SVG-based pet designs with pet-specific features
- **Color Scheme**: Bright, friendly colors with stat-specific color coding
- **Responsive Design**: Interface adapts to different screen sizes

### Code Structure
- **Modular Architecture**: Separate classes for different game systems
- **GameManager**: Central controller coordinating all game systems
- **Event-Based Interactions**: UI events trigger appropriate game actions
- **SVG Rendering**: Dynamic SVG creation for all pet animations

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

### State Management
- **Object-Oriented Design**: Each game system maintains its own state
- **Central Coordination**: GameManager oversees integration between systems
- **Persistent Storage**: Regular saving of game state to localStorage

## Future Enhancement Opportunities
- Pet accessories for customization
- Additional pet types with unique abilities
- Habitat customization options
- Pet interaction features
- Achievement system for milestones
- Seasonal events with special rewards
- Advanced pet skills system
- Social features for sharing and competition

This virtual pet game provides an engaging, casual experience that rewards regular interaction and strategic resource management while creating an emotional connection with the virtual pet.

