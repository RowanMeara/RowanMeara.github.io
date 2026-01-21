# Flappy Bird Test Plan

## Issues Identified

1. **useEffect dependency problem**: The effect depends on `[playing, score]`, which means it re-runs every time score changes (60 times per second), resetting all game state
2. **State reset on every render**: `birdY`, `birdV`, and `pipes` are reset every time the effect runs
3. **No background visible**: Only drawing the bird and pipes, no background color

## Expected Behaviors

### On Page Load
- [ ] Canvas should render with a visible background (light blue sky)
- [ ] Bird should be visible in the center
- [ ] Game should NOT be playing (bird should not fall)
- [ ] Score should show 0

### When Game Starts (click or space)
- [ ] Bird should start falling due to gravity
- [ ] Pipes should start appearing from the right side
- [ ] Pipes should move from right to left
- [ ] Score should increment slowly over time

### During Gameplay
- [ ] Pressing space should make the bird jump (velocity becomes negative)
- [ ] Bird should have smooth movement (gravity acceleration)
- [ ] Pipes should continue spawning at regular intervals
- [ ] Bird position should update continuously
- [ ] Collision detection should work for:
  - [ ] Ground (bottom of canvas)
  - [ ] Ceiling (top of canvas)
  - [ ] Pipe upper section
  - [ ] Pipe lower section

### When Collision Occurs
- [ ] Game should stop (playing = false)
- [ ] Bird should remain visible at collision point
- [ ] Best score should update if current score > best
- [ ] Can restart by clicking canvas

### Visual Elements
- [ ] Background: Light blue color
- [ ] Bird: Orange circle, radius 12, centered horizontally
- [ ] Pipes: Green rectangles, 60px wide
- [ ] Gap: 120px between upper and lower pipe sections

## Test Cases

### TC1: Initial Render
- Load page
- Expect: Bird visible, no pipes, game not playing

### TC2: Start Game
- Click canvas
- Expect: Bird starts falling, pipes start spawning

### TC3: Flap Mechanic
- Start game
- Press space multiple times
- Expect: Bird jumps upward each time, then falls due to gravity

### TC4: Pipe Collision
- Start game
- Wait for bird to hit a pipe
- Expect: Game stops, can restart

### TC5: Ground Collision
- Start game
- Don't press space
- Expect: Bird hits ground, game stops

### TC6: Continuous Play
- Start game
- Navigate through multiple pipes successfully
- Expect: Score increases, game continues smoothly

## Required Fixes

1. Remove `score` from useEffect dependencies
2. Use refs for game state that needs to persist (birdY, birdV, pipes)
3. Add background color to canvas
4. Ensure game loop only runs when playing
5. Fix the reset function to properly reinitialize game state
