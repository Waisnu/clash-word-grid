import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

interface GameLobbyProps {
  gameCode: string;
  playerName: string;
  onStartGame: () => void;
  onLeaveGame: () => void;
}

export const GameLobby = ({ gameCode, playerName, onStartGame, onLeaveGame }: GameLobbyProps) => {
  // Mock players data - in real implementation this would come from real-time backend
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: playerName, isHost: true }
  ]);
  
  // Simulate other players joining
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayers(prev => [
        ...prev,
        { id: '2', name: 'Player 2', isHost: false }
      ]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const isHost = players.find(p => p.name === playerName)?.isHost || false;
  const canStart = players.length >= 2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Game Code Display */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
          <CardHeader className="text-center">
            <CardTitle>Game Room</CardTitle>
            <div className="space-y-2">
              <p className="text-muted-foreground">Share this code with friends:</p>
              <div className="inline-block p-4 bg-aurora-subtle rounded-lg">
                <span className="text-3xl font-mono font-bold tracking-[0.5em] bg-gradient-to-r from-aurora-teal to-aurora-purple bg-clip-text text-transparent">
                  {gameCode}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Players List */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Players ({players.length})
              <Badge variant="secondary" className="bg-aurora-subtle">
                {canStart ? 'Ready' : 'Waiting'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div 
                  key={player.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ 
                        backgroundColor: `hsl(var(--game-player-${(index % 4) + 1}))`,
                        color: 'hsl(var(--background))'
                      }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  {player.isHost && (
                    <Badge variant="outline" className="border-aurora-teal text-aurora-teal">
                      Host
                    </Badge>
                  )}
                </div>
              ))}
              
              {/* Waiting slots */}
              {Array.from({ length: Math.max(0, 4 - players.length) }).map((_, index) => (
                <div 
                  key={`waiting-${index}`}
                  className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-muted-foreground/30"
                >
                  <div className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-muted-foreground">?</span>
                  </div>
                  <span className="text-muted-foreground italic">Waiting for player...</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Instructions */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Find words by selecting letters on the grid</li>
              <li>• Words can be horizontal, vertical, or diagonal</li>
              <li>• First to find a word gets the points</li>
              <li>• Game ends when timer runs out</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onLeaveGame}
            className="flex-1"
          >
            Leave Game
          </Button>
          
          {isHost && (
            <Button
              onClick={onStartGame}
              disabled={!canStart}
              className="flex-1 bg-aurora-flow hover:shadow-intense transition-all duration-300"
              size="lg"
            >
              {canStart ? 'Start Game' : `Need ${2 - players.length} more player${2 - players.length !== 1 ? 's' : ''}`}
            </Button>
          )}
        </div>

        {!isHost && (
          <div className="text-center">
            <p className="text-muted-foreground">Waiting for host to start the game...</p>
            <div className="mt-2 flex justify-center">
              <div className="animate-pulse-glow">
                <div className="w-2 h-2 bg-aurora-teal rounded-full mx-1 inline-block" />
                <div className="w-2 h-2 bg-aurora-purple rounded-full mx-1 inline-block" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-aurora-pink rounded-full mx-1 inline-block" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};