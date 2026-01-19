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
    description: 'Classic snake game. Eat food to grow longer, but don\'t hit the walls or yourself.',
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
  }
];
