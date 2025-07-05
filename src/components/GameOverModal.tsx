import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  score: number;
  totalWords: number;
  timeElapsed: number;
  isSinglePlayer: boolean;
}

export const GameOverModal = ({ 
  isOpen, 
  onClose, 
  onPlayAgain, 
  score, 
  totalWords, 
  timeElapsed,
  isSinglePlayer 
}: GameOverModalProps) => {
  const [hasRated, setHasRated] = useState(false);
  
  // Calculate performance rating (1-5 stars) - Fixed NaN bug
  const wordsFound = Math.floor((score || 0) / 10);
  const totalWordsCount = totalWords || 1; // Prevent division by zero
  const completionRate = (wordsFound / totalWordsCount) * 100;
  
  let rating = 1;
  let message = "Keep trying! Every puzzle makes you smarter! 🧠";
  
  if (completionRate >= 90) {
    rating = 5;
    message = "INCREDIBLE! You're a word-finding legend! 🏆";
  } else if (completionRate >= 70) {
    rating = 4;
    message = "Outstanding work! You're really getting the hang of this! ⭐";
  } else if (completionRate >= 50) {
    rating = 3;
    message = "Great job! You're improving with every game! 🎯";
  } else if (completionRate >= 25) {
    rating = 2;
    message = "Nice effort! Practice makes perfect! 💪";
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card grain border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-lovable-blue to-lovable-coral bg-clip-text text-transparent">
            🎉 Game Complete!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          {/* Performance Stars */}
          <div className="space-y-3">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 transition-all duration-300 ${
                    star <= rating 
                      ? 'text-aurora-pink fill-aurora-pink animate-pulse-glow' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <p className="text-lg font-medium text-lovable-coral">
              {message}
            </p>
          </div>

          {/* Game Stats */}
          <div className="glass-card p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-lovable-coral">{score || 0}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-lovable-blue">{wordsFound}</div>
                <div className="text-sm text-muted-foreground">Words Found</div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between text-sm">
                <span>Time: {formatTime(timeElapsed)}</span>
                <span>Completion: {Math.round(completionRate)}%</span>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          {rating >= 4 && (
            <Badge className="bg-gradient-to-r from-lovable-blue to-lovable-coral text-background text-lg px-4 py-2 animate-pulse-glow">
              🏆 High Achiever!
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 glass-card"
            >
              Main Menu
            </Button>
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-lovable-flow hover:shadow-intense transition-all duration-300"
            >
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};