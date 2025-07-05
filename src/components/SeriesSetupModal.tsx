import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target } from 'lucide-react';
import { getPuzzleTopics } from '@/utils/gameUtils';

interface SeriesSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (settings: SeriesSettings) => void;
  isSinglePlayer: boolean;
}

export interface SeriesSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  playerName: string;
  isSinglePlayer: boolean;
  seriesLength: 3 | 5;
  wordsPerGame: number;
}

export const SeriesSetupModal = ({ isOpen, onClose, onConfirm, isSinglePlayer }: SeriesSetupModalProps) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedTopic, setSelectedTopic] = useState('animals');
  const [seriesLength, setSeriesLength] = useState<3 | 5>(3);
  const [wordsPerGame, setWordsPerGame] = useState(12);
  
  const topics = getPuzzleTopics();

  const difficultySettings = {
    easy: { time: '5 min', words: '8-12', color: 'from-green-400 to-green-600' },
    medium: { time: '15 min', words: '12-16', color: 'from-yellow-400 to-orange-500' },
    hard: { time: '25 min', words: '16-20', color: 'from-red-400 to-pink-600' }
  };

  const handleConfirm = () => {
    onConfirm({
      difficulty,
      topic: selectedTopic,
      playerName: '',
      isSinglePlayer,
      seriesLength,
      wordsPerGame
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card grain border-0 max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-lovable-blue to-lovable-coral bg-clip-text text-transparent flex items-center justify-center gap-3">
            <Trophy className="w-6 h-6 text-lovable-coral" />
            {isSinglePlayer ? 'Single Player Series' : 'Multiplayer Series'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Series Length Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              Series Format
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[3, 5].map((length) => (
                <Card 
                  key={length}
                  className={`cursor-pointer transition-all duration-300 ${
                    seriesLength === length 
                      ? 'ring-2 ring-lovable-coral shadow-intense bg-lovable-flow/10' 
                      : 'glass-card hover:shadow-lovable'
                  }`}
                  onClick={() => setSeriesLength(length as 3 | 5)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-lovable-coral mb-2">
                      Best of {length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {length === 3 ? 'Quick Series' : 'Championship'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Choose Difficulty</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(difficultySettings).map(([level, settings]) => (
                <Card 
                  key={level}
                  className={`cursor-pointer transition-all duration-300 ${
                    difficulty === level 
                      ? 'ring-2 ring-lovable-coral shadow-intense' 
                      : 'glass-card hover:shadow-lovable'
                  }`}
                  onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`text-lg font-bold bg-gradient-to-r ${settings.color} bg-clip-text text-transparent mb-2`}>
                      {level.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>⏱️ {settings.time}</div>
                      <div>📝 {settings.words} words</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Select Topic</h3>
            <div className="grid grid-cols-2 gap-3">
              {topics.map((topic) => (
                <Card 
                  key={topic.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedTopic === topic.id 
                      ? 'ring-2 ring-lovable-coral shadow-intense bg-lovable-flow/10' 
                      : 'glass-card hover:shadow-lovable'
                  }`}
                  onClick={() => setSelectedTopic(topic.id)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-2">{topic.emoji}</div>
                    <div className="font-medium">{topic.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Words Per Game Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Words Per Game</h3>
            <div className="flex justify-center">
              <div className="flex gap-2">
                {[8, 12, 16, 20].map((count) => (
                  <Badge 
                    key={count}
                    variant={wordsPerGame === count ? "default" : "secondary"}
                    className={`cursor-pointer px-4 py-2 text-base transition-all duration-300 ${
                      wordsPerGame === count 
                        ? 'bg-lovable-flow hover:shadow-intense' 
                        : 'hover:shadow-lovable'
                    }`}
                    onClick={() => setWordsPerGame(count)}
                  >
                    {count} words
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            className="w-full bg-lovable-flow hover:shadow-intense transition-all duration-300 text-lg py-6"
            size="lg"
          >
            🏆 Start {isSinglePlayer ? 'Single Player' : 'Multiplayer'} Series
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};