import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
  onGameEnd: () => void;
}

// Mock game data
const GAME_GRID = [
  ['C', 'A', 'T', 'S', 'D'],
  ['O', 'R', 'A', 'N', 'O'],
  ['D', 'E', 'A', 'M', 'G'],
  ['E', 'L', 'P', 'P', 'A'],
  ['R', 'U', 'N', 'S', 'T']
];

const WORDS_TO_FIND = [
  'CAT', 'DOG', 'RUN', 'DREAM', 'CODE', 'TEAM', 'STAR', 'GAME'
];

export const GameBoard = ({ gameCode, playerName, onGameEnd }: GameBoardProps) => {
  const [players] = useState<Player[]>([
    { id: '1', name: playerName, score: 0, color: 'hsl(var(--game-player-1))' },
    { id: '2', name: 'Player 2', score: 0, color: 'hsl(var(--game-player-2))' }
  ]);
  
  const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
  const [timeLeft, setTimeLeft] = useState(90); // 90 seconds
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [currentWord, setCurrentWord] = useState('');

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onGameEnd();
    }
  }, [timeLeft, onGameEnd]);

  // Handle mouse down on grid cell
  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
    setCurrentWord(GAME_GRID[row][col]);
  }, []);

  // Handle mouse enter on grid cell
  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (isSelecting) {
      const newSelection = [...selectedCells, { row, col }];
      setSelectedCells(newSelection);
      setCurrentWord(newSelection.map(cell => GAME_GRID[cell.row][cell.col]).join(''));
    }
  }, [isSelecting, selectedCells]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isSelecting && currentWord.length > 2) {
      // Check if word is in the list and not already found
      const wordToCheck = currentWord.toUpperCase();
      if (WORDS_TO_FIND.includes(wordToCheck) && !foundWords.some(fw => fw.word === wordToCheck)) {
        // Word found!
        const newFoundWord: FoundWord = {
          word: wordToCheck,
          playerId: '1',
          playerName: playerName
        };
        setFoundWords(prev => [...prev, newFoundWord]);
        
        // Animate the found word
        selectedCells.forEach(cell => {
          const cellElement = document.querySelector(`[data-cell="${cell.row}-${cell.col}"]`);
          if (cellElement) {
            cellElement.classList.add('animate-word-found');
          }
        });
      }
    }
    
    setIsSelecting(false);
    setSelectedCells([]);
    setCurrentWord('');
  }, [isSelecting, currentWord, foundWords, selectedCells, playerName]);

  // Check if cell is selected
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Check if word is found
  const isWordFound = (word: string) => {
    return foundWords.some(fw => fw.word === word);
  };

  // Get player score
  const getPlayerScore = (playerId: string) => {
    return foundWords.filter(fw => fw.playerId === playerId).length * 10;
  };

  const timeProgress = (timeLeft / 90) * 100;

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
                  className="grid grid-cols-5 gap-2 max-w-md mx-auto select-none"
                  onMouseLeave={handleMouseUp}
                >
                  {GAME_GRID.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        data-cell={`${rowIndex}-${colIndex}`}
                        className={`
                          w-12 h-12 bg-muted/50 backdrop-blur-sm border border-border/50 
                          rounded-lg flex items-center justify-center text-xl font-bold
                          cursor-pointer transition-all duration-200 hover:scale-105
                          ${isCellSelected(rowIndex, colIndex) 
                            ? 'bg-aurora-flow text-background shadow-aurora scale-105' 
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
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Scoreboard */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
              <CardHeader>
                <CardTitle>Scoreboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ 
                          backgroundColor: player.color,
                          color: 'hsl(var(--background))'
                        }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-aurora-subtle">
                      {getPlayerScore(player.id)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Words to Find */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
              <CardHeader>
                <CardTitle>Words to Find ({WORDS_TO_FIND.length - foundWords.length} left)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {WORDS_TO_FIND.map((word) => {
                    const found = foundWords.find(fw => fw.word === word);
                    return (
                      <div
                        key={word}
                        className={`
                          p-2 rounded text-center text-sm font-medium transition-all duration-300
                          ${found 
                            ? 'bg-game-success/20 text-game-success line-through' 
                            : 'bg-muted/50 text-foreground'
                          }
                        `}
                      >
                        {word}
                        {found && (
                          <div className="text-xs text-muted-foreground mt-1">
                            by {found.playerName}
                          </div>
                        )}
                      </div>
                    );
                  })}
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