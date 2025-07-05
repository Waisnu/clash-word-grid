import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameSetupModal, GameSettings } from '@/components/GameSetupModal';
import { SeriesSetupModal, SeriesSettings } from '@/components/SeriesSetupModal';
import { GameLobby } from '@/components/GameLobby';
import { GameBoard } from '@/components/GameBoard';
import { GameOverModal } from '@/components/GameOverModal';
import { generateGameCode, generateRandomPlayerName } from '@/utils/gameUtils';
import { Play } from 'lucide-react';

type GameState = 'home' | 'setup' | 'seriesSetup' | 'lobby' | 'playing' | 'gameOver';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [gameCode, setGameCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [seriesSettings, setSeriesSettings] = useState<SeriesSettings | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isSeriesSetupModalOpen, setIsSeriesSetupModalOpen] = useState(false);
  const [setupMode, setSetupMode] = useState<'single' | 'multi' | 'series'>('multi');
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [gameStats, setGameStats] = useState({ score: 0, totalWords: 0, timeElapsed: 0 });

  const handleCreateGame = (mode: 'single' | 'multi' | 'series', isSinglePlayer: boolean = false) => {
    setSetupMode(mode);
    if (mode === 'series') {
      setIsSeriesSetupModalOpen(true);
    } else {
      setIsSetupModalOpen(true);
    }
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

  const handleSeriesSetup = (settings: SeriesSettings) => {
    const randomName = generateRandomPlayerName();
    setPlayerName(randomName);
    setSeriesSettings(settings);
    setIsSeriesSetupModalOpen(false);
    
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
    if (gameSettings?.isSinglePlayer || seriesSettings?.isSinglePlayer) {
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
    setSeriesSettings(null);
    setIsGameOverModalOpen(false);
    setIsSetupModalOpen(false);
    setIsSeriesSetupModalOpen(false);
  };

  const renderEnhancedLovableBackground = () => (
    <>
      {/* Main Lovable signature background */}
      <div className="fixed inset-0 bg-lovable-bg grain" />
      
      {/* Animated Lovable layers with enhanced effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-lovable-flow rounded-full opacity-20 animate-aurora-flow float-slow" />
        <div className="absolute top-20 -right-20 w-80 h-80 bg-gradient-to-br from-lovable-coral to-lovable-pink rounded-full opacity-15 pulse-aurora" />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-lovable-blue to-lovable-coral rounded-full opacity-10 animate-float" />
        <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-lovable-subtle rounded-full opacity-25 pulse-aurora" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-lovable-pink to-lovable-coral rounded-full opacity-20 float-slow" style={{ animationDelay: '3s' }} />
      </div>
    </>
  );

  if (gameState === 'playing') {
    const currentSettings = seriesSettings || gameSettings;
    return (
      <div className="min-h-screen relative">
        {renderEnhancedLovableBackground()}
        <GameBoard 
          gameCode={gameCode} 
          playerName={playerName}
          onGameEnd={handleGameEnd}
          difficulty={currentSettings?.difficulty}
          topic={currentSettings?.topic}
          timeLimit={seriesSettings ? 300 : undefined} // 5 mins for series games
          wordsCount={seriesSettings?.wordsPerGame}
        />
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="min-h-screen relative">
        {renderEnhancedLovableBackground()}
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
      {renderEnhancedLovableBackground()}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg space-y-8 animate-fade-in">
        {/* Enhanced Logo and title */}
        <div className="text-center space-y-6">
          <div className="inline-block p-6 rounded-full glass-card pulse-aurora">
            <div className="w-20 h-20 bg-lovable-flow rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-lovable-blue via-lovable-coral to-lovable-pink bg-clip-text text-transparent mb-4">
              Word Clash
            </h1>
            <p className="text-xl text-muted-foreground">
              Find words faster than your friends!
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
                onClick={() => handleCreateGame('single', true)}
                className="w-full bg-lovable-flow hover:shadow-intense transition-all duration-300 text-lg py-6"
                size="lg"
              >
                🎯 Single Player
              </Button>
              <Button 
                onClick={() => handleCreateGame('multi', false)}
                className="w-full bg-gradient-to-r from-lovable-blue to-lovable-coral hover:shadow-intense transition-all duration-300 text-lg py-6"
                size="lg"
              >
                👥 Create Multiplayer Room
              </Button>
              <Button 
                onClick={() => handleCreateGame('series', false)}
                className="w-full bg-gradient-to-r from-lovable-coral to-lovable-pink hover:shadow-intense transition-all duration-300 text-lg py-6"
                size="lg"
              >
                🏆 Tournament Series (Best of 3/5)
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
                  className="glass-card border-lovable-blue/30 focus:border-lovable-blue"
                />
                <Input
                  placeholder="4-digit room code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.slice(0, 4))}
                  className="glass-card border-lovable-coral/30 focus:border-lovable-coral text-center text-xl font-mono tracking-widest"
                />
              </div>
              <Button 
                onClick={handleJoinGame}
                disabled={!joinCode || joinCode.length !== 4 || !playerName}
                variant="secondary"
                className="w-full glass-card hover:shadow-lovable transition-all duration-300"
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

      <SeriesSetupModal 
        isOpen={isSeriesSetupModalOpen}
        onClose={() => setIsSeriesSetupModalOpen(false)}
        onConfirm={handleSeriesSetup}
        isSinglePlayer={setupMode === 'series'}
      />

      <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={handleBackToHome}
        onPlayAgain={handlePlayAgain}
        score={gameStats.score}
        totalWords={gameStats.totalWords}
        timeElapsed={gameStats.timeElapsed}
        isSinglePlayer={gameSettings?.isSinglePlayer || seriesSettings?.isSinglePlayer || false}
      />
    </div>
  );
};

export default Index;