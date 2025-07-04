// Game utility functions for Word Clash

export const generateGameCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateWordGrid = (size: number = 10): string[][] => {
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

export const generateRandomPlayerName = (): string => {
  const adjectives = [
    'Swift', 'Clever', 'Brave', 'Mighty', 'Silent', 'Golden', 'Shadow', 'Crystal',
    'Storm', 'Flame', 'Frost', 'Thunder', 'Lightning', 'Cosmic', 'Mystic', 'Royal'
  ];
  
  const animals = [
    'Wolf', 'Eagle', 'Tiger', 'Dragon', 'Phoenix', 'Falcon', 'Panther', 'Lion',
    'Shark', 'Hawk', 'Fox', 'Bear', 'Raven', 'Cobra', 'Jaguar', 'Octopus'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${animal}${number}`;
};

export const getRandomCharacterEmoji = (): string => {
  const characters = ['🐙', '🐌', '🦄', '🐸', '🦊', '🐺', '🦁', '🐯', '🐨', '🐼', '🦝', '🦉', '🐧', '🦅', '🐳', '🦈'];
  return characters[Math.floor(Math.random() * characters.length)];
};

export const getPuzzleTopics = () => {
  return [
    {
      id: 'animals',
      name: 'Animals',
      emoji: '🐾',
      words: {
        easy: ['CAT', 'DOG', 'BIRD', 'FISH', 'FROG', 'BEAR', 'LION', 'DUCK'],
        medium: ['TIGER', 'ELEPHANT', 'DOLPHIN', 'PENGUIN', 'RABBIT', 'MONKEY', 'GIRAFFE', 'TURTLE'],
        hard: ['BUTTERFLY', 'CROCODILE', 'FLAMINGO', 'RHINOCEROS', 'KANGAROO', 'CHIMPANZEE', 'HIPPOPOTAMUS', 'OCTOPUS']
      }
    },
    {
      id: 'space',
      name: 'Space',
      emoji: '🚀',
      words: {
        easy: ['STAR', 'MOON', 'SUN', 'MARS', 'EARTH', 'SPACE', 'COMET', 'ORBIT'],
        medium: ['PLANET', 'GALAXY', 'ROCKET', 'SATURN', 'JUPITER', 'METEOR', 'NEBULA', 'COSMOS'],
        hard: ['TELESCOPE', 'ASTRONAUT', 'CONSTELLATION', 'SPACECRAFT', 'ASTEROID', 'BLACKHOLE', 'SUPERNOVA', 'ATMOSPHERE']
      }
    },
    {
      id: 'food',
      name: 'Food',
      emoji: '🍕',
      words: {
        easy: ['PIZZA', 'BREAD', 'APPLE', 'CAKE', 'MILK', 'RICE', 'MEAT', 'EGG'],
        medium: ['BURGER', 'PASTA', 'CHEESE', 'BANANA', 'ORANGE', 'CHICKEN', 'SALMON', 'COOKIE'],
        hard: ['SPAGHETTI', 'SANDWICH', 'CHOCOLATE', 'STRAWBERRY', 'BLUEBERRY', 'HAMBURGER', 'PINEAPPLE', 'WATERMELON']
      }
    },
    {
      id: 'sports',
      name: 'Sports',
      emoji: '⚽',
      words: {
        easy: ['BALL', 'GOAL', 'GAME', 'TEAM', 'WIN', 'RUN', 'JUMP', 'PLAY'],
        medium: ['SOCCER', 'TENNIS', 'HOCKEY', 'BOXING', 'GOLF', 'RUGBY', 'TRACK', 'FIELD'],
        hard: ['BASKETBALL', 'FOOTBALL', 'BASEBALL', 'SWIMMING', 'VOLLEYBALL', 'BADMINTON', 'WRESTLING', 'MARATHON']
      }
    }
  ];
};

export const getTimeLimitForDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  const timeLimits = {
    easy: 300,    // 5 minutes
    medium: 900,  // 15 minutes
    hard: 1500    // 25 minutes
  };
  
  return timeLimits[difficulty];
};