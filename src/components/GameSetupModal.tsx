import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPuzzleTopics, getTimeLimitForDifficulty } from '@/utils/gameUtils';

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: GameSettings) => void;
  isSinglePlayer: boolean;
}

export interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  playerName: string;
  isSinglePlayer: boolean;
}

export const GameSetupModal = ({ isOpen, onClose, onConfirm, isSinglePlayer }: GameSetupModalProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedTopic, setSelectedTopic] = useState('animals');
  
  const topics = getPuzzleTopics();
  const timeLimit = getTimeLimitForDifficulty(difficulty);

  const handleConfirm = () => {
    onConfirm({
      difficulty,
      topic: selectedTopic,
      playerName: '', // Will be generated randomly
      isSinglePlayer
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card grain border-0 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-aurora-teal to-aurora-purple bg-clip-text text-transparent">
            {isSinglePlayer ? 'Single Player Setup' : 'Multiplayer Setup'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Difficulty Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Choose Difficulty</h3>
            <div className="flex gap-2 justify-center">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  onClick={() => setDifficulty(diff)}
                  className={`
                    capitalize px-6 py-3 transition-all duration-300
                    ${difficulty === diff 
                      ? 'bg-aurora-flow text-background shadow-intense' 
                      : 'glass-card hover:shadow-aurora'
                    }
                  `}
                >
                  {diff}
                  <Badge variant="secondary" className="ml-2 bg-aurora-subtle">
                    {Math.floor(getTimeLimitForDifficulty(diff) / 60)}min
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Select Puzzle Topic</h3>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((topic) => (
                <Card
                  key={topic.id}
                  className={`
                    cursor-pointer transition-all duration-300 hover:scale-105
                    ${selectedTopic === topic.id 
                      ? 'glass-card shadow-intense border-aurora-teal' 
                      : 'glass-card hover:shadow-aurora'
                    }
                  `}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2 animate-pulse-glow">{topic.emoji}</div>
                    <h4 className="font-semibold">{topic.name}</h4>
                    {selectedTopic === topic.id && (
                      <Badge className="mt-2 bg-game-success text-background">
                        ✓ Selected
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="glass-card p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Time Limit: {Math.floor(timeLimit / 60)} minutes</span>
              <span>Grid Size: 10x10</span>
              <span>Mode: {isSinglePlayer ? 'Single Player' : 'Multiplayer'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 glass-card"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-aurora-flow hover:shadow-intense transition-all duration-300"
            >
              {isSinglePlayer ? 'Start Game' : 'Create Room'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};