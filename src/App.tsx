import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProgress,
  MentorCharacter,
  HFModel,
  Challenge,
  EvaluationResult,
  ChatMessage,
  ProgrammingLanguage,
  Language,
} from './types';
import { CHARACTERS } from './data/characters';
import { CHALLENGES } from './data/challenges';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { SandboxOutput } from './components/SandboxOutput';
import { MentorWidget } from './components/MentorWidget';
import { CharacterSelector } from './components/CharacterSelector';
import { ModelSelector } from './components/ModelSelector';
import { LeaderboardModal } from './components/LeaderboardModal';
import { VideoInsightModal } from './components/VideoInsightModal';
import { IntroGameCover } from './components/IntroGameCover';
import { SkillTreeModal } from './components/SkillTreeModal';
import { BossRaidModal } from './components/BossRaidModal';
import { QuantizationVisualizerModal } from './components/QuantizationVisualizerModal';
import { ModelArenaModal } from './components/ModelArenaModal';
import { LoRAPlaygroundModal } from './components/LoRAPlaygroundModal';
import { AchievementsModal } from './components/AchievementsModal';
import { RoadmapHubModal } from './components/RoadmapHubModal';
import { GoogleAiHubModal } from './components/GoogleAiHubModal';
import { ModelAlgorithmRoomModal } from './components/ModelAlgorithmRoomModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { YouthGuideModal } from './components/YouthGuideModal';
import { GpuMonitorHud } from './components/GpuMonitorHud';

export default function App() {
  // Initial State Setup
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('ai_architect_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      xp: 1200,
      levelName: 'Developer Avanzado',
      streakDays: 7,
      globalRank: 15,
      unlockedLevel: 4,
      badges: ['Compressor', 'Speed Demon'],
      completedChallenges: [1],
      currentChallengeId: 1,
      selectedMentorId: 'jensen-huang',
      selectedModelId: 'bert-base-uncased',
      activeLanguage: 'es',
      selectedProgLang: 'python',
      savedCode: {},
    };
  });

  // Current Selections
  const activeMentor =
    CHARACTERS.find((c) => c.id === progress.selectedMentorId) || CHARACTERS[0];

  const activeModel =
    activeMentor.models.find((m) => m.id === progress.selectedModelId) ||
    activeMentor.models[0] ||
    CHARACTERS[0].models[0];

  const currentChallenge =
    CHALLENGES.find((c) => c.id === progress.currentChallengeId) || CHALLENGES[0];

  // Editor & Sandbox State
  const [code, setCode] = useState<string>(
    currentChallenge.starterCode[progress.selectedProgLang] || ''
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);

  // Modals & Chat
  const [showIntroModal, setShowIntroModal] = useState<boolean>(!progress.hasSeenIntro);
  const [showCharacterModal, setShowCharacterModal] = useState<boolean>(false);
  const [showModelModal, setShowModelModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [showSkillTreeModal, setShowSkillTreeModal] = useState<boolean>(false);
  const [showBossRaidModal, setShowBossRaidModal] = useState<boolean>(false);
  const [showQuantizationModal, setShowQuantizationModal] = useState<boolean>(false);
  const [showModelArenaModal, setShowModelArenaModal] = useState<boolean>(false);
  const [showLoRAModal, setShowLoRAModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showRoadmapHubModal, setShowRoadmapHubModal] = useState<boolean>(false);
  const [showGoogleAiModal, setShowGoogleAiModal] = useState<boolean>(false);
  const [showAlgorithmRoomModal, setShowAlgorithmRoomModal] = useState<boolean>(false);
  const [showGitHubModal, setShowGitHubModal] = useState<boolean>(false);
  const [showYouthGuideModal, setShowYouthGuideModal] = useState<boolean>(false);

  // Skill Tree Unlock Handler
  const handleUnlockSkill = (skillId: string, cost: number) => {
    setProgress((prev) => {
      const currentUnlocked = prev.unlockedSkills || [];
      if (currentUnlocked.includes(skillId) || prev.xp < cost) return prev;
      confetti({ particleCount: 50, spread: 60 });
      return {
        ...prev,
        xp: prev.xp - cost,
        unlockedSkills: [...currentUnlocked, skillId],
      };
    });
  };

  // Boss Defeat Reward Handler
  const handleDefeatBoss = (rewardXp: number) => {
    setProgress((prev) => {
      const currentBadges = prev.badges || [];
      return {
        ...prev,
        xp: prev.xp + rewardXp,
        bossHp: 0,
        badges: currentBadges.includes('Goliath Slayer') ? currentBadges : [...currentBadges, 'Goliath Slayer'],
      };
    });
  };

  const [mentorReaction, setMentorReaction] = useState<'happy' | 'thinking' | 'celebrating' | 'alert'>('happy');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Save progress to LocalStorage
  useEffect(() => {
    localStorage.setItem('ai_architect_progress', JSON.stringify(progress));
  }, [progress]);

  // Update starter code when challenge or language changes
  useEffect(() => {
    const saved = progress.savedCode[progress.currentChallengeId]?.[progress.selectedProgLang];
    if (saved) {
      setCode(saved);
    } else {
      setCode(currentChallenge.starterCode[progress.selectedProgLang] || '');
    }
    setEvalResult(null);
  }, [progress.currentChallengeId, progress.selectedProgLang]);

  // Handle Code Change
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setProgress((prev) => ({
      ...prev,
      savedCode: {
        ...prev.savedCode,
        [prev.currentChallengeId]: {
          ...prev.savedCode[prev.currentChallengeId],
          [prev.selectedProgLang]: newCode,
        },
      },
    }));
  };

  // Run Code Optimization & Benchmark
  const handleRunBenchmark = async () => {
    setIsEvaluating(true);
    setMentorReaction('thinking');

    try {
      const res = await fetch('/api/eval-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          progLang: progress.selectedProgLang,
          challenge: currentChallenge,
          baseMetrics: activeModel.baseMetrics,
          mentor: activeMentor,
          userLang: progress.activeLanguage,
        }),
      });

      const data: EvaluationResult = await res.json();
      setEvalResult(data);
      setMentorReaction(data.mentorReaction || 'happy');

      if (data.success) {
        // Trigger Gamified Confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Award XP and complete level
        setProgress((prev) => {
          const isNewComplete = !prev.completedChallenges.includes(currentChallenge.id);
          const nextUnlocked = Math.max(prev.unlockedLevel, currentChallenge.id + 1);

          return {
            ...prev,
            xp: prev.xp + data.xpEarned,
            unlockedLevel: Math.min(4, nextUnlocked),
            completedChallenges: isNewComplete
              ? [...prev.completedChallenges, currentChallenge.id]
              : prev.completedChallenges,
            badges: prev.badges.includes(currentChallenge.badgeName)
              ? prev.badges
              : [...prev.badges, currentChallenge.badgeName],
          };
        });
      }
    } catch (err) {
      console.error('Benchmark Error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Play Mentor TTS Voice
  const handlePlayTTS = async (textToSpeak: string, voiceName: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak, voiceName }),
      });
      const data = await res.json();

      if (data.audioBase64) {
        const mime = data.mimeType || 'audio/wav';
        const audio = new Audio(`data:${mime};base64,${data.audioBase64}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.onend = () => setIsPlayingAudio(false);
          window.speechSynthesis.speak(utterance);
        };
        await audio.play();
      } else {
        // Web Speech API fallback
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('TTS Error:', err);
      setIsPlayingAudio(false);
    }
  };

  // Send Message to Mentor Chat
  const handleSendMessage = async (
    text: string,
    options?: { imageAttachment?: string; codeAttachment?: string }
  ) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
      imageAttachment: options?.imageAttachment,
      codeAttachment: options?.codeAttachment,
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentor: activeMentor,
          userMessage: text,
          imageAttachment: options?.imageAttachment,
          codeAttachment: options?.codeAttachment || code,
          challenge: currentChallenge,
          currentMetrics: evalResult?.updatedMetrics || activeModel.baseMetrics,
          conversationHistory: chatHistory,
          userLang: progress.activeLanguage,
        }),
      });

      const data = await res.json();

      const mentorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        mentorId: activeMentor.id,
        text: data.text || 'Sigue explorando la optimización de tensores.',
        timestamp: new Date().toLocaleTimeString(),
      };

      setChatHistory((prev) => [...prev, mentorMsg]);
      handlePlayTTS(mentorMsg.text, activeMentor.voiceName);
    } catch (err) {
      console.error('Mentor Chat Error:', err);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#0A0B0E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header & Dashboard */}
      <Header
        progress={progress}
        activeMentor={activeMentor}
        activeModel={activeModel}
        onOpenCharacterSelector={() => setShowCharacterModal(true)}
        onOpenModelSelector={() => setShowModelModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenVideoInsight={() => setShowVideoModal(true)}
        onOpenIntroStory={() => setShowIntroModal(true)}
        onOpenSkillTree={() => setShowSkillTreeModal(true)}
        onOpenBossRaid={() => setShowBossRaidModal(true)}
        onOpenRoadmapHub={() => setShowRoadmapHubModal(true)}
        onOpenGoogleAiHub={() => setShowGoogleAiModal(true)}
        onOpenModelAlgorithmRoom={() => setShowAlgorithmRoomModal(true)}
        onOpenGitHubExport={() => setShowGitHubModal(true)}
        onOpenYouthGuide={() => setShowYouthGuideModal(true)}
        onSelectLanguage={(lang) => setProgress((p) => ({ ...p, activeLanguage: lang }))}
        onSelectLevel={(lvl) => setProgress((p) => ({ ...p, currentChallengeId: lvl }))}
      />

      {/* GPU Hardware Monitor HUD */}
      <GpuMonitorHud />

      {/* Main Dual Split-Screen Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-130px)] min-h-[650px]">
        {/* LEFT PANEL: CODE EDITOR */}
        <CodeEditor
          code={code}
          onChangeCode={handleCodeChange}
          progLang={progress.selectedProgLang}
          onChangeProgLang={(lang) => setProgress((p) => ({ ...p, selectedProgLang: lang }))}
          challenge={currentChallenge}
          userLang={progress.activeLanguage}
          onRunBenchmark={handleRunBenchmark}
          isEvaluating={isEvaluating}
          onResetCode={() => setCode(currentChallenge.starterCode[progress.selectedProgLang] || '')}
        />

        {/* RIGHT PANEL: SANDBOX OUTPUT & BENCHMARK */}
        <SandboxOutput
          baseMetrics={activeModel.baseMetrics}
          evalResult={evalResult}
          challenge={currentChallenge}
          activeModel={activeModel}
          userLang={progress.activeLanguage}
          onPublishToHF={() => {
            confetti({ particleCount: 120, spread: 80 });
          }}
        />
      </main>

      {/* Live Mentor Avatar & Chat Drawer Widget */}
      <MentorWidget
        mentor={activeMentor}
        userLang={progress.activeLanguage}
        mentorReaction={mentorReaction}
        chatHistory={chatHistory}
        onSendMessage={handleSendMessage}
        onPlayTTS={(txt, voice) => handlePlayTTS(txt, voice)}
        isPlayingAudio={isPlayingAudio}
        currentCode={code}
      />

      {/* Modals */}
      {showCharacterModal && (
        <CharacterSelector
          activeCharacterId={activeMentor.id}
          userLang={progress.activeLanguage}
          onSelectCharacter={(char) => {
            setProgress((p) => ({
              ...p,
              selectedMentorId: char.id,
              selectedModelId: char.models[0]?.id || p.selectedModelId,
            }));
          }}
          onClose={() => setShowCharacterModal(false)}
          onPlayGreetingVoice={(char) =>
            handlePlayTTS(char.greeting[progress.activeLanguage] || char.greeting.es, char.voiceName)
          }
        />
      )}

      {showModelModal && (
        <ModelSelector
          activeModelId={activeModel.id}
          mentor={activeMentor}
          userLang={progress.activeLanguage}
          onSelectModel={(model) => setProgress((p) => ({ ...p, selectedModelId: model.id }))}
          onOpenAlgorithmRoom={() => setShowAlgorithmRoomModal(true)}
          onClose={() => setShowModelModal(false)}
        />
      )}

      {showLeaderboardModal && (
        <LeaderboardModal
          userLang={progress.activeLanguage}
          onClose={() => setShowLeaderboardModal(false)}
          userScore={progress.xp}
          currentModelName={activeModel.name}
        />
      )}

      {showVideoModal && (
        <VideoInsightModal
          challenge={currentChallenge}
          userLang={progress.activeLanguage}
          onClose={() => setShowVideoModal(false)}
        />
      )}

      {/* Expansion Modals */}
      <SkillTreeModal
        isOpen={showSkillTreeModal}
        onClose={() => setShowSkillTreeModal(false)}
        progress={progress}
        onUnlockSkill={handleUnlockSkill}
      />

      <BossRaidModal
        isOpen={showBossRaidModal}
        onClose={() => setShowBossRaidModal(false)}
        progress={progress}
        onDefeatBossReward={handleDefeatBoss}
      />

      <QuantizationVisualizerModal
        isOpen={showQuantizationModal}
        onClose={() => setShowQuantizationModal(false)}
        userLang={progress.activeLanguage}
      />

      <ModelArenaModal
        isOpen={showModelArenaModal}
        onClose={() => setShowModelArenaModal(false)}
        userLang={progress.activeLanguage}
      />

      <LoRAPlaygroundModal
        isOpen={showLoRAModal}
        onClose={() => setShowLoRAModal(false)}
        userLang={progress.activeLanguage}
      />

      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        progress={progress}
      />

      <RoadmapHubModal
        isOpen={showRoadmapHubModal}
        onClose={() => setShowRoadmapHubModal(false)}
        onOpenSkillTree={() => setShowSkillTreeModal(true)}
        onOpenBossRaid={() => setShowBossRaidModal(true)}
        onOpenQuantization={() => setShowQuantizationModal(true)}
        onOpenModelArena={() => setShowModelArenaModal(true)}
        onOpenLoRA={() => setShowLoRAModal(true)}
        onOpenAchievements={() => setShowAchievementsModal(true)}
      />

      <GoogleAiHubModal
        isOpen={showGoogleAiModal}
        onClose={() => setShowGoogleAiModal(false)}
        mentor={activeMentor}
        challenge={currentChallenge}
        code={code}
        userLang={progress.activeLanguage}
      />

      <ModelAlgorithmRoomModal
        isOpen={showAlgorithmRoomModal}
        onClose={() => setShowAlgorithmRoomModal(false)}
        model={activeModel}
        userLang={progress.activeLanguage}
        onLoadCodeToEditor={(newCode) => setCode(newCode)}
      />

      <GitHubExportModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        model={activeModel}
        challenge={currentChallenge}
        code={code}
        progress={progress}
        onUpdateProgress={(updater) => setProgress(updater)}
      />

      <YouthGuideModal
        isOpen={showYouthGuideModal}
        onClose={() => setShowYouthGuideModal(false)}
        onOpenAlgorithmRoom={() => setShowAlgorithmRoomModal(true)}
        onOpenSkillTree={() => setShowSkillTreeModal(true)}
        onOpenGitHubExport={() => setShowGitHubModal(true)}
        onOpenRoadmapHub={() => setShowRoadmapHubModal(true)}
      />

      {/* Intro Portada Video Game Full-Screen Opening Cover */}
      <IntroGameCover
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        selectedMentorId={progress.selectedMentorId}
        selectedModelId={progress.selectedModelId}
        userLang={progress.activeLanguage}
        username={progress.username || 'Arquitecto Alfa'}
        onConfirmSetup={(mentorId, modelId, username) => {
          setProgress((prev) => ({
            ...prev,
            selectedMentorId: mentorId,
            selectedModelId: modelId,
            username,
            hasSeenIntro: true,
          }));
        }}
      />
    </div>
  );
}
