import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (playerName: string) => void;
}

export const CreateGameModal = ({ isOpen, onClose, onConfirm }: CreateGameModalProps) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onConfirm(playerName.trim());
      setPlayerName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card/95 backdrop-blur-sm border-border/50 shadow-intense">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-aurora-teal to-aurora-purple bg-clip-text text-transparent">
            Create New Game
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose your player name to start a new Word Clash game
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Player Name</Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-input/50 backdrop-blur-sm"
              autoFocus
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!playerName.trim()}
              className="flex-1 bg-aurora-flow hover:shadow-intense transition-all duration-300"
            >
              Create Game
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};