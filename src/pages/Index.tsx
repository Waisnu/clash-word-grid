import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateGameModal } from '@/components/CreateGameModal';
import { GameLobby } from '@/components/GameLobby';
import { GameBoard } from '@/components/GameBoard';

type GameState = 'home' | 'creating' | 'lobby' | 'playing' | 'results';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [gameCode, setGameCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateGame = (name: string) => {
    setPlayerName(name);
    // Generate random 4-letter code
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setGameCode(code);
    setGameState('lobby');
    setIsCreateModalOpen(false);
  };

  const handleJoinGame = () => {
    if (joinCode.length === 4 && playerName) {
      setGameCode(joinCode);
      setGameState('lobby');
    }
  };

  const handleStartGame = () => {
    setGameState('playing');
  };

  const renderAuroraBackground = () => (
    <>
      {/* Main aurora background */}
      <div className="fixed inset-0 bg-aurora-bg" />
      
      {/* Animated aurora layers */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-aurora-flow rounded-full opacity-20 animate-aurora-flow" />
        <div className="absolute top-20 -right-20 w-60 h-60 bg-gradient-to-br from-aurora-purple to-aurora-pink rounded-full opacity-15 animate-pulse-glow" />
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-gradient-to-tr from-aurora-teal to-aurora-blue rounded-full opacity-10 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-aurora-subtle rounded-full opacity-25 animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>
    </>
  );

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen relative">
        {renderAuroraBackground()}
        <GameBoard 
          gameCode={gameCode} 
          playerName={playerName}
          onGameEnd={() => setGameState('results')}
        />
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen relative">
        {renderAuroraBackground()}
        <GameLobby 
          gameCode={gameCode} 
          playerName={playerName}
          onStartGame={handleStartGame}
          onLeaveGame={() => setGameState('home')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {renderAuroraBackground()}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo and title */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-full bg-aurora-subtle backdrop-blur-sm animate-pulse-glow">
            <div className="w-16 h-16 bg-aurora-flow rounded-full" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-aurora-teal via-aurora-purple to-aurora-pink bg-clip-text text-transparent">
              Word Clash
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-time multiplayer word search battle
            </p>
          </div>
        </div>

        {/* Game actions */}
        <div className="space-y-4">
          {/* Create Game */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
            <CardHeader>
              <CardTitle className="text-center">Start a New Game</CardTitle>
              <CardDescription className="text-center">
                Create a room and invite friends to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full bg-aurora-flow hover:shadow-intense transition-all duration-300"
                size="lg"
              >
                Create Game
              </Button>
            </CardContent>
          </Card>

          {/* Join Game */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-aurora">
            <CardHeader>
              <CardTitle className="text-center">Join a Game</CardTitle>
              <CardDescription className="text-center">
                Enter a room code to join an existing game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-input/50 backdrop-blur-sm"
                />
                <Input
                  placeholder="Game code (e.g. ABCD)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
                  className="bg-input/50 backdrop-blur-sm text-center text-lg font-mono tracking-widest"
                />
              </div>
              <Button 
                onClick={handleJoinGame}
                disabled={!joinCode || joinCode.length !== 4 || !playerName}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                Join Game
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Compete to find words faster than your friends!</p>
        </div>
      </div>

      <CreateGameModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreateGame}
      />
    </div>
  );
};

export default Index;