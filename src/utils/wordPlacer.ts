// Advanced word placement algorithm for 10x10 grid

export interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  cells: { row: number; col: number }[];
}

export interface GameGrid {
  grid: string[][];
  placedWords: PlacedWord[];
}

export const createGameGrid = (words: string[], gridSize: number = 10): GameGrid => {
  // Initialize empty grid
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const placedWords: PlacedWord[] = [];
  
  // Shuffle words to place larger ones first
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  for (const word of sortedWords) {
    const placement = findPlacement(grid, word, gridSize);
    if (placement) {
      placeWord(grid, word, placement);
      placedWords.push({
        word,
        startRow: placement.row,
        startCol: placement.col,
        direction: placement.direction,
        cells: placement.cells
      });
    }
  }
  
  // Fill empty cells with random letters
  fillEmptyCells(grid, gridSize);
  
  return { grid, placedWords };
};

interface WordPlacement {
  row: number;
  col: number;
  direction: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
  cells: { row: number; col: number }[];
}

const findPlacement = (grid: string[][], word: string, gridSize: number): WordPlacement | null => {
  const directions: Array<{
    name: 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up';
    deltaRow: number;
    deltaCol: number;
  }> = [
    { name: 'horizontal', deltaRow: 0, deltaCol: 1 },
    { name: 'vertical', deltaRow: 1, deltaCol: 0 },
    { name: 'diagonal-down', deltaRow: 1, deltaCol: 1 },
    { name: 'diagonal-up', deltaRow: -1, deltaCol: 1 }
  ];
  
  // Try random positions and directions
  const attempts = 1000;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const startRow = Math.floor(Math.random() * gridSize);
    const startCol = Math.floor(Math.random() * gridSize);
    
    const cells: { row: number; col: number }[] = [];
    let canPlace = true;
    
    // Check if word fits and doesn't conflict
    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * direction.deltaRow;
      const col = startCol + i * direction.deltaCol;
      
      // Check bounds
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        canPlace = false;
        break;
      }
      
      // Check if cell is empty or has the same letter
      if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
        canPlace = false;
        break;
      }
      
      cells.push({ row, col });
    }
    
    if (canPlace) {
      return {
        row: startRow,
        col: startCol,
        direction: direction.name,
        cells
      };
    }
  }
  
  return null;
};

const placeWord = (grid: string[][], word: string, placement: WordPlacement): void => {
  for (let i = 0; i < word.length; i++) {
    const cell = placement.cells[i];
    grid[cell.row][cell.col] = word[i];
  }
};

const fillEmptyCells = (grid: string[][], gridSize: number): void => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const vowels = 'AEIOU';
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] === '') {
        // Add some strategy to letter placement
        // Use more vowels to make it look more natural
        const useVowel = Math.random() < 0.3;
        const letterSet = useVowel ? vowels : consonants;
        grid[row][col] = letterSet[Math.floor(Math.random() * letterSet.length)];
      }
    }
  }
};

export const validateWordSelection = (
  selectedCells: { row: number; col: number }[],
  grid: string[][],
  placedWords: PlacedWord[]
): { isValid: boolean; word?: string; placedWord?: PlacedWord } => {
  if (selectedCells.length < 2) {
    return { isValid: false };
  }
  
  // Check if selection forms a straight line
  if (!isValidLine(selectedCells)) {
    return { isValid: false };
  }
  
  // Get the word from selection
  const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
  
  // Check if this matches any placed word
  for (const placedWord of placedWords) {
    if (placedWord.word === selectedWord.toUpperCase()) {
      // Check if selection matches the placed word exactly
      if (cellsMatch(selectedCells, placedWord.cells) || 
          cellsMatch(selectedCells, [...placedWord.cells].reverse())) {
        return {
          isValid: true,
          word: placedWord.word,
          placedWord
        };
      }
    }
  }
  
  return { isValid: false };
};

const isValidLine = (cells: { row: number; col: number }[]): boolean => {
  if (cells.length < 2) return false;
  
  const first = cells[0];
  const second = cells[1];
  
  const deltaRow = second.row - first.row;
  const deltaCol = second.col - first.col;
  
  // Normalize direction
  const normalizedDeltaRow = deltaRow === 0 ? 0 : deltaRow / Math.abs(deltaRow);
  const normalizedDeltaCol = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);
  
  // Check if all cells follow the same direction
  for (let i = 1; i < cells.length; i++) {
    const expectedRow = first.row + i * normalizedDeltaRow;
    const expectedCol = first.col + i * normalizedDeltaCol;
    
    if (cells[i].row !== expectedRow || cells[i].col !== expectedCol) {
      return false;
    }
  }
  
  return true;
};

const cellsMatch = (cells1: { row: number; col: number }[], cells2: { row: number; col: number }[]): boolean => {
  if (cells1.length !== cells2.length) return false;
  
  return cells1.every((cell, index) => 
    cell.row === cells2[index].row && cell.col === cells2[index].col
  );
};