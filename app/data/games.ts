export interface Game {
  id: string;
  title: string;
  description: string;
  path: string;
}

export const games: Game[] = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game. Eat food to grow longer, but\'t hit the walls or yourself.',
    path: '/snake'
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    description: 'Defend Earth from waves of descending alien invaders.',
    path: '/space-invaders'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Stack falling blocks to complete rows and clear the board.',
    path: '/tetris'
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break all the bricks by bouncing a ball with your paddle.',
    path: '/breakout'
  },
  {
    id: '2048',
    title: '2048',
    description: 'Slide tiles to merge and reach 2048.',
    path: '/2048'
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Reveal safe tiles and flag mines.',
    path: '/minesweeper'
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Tap to flap and pass through pipes.',
    path: '/flappy-bird'
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Match pairs of cards in a race against time.',
    path: '/memory'
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 with a simple AI.',
    path: '/tic-tac-toe'
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Two-player paddle game with ball physics.',
    path: '/pong'
  },
  {
    id: 'simon',
    title: 'Simon Says',
    description: 'Repeat the color/sound sequence.',
    path: '/simon'
  },
  {
    id: 'wordle',
    title: 'Wordle Clone',
    description: 'Guess the word with color feedback.',
    path: '/wordle'
  },
  {
    id: 'asteroids',
    title: 'Asteroids',
    description: 'Pilot a ship and blast space rocks.',
    path: '/asteroids'
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Drop discs to connect four in a row.',
    path: '/connect-four'
  }
];
