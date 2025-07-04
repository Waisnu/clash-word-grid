// Game utility functions for Word Clash

export const generateGameCode = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const generateWordGrid = (size: number = 5): string[][] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const grid: string[][] = [];
  
  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      row.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    grid.push(row);
  }
  
  return grid;
};

export const generateWordList = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): string[] => {
  const wordLists = {
    easy: ['CAT', 'DOG', 'RUN', 'SUN', 'TOP', 'BAG', 'CUP', 'HAT'],
    medium: ['DREAM', 'QUICK', 'STORM', 'HEART', 'MAGIC', 'POWER', 'DANCE', 'BRAVE'],
    hard: ['JOURNEY', 'MYSTERY', 'VICTORY', 'FREEDOM', 'ANCIENT', 'COURAGE', 'HARMONY', 'DESTINY']
  };
  
  return wordLists[difficulty];
};

export const validateWordSelection = (
  selectedCells: { row: number; col: number }[],
  grid: string[][],
  wordList: string[]
): { isValid: boolean; word?: string } => {
  if (selectedCells.length < 2) {
    return { isValid: false };
  }
  
  const word = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
  const isValidWord = wordList.includes(word.toUpperCase());
  
  return {
    isValid: isValidWord,
    word: isValidWord ? word.toUpperCase() : undefined
  };
};

export const checkDirection = (
  selectedCells: { row: number; col: number }[]
): 'horizontal' | 'vertical' | 'diagonal' | 'invalid' => {
  if (selectedCells.length < 2) return 'invalid';
  
  const firstCell = selectedCells[0];
  const lastCell = selectedCells[selectedCells.length - 1];
  
  const rowDiff = Math.abs(lastCell.row - firstCell.row);
  const colDiff = Math.abs(lastCell.col - firstCell.col);
  
  if (rowDiff === 0) return 'horizontal';
  if (colDiff === 0) return 'vertical';
  if (rowDiff === colDiff) return 'diagonal';
  
  return 'invalid';
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateScore = (
  word: string,
  timeBonus: number = 0,
  difficultyMultiplier: number = 1
): number => {
  const baseScore = word.length * 10;
  const bonus = timeBonus > 0 ? Math.floor(timeBonus / 10) : 0;
  return Math.floor((baseScore + bonus) * difficultyMultiplier);
};

export const getPlayerColor = (playerIndex: number): string => {
  const colors = [
    'hsl(var(--game-player-1))',
    'hsl(var(--game-player-2))',
    'hsl(var(--game-player-3))',
    'hsl(var(--game-player-4))'
  ];
  
  return colors[playerIndex % colors.length];
};