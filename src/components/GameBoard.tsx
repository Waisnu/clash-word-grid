import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { createGameGrid, validateWordSelection, PlacedWord } from '@/utils/wordPlacer';
import { getWordsForDifficulty } from '@/utils/gameUtils';

interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface FoundWord {
  word: string;
  playerId: string;
  playerName: string;
}

interface GameBoardProps {
  gameCode: string;
  playerName: string;
  onGameEnd: (stats: { score: number; totalWords: number; timeElapsed: number }) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  timeLimit?: number;
  wordsCount?: number;
}

export const GameBoard = ({ 
  gameCode, 
  playerName, 
  onGameEnd,
  difficulty = 'medium',
  topic = 'animals',
  timeLimit = 900,
  wordsCount = 12
}: GameBoardProps) => {
  // Initialize game grid and words
  const [gameData] = useState(() => {
    const words = getWordsForDifficulty(topic, difficulty, wordsCount);
    return createGameGrid(words, 10);
  });
  
  const GAME_GRID = gameData.grid;
  const WORDS_TO_FIND = gameData.placedWords.map(w => w.word);
  const PLACED_WORDS = gameData.placedWords;
  const [players] = useState<Player[]>([
    { id: '1', name: playerName, score: 0, color: 'hsl(var(--game-player-1))' },
    { id: '2', name: 'Player 2', score: 0, color: 'hsl(var(--game-player-2))' }
  ]);
  
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(Date.now());

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      const score = foundWords.reduce((total, fw) => total + (fw.word.length * 10), 0);
      onGameEnd({
        score,
        totalWords: WORDS_TO_FIND.length,
        timeElapsed
      });
    }
  }, [timeLeft, onGameEnd, foundWords, startTime, WORDS_TO_FIND.length]);

  // Enhanced mouse handling for smooth word selection
  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
    setCurrentWord(GAME_GRID[row][col]);
  }, [GAME_GRID]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isSelecting) {
      // Create a smooth path from start to current position
      const startCell = selectedCells[0];
      if (startCell) {
        const path = createSmoothPath(startCell, { row, col });
        setSelectedCells(path);
        setCurrentWord(path.map(cell => GAME_GRID[cell.row][cell.col]).join(''));
      }
    }
  }, [isSelecting, selectedCells, GAME_GRID]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectedCells.length > 1) {
      const validation = validateWordSelection(selectedCells, GAME_GRID, PLACED_WORDS);
      
      if (validation.isValid && validation.word && !foundWords.some(fw => fw.word === validation.word)) {
        // Word found!
        const newFoundWord: FoundWord = {
          word: validation.word,
          playerId: '1',
          playerName: playerName
        };
        setFoundWords(prev => [...prev, newFoundWord]);
        
        // Update streak
        setStreak(prev => prev + 1);
        
        // Enhanced animations
        selectedCells.forEach((cell, index) => {
          setTimeout(() => {
            const cellElement = document.querySelector(`[data-cell="${cell.row}-${cell.col}"]`);
            if (cellElement) {
              cellElement.classList.add('animate-word-found');
              // Add streak effect if applicable
              if (streak >= 2) {
                setTimeout(() => cellElement.classList.add('animate-streak'), 300);
              }
            }
          }, index * 50);
        });
      } else {
        // Reset streak on invalid word
        setStreak(0);
      }
    }
    
    setIsSelecting(false);
    setSelectedCells([]);
    setCurrentWord('');
  }, [isSelecting, selectedCells, GAME_GRID, PLACED_WORDS, foundWords, playerName, streak]);

  // Create smooth path between two points
  const createSmoothPath = (start: { row: number; col: number }, end: { row: number; col: number }) => {
    const path: { row: number; col: number }[] = [start];
    
    const deltaRow = end.row - start.row;
    const deltaCol = end.col - start.col;
    
    // Determine if it's a valid direction
    if (deltaRow === 0) {
      // Horizontal
      const step = deltaCol > 0 ? 1 : -1;
      for (let col = start.col + step; col !== end.col + step; col += step) {
        path.push({ row: start.row, col });
      }
    } else if (deltaCol === 0) {
      // Vertical
      const step = deltaRow > 0 ? 1 : -1;
      for (let row = start.row + step; row !== end.row + step; row += step) {
        path.push({ row, col: start.col });
      }
    } else if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
      // Diagonal
      const rowStep = deltaRow > 0 ? 1 : -1;
      const colStep = deltaCol > 0 ? 1 : -1;
      const steps = Math.abs(deltaRow);
      
      for (let i = 1; i <= steps; i++) {
        path.push({
          row: start.row + i * rowStep,
          col: start.col + i * colStep
        });
      }
    } else {
      // Invalid direction, return just start and end
      if (end.row !== start.row || end.col !== start.col) {
        path.push(end);
      }
    }
    
    return path;
  };

  // Check if cell is selected
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Check if word is found
  const isWordFound = (word: string) => {
    return foundWords.some(fw => fw.word === word);
  };

  // Get player score with word length bonus
  const getPlayerScore = (playerId: string) => {
    return foundWords
      .filter(fw => fw.playerId === playerId)
      .reduce((total, fw) => total + (fw.word.length * 10), 0);
  };

  const timeProgress = (timeLeft / timeLimit) * 100;

  return (
    <div className="min-h-screen p-4">
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-aurora-teal to-aurora-purple bg-clip-text text-transparent">
              Word Clash
            </h2>
            <Badge variant="outline" className="border-aurora-teal text-aurora-teal">
              {gameCode}
            </Badge>
          </div>
          
          {/* Timer */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground">Time Left</div>
                </div>
                <Progress 
                  value={timeProgress} 
                  className="w-20 rotate-90 origin-center"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-grid-bg backdrop-blur-sm border-border/50 shadow-aurora">
              <CardHeader>
                <CardTitle className="text-center">Find the Words!</CardTitle>
                {currentWord && (
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      {currentWord}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div 
                  className="grid grid-cols-10 gap-1 max-w-2xl mx-auto select-none"
                  onMouseLeave={handleMouseUp}
                >
                  {GAME_GRID.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        data-cell={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 bg-muted/50 backdrop-blur-sm border border-border/50 
                          rounded-md flex items-center justify-center text-sm font-bold
                          cursor-pointer transition-all duration-200 hover:scale-110
                          ${isCellSelected(rowIndex, colIndex) 
                            ? 'bg-lovable-flow text-background shadow-lovable scale-110 z-10' 
                            : 'hover:bg-muted/70'
                          }
                        `}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                      >
                        {letter}
                      </div>
                    ))
                  )}
                </div>
                
                {/* Streak indicator */}
                {streak > 1 && (
                  <div className="text-center mt-4">
                    <Badge className="bg-gradient-to-r from-lovable-coral to-lovable-pink text-background animate-pulse-glow">
                      🔥 {streak}x Streak!
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Enhanced Scoreboard */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lovable">
              <CardHeader>
                <CardTitle className="text-center">Scoreboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
                        style={{ 
                          backgroundColor: player.color,
                          color: 'hsl(var(--background))'
                        }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {foundWords.filter(fw => fw.playerId === player.id).length} words
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-lovable-subtle text-lg px-3 py-1">
                      {getPlayerScore(player.id)}
                    </Badge>
                  </div>
                ))}
                
                {/* Game stats */}
                <div className="border-t border-border/50 pt-3 mt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lovable-coral">{foundWords.length}</div>
                      <div className="text-muted-foreground">Found</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lovable-blue">{WORDS_TO_FIND.length - foundWords.length}</div>
                      <div className="text-muted-foreground">Remaining</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Words to Find */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lovable">
              <CardHeader>
                <CardTitle className="text-center">
                  Words to Find
                  <div className="text-sm font-normal text-muted-foreground mt-1">
                    {WORDS_TO_FIND.length - foundWords.length} remaining
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                  {WORDS_TO_FIND.map((word) => {
                    const found = foundWords.find(fw => fw.word === word);
                    return (
                      <div
                        key={word}
                        className={`
                          p-3 rounded-lg text-center font-medium transition-all duration-500
                          ${found 
                            ? 'bg-gradient-to-r from-game-success/20 to-lovable-coral/20 text-game-success line-through scale-95' 
                            : 'bg-muted/50 text-foreground hover:bg-muted/70 cursor-default'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`${found ? 'line-through' : ''}`}>{word}</span>
                          {found && <span className="text-sm">✓</span>}
                        </div>
                        {found && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {word.length * 10} points • by {found.playerName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <Progress 
                    value={(foundWords.length / WORDS_TO_FIND.length) * 100} 
                    className="h-2"
                  />
                  <div className="text-center text-sm text-muted-foreground mt-2">
                    {Math.round((foundWords.length / WORDS_TO_FIND.length) * 100)}% Complete
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              onClick={onGameEnd}
              className="w-full"
            >
              End Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};