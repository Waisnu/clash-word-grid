import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameSetupModal, GameSettings } from '@/components/GameSetupModal';
import { GameLobby } from '@/components/GameLobby';
import { GameBoard } from '@/components/GameBoard';
import { GameOverModal } from '@/components/GameOverModal';
import { generateGameCode, generateRandomPlayerName } from '@/utils/gameUtils';
import { Play } from 'lucide-react';

type GameState = 'home' | 'setup' | 'lobby' | 'playing' | 'gameOver';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [gameCode, setGameCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupMode, setSetupMode] = useState<'single' | 'multi'>('multi');
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [gameStats, setGameStats] = useState({ score: 0, totalWords: 0, timeElapsed: 0 });

  const handleCreateGame = (isSinglePlayer: boolean) => {
    setSetupMode(isSinglePlayer ? 'single' : 'multi');
    setIsSetupModalOpen(true);
  };

  const handleGameSetup = (settings: GameSettings) => {
    const randomName = generateRandomPlayerName();
    setPlayerName(randomName);
    setGameSettings(settings);
    setIsSetupModalOpen(false);
    
    if (settings.isSinglePlayer) {
      setGameState('playing');
    } else {
      const code = generateGameCode();
      setGameCode(code);
      setGameState('lobby');
    }
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

  const handleGameEnd = (stats?: { score: number; totalWords: number; timeElapsed: number }) => {
    if (stats) {
      setGameStats(stats);
    }
    setGameState('gameOver');
    setIsGameOverModalOpen(true);
  };

  const handlePlayAgain = () => {
    setIsGameOverModalOpen(false);
    if (gameSettings?.isSinglePlayer) {
      setGameState('playing');
    } else {
      setGameState('lobby');
    }
  };

  const handleBackToHome = () => {
    setGameState('home');
    setGameCode('');
    setJoinCode('');
    setPlayerName('');
    setGameSettings(null);
    setIsGameOverModalOpen(false);
  };

  const renderEnhancedAuroraBackground = () => (
    <>
      {/* Main aurora background */}
      <div className="fixed inset-0 bg-aurora-bg grain" />
      
      {/* Animated aurora layers with enhanced effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-aurora-flow rounded-full opacity-20 animate-aurora-flow float-slow" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-gradient-to-br from-aurora-purple to-aurora-pink rounded-full opacity-15 pulse-aurora" />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-aurora-teal to-aurora-blue rounded-full opacity-10 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-aurora-subtle rounded-full opacity-25 pulse-aurora" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-aurora-pink to-aurora-purple rounded-full opacity-20 float-slow" style={{ animationDelay: '3s' }} />
      </div>
    </>
  );

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen relative">
        {renderEnhancedAuroraBackground()}
        <GameBoard 
          gameCode={gameCode} 
          playerName={playerName}
          onGameEnd={handleGameEnd}
        />
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen relative">
        {renderEnhancedAuroraBackground()}
        <GameLobby 
          gameCode={gameCode} 
          playerName={playerName}
          onStartGame={handleStartGame}
          onLeaveGame={handleBackToHome}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {renderEnhancedAuroraBackground()}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg space-y-8 animate-fade-in">
        {/* Enhanced Logo and title */}
        <div className="text-center space-y-6">
          <div className="inline-block p-6 rounded-full glass-card pulse-aurora">
            <div className="w-20 h-20 bg-aurora-flow rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-aurora-teal via-aurora-purple to-aurora-pink bg-clip-text text-transparent mb-4">
              Word Clash
            </h1>
            <p className="text-xl text-muted-foreground">
              Real-time multiplayer word search battle
            </p>
          </div>
        </div>

        {/* Enhanced Game actions */}
        <div className="space-y-4">
          {/* Start Game - Primary CTA */}
          <Card className="glass-card hover:shadow-intense transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-3">
                <Play className="w-6 h-6 text-aurora-teal" />
                START GAME
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleCreateGame(true)}
                className="w-full bg-aurora-flow hover:shadow-intense transition-all duration-300 text-lg py-6"
                size="lg"
              >
                🎯 Single Player
              </Button>
              <Button 
                onClick={() => handleCreateGame(false)}
                className="w-full bg-gradient-to-r from-aurora-purple to-aurora-pink hover:shadow-intense transition-all duration-300 text-lg py-6"
                size="lg"
              >
                👥 Create Multiplayer Room
              </Button>
            </CardContent>
          </Card>

          {/* Join Game */}
          <Card className="glass-card hover:shadow-aurora transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-center">Join a Game</CardTitle>
              <CardDescription className="text-center">
                Enter a room code to join an existing game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="glass-card border-aurora-teal/30 focus:border-aurora-teal"
                />
                <Input
                  placeholder="4-digit room code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.slice(0, 4))}
                  className="glass-card border-aurora-purple/30 focus:border-aurora-purple text-center text-xl font-mono tracking-widest"
                />
              </div>
              <Button 
                onClick={handleJoinGame}
                disabled={!joinCode || joinCode.length !== 4 || !playerName}
                variant="secondary"
                className="w-full glass-card hover:shadow-aurora transition-all duration-300"
                size="lg"
              >
                Join Game
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            🧩 Compete to find words faster than your friends!
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span>• 10x10 Grid</span>
            <span>• Real-time</span>
            <span>• Multiple Topics</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GameSetupModal 
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onConfirm={handleGameSetup}
        isSinglePlayer={setupMode === 'single'}
      />

      <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={handleBackToHome}
        onPlayAgain={handlePlayAgain}
        score={gameStats.score}
        totalWords={gameStats.totalWords}
        timeElapsed={gameStats.timeElapsed}
        isSinglePlayer={gameSettings?.isSinglePlayer || false}
      />
    </div>
  );
};

export default Index;