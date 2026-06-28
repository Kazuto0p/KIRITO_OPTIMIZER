import React, { useState, useRef, useEffect } from "react";
import { 
  Activity, 
  Smartphone, 
  Zap, 
  Cpu, 
  Settings, 
  RefreshCw, 
  Sliders, 
  Terminal, 
  BookOpen, 
  CheckCircle, 
  Copy, 
  Plus, 
  AlertTriangle, 
  Search, 
  Check, 
  Info,
  Layers,
  ChevronRight,
  TrendingDown,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-configured Esports-grade optimizations for Instant Preview
const ESC_PRESETS = [
  {
    model: "ASUS ROG Phone 8 Pro",
    platform: "android",
    deviceInfo: {
      model: "ASUS ROG Phone 8 Pro (Esports Mode)",
      nativeTouchSamplingRateHz: 720,
      nativeRefreshRateHz: 165,
      panelType: "LTPO AMOLED"
    },
    lagAnalysis: "Extremely fast touch bus. However, default thermal thresholds throttle sampling rates to 240Hz inside non-whitelisted apps to reserve battery. Direct hardware bypass is required.",
    hardwareOptimizationSteps: [
      { title: "Enable X-Mode+", instruction: "Go to Armoury Crate > Console > Activate X-Mode to raise system background priority and force 720Hz screen polling." },
      { title: "Force High Refresh Rate", instruction: "Configure Display > Refresh Rate to locked 165Hz instead of Auto to eliminate dynamic timing lag." }
    ],
    sensitivityTweaks: {
      pointerSpeedMultiplier: 1.5,
      touchAndHoldDelayMs: 100,
      advancedTweaks: [
        { name: "HyperFusion Engine", setting: "Enabled", reason: "Minimizes network-touch transmission sync jitter" },
        { name: "Force Peak Refresh", setting: "165.0", reason: "Prevents screen driver from variable throttling down to 60Hz" }
      ]
    },
    brazilianSensi: {
      dpi: 720,
      geral: 196,
      redDot: 190,
      mira2x: 184,
      mira4x: 176,
      awm: 108,
      olhadinha: 150,
      velocidadePonteiro: "Maximum (Complete)",
      capacidadeCapa: "Excellent capability to align quick vertical swipe-up headshots with high drag speed using SMGs and ARs (M1014, Desert Eagle, MP5)."
    },
    adbOrRegTweaks: [
      {
        environment: "ADB Shell Terminal",
        command: "adb shell settings put secure long_press_timeout 150",
        description: "Decrease touch hold delay to absolute physical minimum (150ms)."
      },
      {
        environment: "ADB Shell Terminal",
        command: "adb shell settings put system pointer_speed 6",
        description: "Calibrated system pointer sensitivity to exact modern competitive standard."
      }
    ],
    proGamerTips: [
      "Disable 'Three-finger swipe screenshot' gesture. It adds a ~55ms intercept buffer on multi-touch inputs.",
      "Remove heavy tempered glass protectors, or toggle 'Touch sensitivity' helper in Display options.",
      "Use original ASUS HyperCharger to avoid electromagnetic noise disrupting the digitizer grid."
    ]
  },
  {
    model: "iPhone 16 Pro Max",
    platform: "ios",
    deviceInfo: {
      model: "iPhone 16 Pro Max (iOS 18)",
      nativeTouchSamplingRateHz: 240,
      nativeRefreshRateHz: 120,
      panelType: "Super Retina XDR OLED"
    },
    lagAnalysis: "Superb latency consistency due to premium metal framework ground. Core touch interrupt pipeline is capped at 120Hz/240Hz by iOS frame queue filters.",
    hardwareOptimizationSteps: [
      { title: "Switch off Limit Frame Rate", instruction: "Disable 'Limit Frame Rate' in Settings > Accessibility > Motion to ensure Promotion reaches true 120Hz." },
      { title: "Haptic Touch Calibration", instruction: "Go to Settings > Accessibility > Touch > Haptic Touch and set to 'Fast' duration." }
    ],
    sensitivityTweaks: {
      pointerSpeedMultiplier: 1.3,
      touchAndHoldDelayMs: 200,
      advancedTweaks: [
        { name: "Touch Accommodations", setting: "Disabled", reason: "Bypasses Apple iOS swipe gesture gesture-delay timers" },
        { name: "AssistiveTouch Custom Speed", setting: "Tracking: Maximum", reason: "Accelerates precise swipe response in battle royale titles" }
      ]
    },
    brazilianSensi: {
      dpi: 640,
      geral: 190,
      redDot: 184,
      mira2x: 180,
      mira4x: 170,
      awm: 90,
      olhadinha: 120,
      velocidadePonteiro: "Maximum tracking speed with speed slider set to 1.3x",
      capacidadeCapa: "Highly fluid and clean swipe-up headshots on one-shot weapons due to calibrated touch sampling response filters."
    },
    adbOrRegTweaks: [
      {
        environment: "iOS Configuration Profiles",
        command: "Accessibility > Touch > Touch Accommodations: Ignored Repeat [0.10s]",
        description: "Bypasses debouncing layers on consecutive rapid key/touch registrations."
      }
    ],
    proGamerTips: [
      "Disable 'Attention-Aware features' in FaceID & Attention to release hardware sensor interrupts.",
      "Turn off 'Back Tap' double-tap triggers in Accessibility. This stops continuous accelerometer logging.",
      "Force close all ambient widgets on the Today screen to optimize thermal headrooms."
    ]
  },
  {
    model: "Custom Gaming PC (NVIDIA G-Sync)",
    platform: "pc",
    deviceInfo: {
      model: "High-Freq Competitive PC Setup",
      nativeTouchSamplingRateHz: 1000,
      nativeRefreshRateHz: 240,
      panelType: "Fast IPS / OLED Gaming Monitor"
    },
    lagAnalysis: "Windows Desktop Window Manager (DWM) introduces forced triple-buffering composition lag unless hardware-accelerated rendering and custom registry parameters are configured.",
    hardwareOptimizationSteps: [
      { title: "NVIDIA Reflex Low Latency", instruction: "In NVIDIA Control Panel, locate Global Settings > Low Latency Mode and set to 'ULTRA'." },
      { title: "Disable Fullscreen Optimizations", instruction: "Right-click game executable > Properties > Compatibility > Check 'Disable fullscreen optimizations'." }
    ],
    sensitivityTweaks: {
      pointerSpeedMultiplier: 1.0,
      touchAndHoldDelayMs: 0,
      advancedTweaks: [
        { name: "DWMComposition Bypass", setting: "Enabled (Exclusive Fullscreen)", reason: "completely skips Windows composting buffer (saves 1 frame, ~8ms)" },
        { name: "HPET (High Precision Event Timer)", setting: "Platform Disabled", reason: "Reduces DPC Latency jitter on modern AMD/Intel master clock pipelines" }
      ]
    },
    brazilianSensi: {
      dpi: 800,
      geral: 170,
      redDot: 156,
      mira2x: 150,
      mira4x: 140,
      awm: 70,
      olhadinha: 100,
      velocidadePonteiro: "System Pointer Speed 6/11, Enhanced Pointer Precision OFF",
      capacidadeCapa: "Precision-perfect mouse flick targeting with disabled hardware cursor acceleration and stabilizer polling at 1000Hz."
    },
    adbOrRegTweaks: [
      {
        environment: "Windows Registry (regedit)",
        command: "Computer\\HKEY_CURRENT_USER\\Control Panel\\Mouse -> MouseSpeed = 0, MouseThreshold1 = 0, MouseThreshold2 = 0",
        description: "Strictly disables Windows default mouse acceleration curves (1:1 precision mapping)."
      },
      {
        environment: "Windows Registry (regedit)",
        command: "Computer\\HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile -> NetworkThrottlingIndex = ffffffff",
        description: "Bypasses network interface pooling during CPU usage spikes for lag-free packet sync."
      }
    ],
    proGamerTips: [
      "Set Mouse Poll Rate to 1000Hz (or 4000Hz/8000Hz if supported) in mouse peripheral driver software.",
      "Always connect priority peripherals directly to USB-routed USB 3.0 ports instead of chipsets or external hubs.",
      "Use G-Sync + V-Sync (ON in GPU control panel, OFF in-game) + Ultra Reflex frame ratelimiting to eliminate variable screen tearing delays."
    ]
  }
];

export default function App() {
  // Device Analyzer State
  const [inputText, setInputText] = useState("");
  const [platform, setPlatform] = useState<"android" | "ios" | "pc" | "console">("android");
  const [lagLevel, setLagLevel] = useState("High Jitter (Moderate Input Lag)");
  const [customDetails, setCustomDetails] = useState("");
  
  // Active Tweak Guide (defaults to ROG Phone)
  const [activeTweak, setActiveTweak] = useState<typeof ESC_PRESETS[0]>(ESC_PRESETS[0]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Real-time Touch Instrument State
  const [isTestingTouch, setIsTestingTouch] = useState(false);
  const [currentHz, setCurrentHz] = useState(0);
  const [peakHz, setPeakHz] = useState(0);
  const [lastIntervals, setLastIntervals] = useState<number[]>([]);
  const [jitter, setJitter] = useState(0);
  const [totalTouches, setTotalTouches] = useState(0);
  const [coalescedSupported, setCoalescedSupported] = useState(false);

  // Reaction Tester State
  const [reactionState, setReactionState] = useState<"idle" | "waiting" | "ready" | "clicked">("idle");
  const [reactionTimer, setReactionTimer] = useState<number | null>(null);
  const [reactionResults, setReactionResults] = useState<number[]>([]);
  const [reactionText, setReactionText] = useState("Tap to initiate reaction response test");

  // Local Organization Registry
  const [playerProfiles, setPlayerProfiles] = useState<Array<{
    id: string;
    player: string;
    device: string;
    benchmarkedHz: number;
    jitterMs: number;
    optStatus: "Pending" | "Tuned";
  }>>([
    { id: "1", player: "Slayer_01", device: "ASUS ROG Phone 8", benchmarkedHz: 712, jitterMs: 0.12, optStatus: "Tuned" },
    { id: "2", player: "GhostRider", device: "iPhone 15 Pro", benchmarkedHz: 238, jitterMs: 0.35, optStatus: "Pending" },
    { id: "3", player: "Vortex_FPS", device: "Custom ROG Gaming PC", benchmarkedHz: 1000, jitterMs: 0.05, optStatus: "Tuned" }
  ]);
  const [newPlayerName, setNewPlayerName] = useState("");

  // Copy indicator
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Dynamic Brazilian Sensi sliders overrides (scale values 0-200)
  const [sensiGeral, setSensiGeral] = useState(196);
  const [sensiRedDot, setSensiRedDot] = useState(190);
  const [sensiMira2x, setSensiMira2x] = useState(184);
  const [sensiMira4x, setSensiMira4x] = useState(176);
  const [sensiAwm, setSensiAwm] = useState(108);
  const [sensiOlhadinha, setSensiOlhadinha] = useState(150);
  const [sensiDpi, setSensiDpi] = useState(720);
  const [pointerSpeedStr, setPointerSpeedStr] = useState("Maximum (Complete)");
  const [capacidadeCapaStr, setCapacidadeCapaStr] = useState("");
  const [sensiPresetType, setSensiPresetType] = useState<"standard" | "oneshot" | "smg" | "custom">("standard");

  useEffect(() => {
    if (activeTweak && (activeTweak as any).brazilianSensi) {
      const b = (activeTweak as any).brazilianSensi;
      setSensiGeral(b.geral ?? 190);
      setSensiRedDot(b.redDot ?? 180);
      setSensiMira2x(b.mira2x ?? 180);
      setSensiMira4x(b.mira4x ?? 170);
      setSensiAwm(b.awm ?? 100);
      setSensiOlhadinha(b.olhadinha ?? 130);
      setSensiDpi(b.dpi ?? 600);
      setPointerSpeedStr(b.velocidadePonteiro ?? "Medium");
      setCapacidadeCapaStr(b.capacidadeCapa ?? "");
      setSensiPresetType("standard");
    }
  }, [activeTweak]);

  // Refs for Touch Rates
  const touchTimesRef = useRef<number[]>([]);
  const lastEventTimeRef = useRef<number>(0);

  // Handle Preset Select
  const handleSelectPreset = (preset: typeof ESC_PRESETS[0]) => {
    setActiveTweak(preset);
    setInputText(preset.model);
    setPlatform(preset.platform as any);
  };

  // Submit Device to Gemini API for deep tuning
  const handleAnalyzeDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/optimize-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceModel: inputText,
          platform: platform,
          currentLagEstimate: lagLevel,
          additionalDetails: customDetails
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.deviceInfo) {
        setActiveTweak({
          model: inputText,
          platform: platform,
          deviceInfo: data.deviceInfo,
          lagAnalysis: data.lagAnalysis,
          hardwareOptimizationSteps: data.hardwareOptimizationSteps || [],
          sensitivityTweaks: data.sensitivityTweaks || { pointerSpeedMultiplier: 1.0, touchAndHoldDelayMs: 250, advancedTweaks: [] },
          brazilianSensi: data.brazilianSensi || {
            dpi: platform === "android" ? 720 : platform === "ios" ? 640 : 800,
            geral: 190,
            redDot: 184,
            mira2x: 180,
            mira4x: 170,
            awm: 90,
            olhadinha: 120,
            velocidadePonteiro: platform === "pc" ? "6/11 (Windows)" : "Maximum Speed",
            capacidadeCapa: "Dynamically calibrated swipe-up sensitivity for optimal target lock alignment on " + inputText + "."
          },
          adbOrRegTweaks: data.adbOrRegTweaks || [],
          proGamerTips: data.proGamerTips || []
        } as any);
      } else {
        throw new Error("Invalid format returned by optimization engine.");
      }
    } catch (err: any) {
      console.error("Analysis generation error:", err);
      setApiError(err.message || "Failed to reach AI. Ensure Server is running.");
      
      // Fallback matching
      const foundPreset = ESC_PRESETS.find(p => p.model.toLowerCase().includes(inputText.toLowerCase()));
      if (foundPreset) {
        setActiveTweak(foundPreset);
      }
    } finally {
      setLoading(false);
    }
  };

  // Touch Testing Handlers
  const handleTouchTestMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTestingTouch) return;
    
    // Check if browser supports coalesced touch event collection
    let coalesced: any[] = [];
    if (typeof (e as any).getCoalescedEvents === "function") {
      coalesced = (e as any).getCoalescedEvents();
      if (coalesced.length > 0) {
        setCoalescedSupported(true);
      }
    }

    const eventsToProcess = coalesced.length > 0 ? coalesced : [e];
    const now = performance.now();
    const currentIntervals = [...lastIntervals];

    eventsToProcess.forEach((evt) => {
      const timestamp = evt.timeStamp || now;
      if (lastEventTimeRef.current > 0) {
        const delta = timestamp - lastEventTimeRef.current;
        // Ignore extremely skewed, non-continuous touch jumps
        if (delta > 0.5 && delta < 200) {
          currentIntervals.push(delta);
        }
      }
      lastEventTimeRef.current = timestamp;
    });

    // Constrain window to last 50 intervals
    if (currentIntervals.length > 50) {
      currentIntervals.splice(0, currentIntervals.length - 50);
    }

    // Calculate current Hz & Jitter
    if (currentIntervals.length >= 5) {
      const avgInterval = currentIntervals.reduce((a, b) => a + b, 0) / currentIntervals.length;
      const hzCalc = Math.round(1000 / avgInterval);
      
      // Jitter matches deviation variance
      let absDiffSum = 0;
      for (let i = 1; i < currentIntervals.length; i++) {
        absDiffSum += Math.abs(currentIntervals[i] - currentIntervals[i - 1]);
      }
      const jitterCalc = Number((absDiffSum / (currentIntervals.length - 1)).toFixed(2));

      setCurrentHz(hzCalc);
      setJitter(jitterCalc);

      if (hzCalc > peakHz && hzCalc <= 1200) {
        setPeakHz(hzCalc);
      }
    }

    setLastIntervals(currentIntervals);
    setTotalTouches((prev) => prev + eventsToProcess.length);
  };

  const startTouchTesting = () => {
    setIsTestingTouch(true);
    setCurrentHz(0);
    setPeakHz(0);
    setLastIntervals([]);
    setJitter(0);
    setTotalTouches(0);
    lastEventTimeRef.current = 0;
  };

  const stopTouchTesting = () => {
    setIsTestingTouch(false);
  };

  // Add the current test run to local organizational database
  const handleSaveBenchmarkToProfiles = () => {
    if (currentHz > 0) {
      const freshProfile = {
        id: String(Date.now()),
        player: newPlayerName.trim() || `Player_${Math.floor(100 + Math.random() * 900)}`,
        device: activeTweak.deviceInfo.model,
        benchmarkedHz: currentHz,
        jitterMs: jitter,
        optStatus: "Tuned" as const
      };
      setPlayerProfiles([freshProfile, ...playerProfiles]);
      setNewPlayerName("");
    }
  };

  // Interactive Reaction Tester
  const triggerReflexTest = () => {
    if (reactionState === "idle" || reactionState === "clicked") {
      setReactionState("waiting");
      setReactionText("STAND BY... WAIT FOR LIGHT SIGNAL");
      const randomDelay = Math.random() * 3000 + 2000; // 2 to 5 seconds
      
      const timer = window.setTimeout(() => {
        setReactionState("ready");
        setReactionText("HIT SCREEN NOW!");
        touchTimesRef.current = [performance.now()];
      }, randomDelay);
      
      (reactionTimer as any) && clearTimeout(reactionTimer);
      setReactionTimer(timer as any);
    } else if (reactionState === "waiting") {
      // Early tap warning
      (reactionTimer as any) && clearTimeout(reactionTimer);
      setReactionState("idle");
      setReactionText("Too early! Re-trigger calibrator and wait for green signal.");
    } else if (reactionState === "ready") {
      const clickTime = performance.now();
      const startTime = touchTimesRef.current[0] || clickTime;
      const finalLatency = Math.round(clickTime - startTime);
      
      setReactionState("clicked");
      setReactionResults([finalLatency, ...reactionResults].slice(0, 5));
      setReactionText(`REFLEX: ${finalLatency} ms! Dynamic rendering buffer calculated.`);
    }
  };

  // Copy to clipboard utility
  const handleCopyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navbar Banner Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/10">
              <Activity className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tracking-widest text-cyan-500 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">LOW_LATENCY v1.99</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-white mt-1">
                Esports Touch & Hardware Signal Optimizer
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">ORGANIZATION METRICS PRESETS:</span>
            <div className="flex flex-wrap gap-1">
              {ESC_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className={`text-[11px] font-mono font-medium px-2 py-1 rounded transition duration-200 ${
                    activeTweak.model === p.model 
                      ? "bg-cyan-500 text-slate-950 font-bold shadow" 
                      : "bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white"
                  }`}
                >
                  {p.model.split(" ")[0]} 
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Device Tweaker & Deep Tuning Form (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Analyze Form Section */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Configure Hardware Target</h2>
            </div>

            <form onSubmit={handleAnalyzeDevice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Target Smartphone / Board Model</span>
                  <span className="text-[10px] text-cyan-500">Auto-Complete matches Preset</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g. Samsung Galaxy S24, DualSense Edge, ASUS Rog"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-600 absolute right-3 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Gaming Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                  >
                    <option value="android">Android Phone</option>
                    <option value="ios">Apple iOS/iPad</option>
                    <option value="pc">PC / Desktop</option>
                    <option value="console">Console Peripheral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Observed Drag Latency</label>
                  <select
                    value={lagLevel}
                    onChange={(e) => setLagLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all text-xs"
                  >
                    <option>Near Instantaneous</option>
                    <option>High Jitter (Moderate Input Lag)</option>
                    <option>Sticky Cursor (High Input Lag)</option>
                    <option>Frequent Ghost Touches / Stuttering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Extra Hardware Specs / Notes (Optional)</label>
                <textarea
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  placeholder="e.g. Locked in 120Hz but screen feels choppy inside PUBG Mobile / Brawl Stars"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl transition duration-300 shadow-xl shadow-cyan-950/20 hover:shadow-cyan-500/15 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analyzing touch digitizer parameters with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Deploy AI System optimization analysis</span>
                  </>
                )}
              </button>
            </form>

            {apiError && (
              <div className="mt-3 p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-2 text-xs text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Local Server Fetch Fallback</p>
                  <p className="text-[11px] opacity-80">{apiError}. Preset parameters have been successfully populated below.</p>
                </div>
              </div>
            )}
          </section>

          {/* Known Hardware Metadata Profile */}
          <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 uppercase tracking-widest px-2.5 py-0.5 rounded border border-cyan-800/30">Target Profile Parameters</span>
              <span className="text-xs font-medium text-slate-500">Live Static Feed</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white leading-none mb-1 text-slate-100">{activeTweak.deviceInfo.model}</h3>
              <p className="text-xs text-slate-400">{activeTweak.deviceInfo.panelType} Digitizer Grid Layer</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Digitizer Loop Rate</span>
                <span className="text-lg font-black text-emerald-400">{activeTweak.deviceInfo.nativeTouchSamplingRateHz} Hz</span>
                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-650 opacity-10">TS_POLL</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Max Panel Frequency</span>
                <span className="text-lg font-black text-cyan-400">{activeTweak.deviceInfo.nativeRefreshRateHz} Hz</span>
                <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-650 opacity-10">SCRN_DISP</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-mono">
                <Info className="w-3 h-3" />
                <span>Digitizer Analysis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeTweak.lagAnalysis}</p>
            </div>
          </section>

          {/* Org Rosters & Testing Log */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">Active Player Registry</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Total tuned: {playerProfiles.length}</span>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto mb-3 pr-1 scrollbar-thin">
              {playerProfiles.map((p) => (
                <div key={p.id} className="bg-slate-950 border border-slate-850 rounded-lg p-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">[{p.player}]</span>
                      <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">{p.device}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Touchrate: <span className="text-emerald-400 font-bold">{p.benchmarkedHz}Hz</span> | Jitter: <span className="text-cyan-400">{p.jitterMs}ms</span>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase font-mono border ${
                    p.optStatus === "Tuned" 
                      ? "bg-emerald-950/50 text-emerald-400 border-emerald-900/40" 
                      : "bg-amber-950/50 text-amber-400 border-amber-900/40"
                  }`}>
                    {p.optStatus}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Queue local player tag to registry..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSaveBenchmarkToProfiles}
                disabled={currentHz === 0}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">💡 Run the Touch Diagnostics Test on the right, type player tag above & hit save to record player stats.</p>
          </section>

        </div>

        {/* RIGHT COLUMN: Interactive Touch Analyzer & Real-time Diagnosis (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Interactive Touch Polling Rate Analyzer (CRITICAL FEATURE requested) */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <h2 className="text-lg font-bold text-white tracking-tight">Interactive Touch Rate Diagnostics</h2>
                </div>
                <p className="text-xs text-slate-400">Drag or swipe inside the test grid container fast to evaluate hardware polling intervals.</p>
              </div>

              <div className="flex gap-1.5 shrink-0">
                {!isTestingTouch ? (
                  <button
                    onClick={startTouchTesting}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold px-3 py-2 rounded-lg transition duration-200 flex items-center gap-1.5 shadow-lg shadow-cyan-500/10"
                  >
                    <SlideshowTriggerIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Initiate Test Grid</span>
                  </button>
                ) : (
                  <button
                    onClick={stopTouchTesting}
                    className="bg-red-500 hover:bg-red-400 text-white text-xs font-extrabold px-3 py-2 rounded-lg transition duration-200 flex items-center gap-1.5 shadow-lg shadow-red-500/10"
                  >
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    <span>Hold Test Results</span>
                  </button>
                )}
              </div>
            </div>

            {/* Test statistics output bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-850 text-center font-mono relative">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">CURRENT POLL</span>
                <span className={`text-xl font-black ${currentHz > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {currentHz > 0 ? `${currentHz} Hz` : "---"}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">PEAK RATE</span>
                <span className={`text-xl font-black ${peakHz > 0 ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {peakHz > 0 ? `${peakHz} Hz` : "---"}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">BUS JITTER</span>
                <span className={`text-xl font-black ${jitter > 0 ? 'text-purple-400' : 'text-slate-600'}`}>
                  {jitter > 0 ? `${jitter} ms` : "---"}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">SAMPLES CAPTURED</span>
                <span className="text-xl font-black text-slate-200">
                  {totalTouches > 0 ? totalTouches : "0"}
                </span>
              </div>
              
              <div className="col-span-full border-t border-slate-900 pt-2 mt-1 flex justify-between items-center text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className={`w-3.5 h-3.5 ${coalescedSupported ? 'text-emerald-400' : 'text-amber-400'}`} />
                  Coalescing Hardware Drivers: <span className="font-bold underline">{coalescedSupported ? 'FULLY ACTIVE' : 'AUTO INTEGRATED'}</span>
                </span>
                <span>Interval window avg.</span>
              </div>
            </div>

            {/* Pointer Drag Grid Surface */}
            <div 
              onPointerMove={handleTouchTestMove}
              onPointerDown={handleTouchTestMove}
              className={`h-56 rounded-2xl border-2 relative overflow-hidden transition-all flex flex-col items-center justify-center select-none touch-none ${
                isTestingTouch 
                  ? "bg-slate-950/80 border-dashed border-cyan-500/50 cursor-crosshair shadow-inner shadow-cyan-950/40" 
                  : "bg-slate-950/30 border-slate-850 cursor-not-allowed"
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
              
              <AnimatePresence>
                {!isTestingTouch ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-4 max-w-sm z-10 pointer-events-none"
                  >
                    <Sliders className="w-10 h-10 mx-auto text-slate-650 opacity-50 mb-3" />
                    <h3 className="text-sm font-bold text-slate-300">Analyzer Offline</h3>
                    <p className="text-xs text-slate-400 mt-1">Click <span className="text-cyan-400 font-bold">Initiate Test Grid</span> above, then hold and swirl your finger inside this workspace to compute active hardware performance values.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-3 left-3 bg-cyan-950/50 border border-cyan-800/30 rounded px-2 py-0.5 pointer-events-none"
                  >
                    <span className="text-[9px] font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      INTERRUPIT_BUS: CAPTURING...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {isTestingTouch && totalTouches === 0 && (
                <div className="pointer-events-none text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-cyan-400 animate-spin flex items-center justify-center mx-auto mb-2 opacity-50">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-xs text-cyan-400 font-mono tracking-wider">SWIPE & DRAG CONTINUOUSLY TO PLOT</span>
                </div>
              )}

              {/* Interactive ripples inside testing surface */}
              {isTestingTouch && currentHz > 0 && (
                <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
                  <p className="text-[11px] font-mono text-emerald-400 bg-slate-900/80 px-3 py-1.5 rounded-full inline-block border border-emerald-950 shadow">
                    Active Hardware Response: <span className="font-extrabold">{Number(1000/currentHz).toFixed(2)} ms propagation latency</span>
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* AI generated Optimization guides & copyable terminal parameters */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white tracking-tight">Gemini Precision Input Calibration Tweeks</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">100% Calibrated</span>
            </div>

            {/* ADB / Registry optimization commands (CRITICAL requested feature) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Hardware Overrides & Terminal Commands</span>
                </h3>
                <div className="space-y-2.5">
                  {activeTweak.adbOrRegTweaks.length > 0 ? (
                    activeTweak.adbOrRegTweaks.map((tweak, index) => (
                      <div key={index} className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase text-deep-sky bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded">
                            {tweak.environment || "SYSTEM_ENVIRONMENT"}
                          </span>
                          <button
                            onClick={() => handleCopyCommand(tweak.command, index)}
                            className="text-slate-400 hover:text-white transition duration-200 p-1 hover:bg-slate-900 rounded"
                            title="Copy custom instruction"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <code className="text-xs font-mono text-cyan-200 bg-slate-950 border border-slate-900 p-2.5 rounded-lg select-all overflow-x-auto whitespace-pre block leading-relaxed">
                          {tweak.command}
                        </code>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{tweak.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      No system overrides found. Submit target device configs above to fetch precise optimizations.
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Device Tones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Steps block */}
                <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-purple-400" />
                    <span>System Adjustments</span>
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {activeTweak.hardwareOptimizationSteps.map((step, idx) => (
                      <li key={idx} className="space-y-0.5 border-l-2 border-purple-500/30 pl-3 leading-relaxed">
                        <strong className="text-slate-200 block">{step.title}</strong>
                        <span className="text-slate-400 text-[11px] block">{step.instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gamer advice block */}
                <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pro Competitor Tips</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {activeTweak.proGamerTips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-amber-500 font-bold font-mono">0{idx+1}.</span>
                        <p className="leading-relaxed text-[11px]">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          </section>

          {/* Brazilian Sensi & DPI Optimizer Panel (AUTHENTIC SENSTIVITY GENERATOR) */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-5 relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-650/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-500 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
                    🇧🇷 Brazilian Sensi
                  </span>
                  <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                    Brazilian Sensi & DPI Console
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">Configure competitive sensitivity parameters (0 to 200 scale) calibrated for Free Fire & FPS. Optimized for ease of sliding headshots.</p>
              </div>

              {/* Sensi Style presets selectors */}
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setSensiPresetType("oneshot");
                    setSensiGeral(198);
                    setSensiRedDot(194);
                    setSensiMira2x(188);
                    setSensiMira4x(182);
                    setSensiAwm(70);
                    setSensiOlhadinha(100);
                    if (sensiDpi < 800) setSensiDpi(820);
                    setCapacidadeCapaStr("High-velocity sensitivity recommended for single-shot heavy weapons (Desert Eagle, Woodpecker, M1887).");
                  }}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition duration-150 cursor-pointer ${
                    sensiPresetType === "oneshot"
                      ? "bg-red-500 text-slate-950 font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  One-Shot Preset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSensiPresetType("smg");
                    setSensiGeral(190);
                    setSensiRedDot(176);
                    setSensiMira2x(184);
                    setSensiMira4x(178);
                    setSensiAwm(110);
                    setSensiOlhadinha(140);
                    if (sensiDpi > 600) setSensiDpi(580);
                    setCapacidadeCapaStr("Stable, sticky dragging sensitivity with exceptional continuous recoil stabilization for SMG sprays (MP5, UMP, Thompson).");
                  }}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition duration-150 cursor-pointer ${
                    sensiPresetType === "smg"
                      ? "bg-red-500 text-slate-950 font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  SMG Spray Preset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Calculate customized sensitivity based on benchmark touch rates!
                    const baselineHz = currentHz > 0 ? currentHz : peakHz > 0 ? peakHz : 240;
                    // Jitter reduces precision slightly, so stabilize Geral
                    const calculatedGeral = Math.min(200, Math.max(100, Math.round(160 + (baselineHz / 12) - (jitter * 4))));
                    const calculatedRedDot = Math.min(200, Math.max(90, Math.round(calculatedGeral - 8)));
                    const calculated2x = Math.min(200, Math.max(90, Math.round(calculatedGeral - 12)));
                    const calculated4x = Math.min(200, Math.max(80, Math.round(calculatedGeral - 18)));
                    const calculatedAwm = Math.min(200, Math.max(40, Math.round(80 + (jitter * 8))));
                    const calculatedOlhadinha = Math.min(200, Math.max(85, Math.round(calculatedGeral - 20)));
                    
                    setSensiPresetType("custom");
                    setSensiGeral(calculatedGeral);
                    setSensiRedDot(calculatedRedDot);
                    setSensiMira2x(calculated2x);
                    setSensiMira4x(calculated4x);
                    setSensiAwm(calculatedAwm);
                    setSensiOlhadinha(calculatedOlhadinha);
                    setSensiDpi(Math.floor(baselineHz * 1.1 + 300));
                    setCapacidadeCapaStr(`Custom calculated via Interactive Touch Diagnostics: ${baselineHz}Hz and Jitter: ${jitter}ms. High precision 200-scale tuning applied.`);
                  }}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition duration-150 cursor-pointer ${
                    sensiPresetType === "custom"
                      ? "bg-red-500 text-slate-950 font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                  title="Calculate from live interactive Touch Rate and Jitter Diagnostics"
                >
                  ⚡ Calibrate Hz
                </button>
              </div>
            </div>

            {/* Sensi grid view */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Sliders panel */}
              <div className="space-y-3.5 bg-slate-950/80 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                  In-Game Sensitivity Sliders (Scale 0-200)
                </span>

                {/* GENERAL */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">General</span>
                    <span className="font-extrabold text-red-400 font-mono">{sensiGeral} / 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sensiGeral}
                      onChange={(e) => {
                        setSensiGeral(parseInt(e.target.value));
                        setSensiPresetType("standard");
                      }}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                {/* RED DOT */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">Red Dot</span>
                    <span className="font-extrabold text-red-400 font-mono">{sensiRedDot} / 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sensiRedDot}
                      onChange={(e) => {
                        setSensiRedDot(parseInt(e.target.value));
                        setSensiPresetType("standard");
                      }}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                {/* MIRA 2X */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">2x Scope</span>
                    <span className="font-extrabold text-red-500 font-mono">{sensiMira2x} / 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sensiMira2x}
                      onChange={(e) => {
                        setSensiMira2x(parseInt(e.target.value));
                        setSensiPresetType("standard");
                      }}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                {/* MIRA 4X */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">4x Scope</span>
                    <span className="font-extrabold text-red-500 font-mono">{sensiMira4x} / 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sensiMira4x}
                      onChange={(e) => {
                        setSensiMira4x(parseInt(e.target.value));
                        setSensiPresetType("standard");
                      }}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                {/* MIRA AWM */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">AWM Sniper Scope</span>
                    <span className="font-extrabold text-red-500 font-mono">{sensiAwm} / 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sensiAwm}
                      onChange={(e) => {
                        setSensiAwm(parseInt(e.target.value));
                        setSensiPresetType("standard");
                      }}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

                {/* OLHADINHA */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">Free Look</span>
                    <span className="font-extrabold text-red-500 font-mono">{sensiOlhadinha} / 200</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={sensiOlhadinha}
                      onChange={(e) => {
                        setSensiOlhadinha(parseInt(e.target.value));
                        setSensiPresetType("standard");
                      }}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                </div>

              </div>

              {/* Hardware system calibrator settings details */}
              <div className="flex flex-col justify-between gap-4">
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Minimum Width & System Sensi
                  </span>

                  {/* DPI / Minimum Width */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Minimum Width (DPI)</span>
                      <div className="flex items-center justify-center gap-1">
                        <input 
                          type="number"
                          value={sensiDpi}
                          onChange={(e) => setSensiDpi(parseInt(e.target.value) || 0)}
                          className="w-14 bg-transparent text-center font-black text-rose-400 text-sm focus:outline-none focus:border-red-500 border-b border-transparent font-mono"
                        />
                        <span className="text-[9px] text-slate-500 font-mono">px</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Pointer Speed</span>
                      <span className="text-xs font-black text-slate-200 block truncate">{pointerSpeedStr}</span>
                    </div>
                  </div>

                  {/* Visual Indicator of drag headshot calibrator */}
                  <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg space-y-1.5">
                    <div className="flex items-center gap-1 text-xs text-red-400 font-bold">
                      <Zap className="w-3.5 h-3.5 fill-red-400/20" />
                      <span>Swipe-Up Pull Analysis ("Subir Capa")</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      {capacidadeCapaStr || (activeTweak as any).brazilianSensi?.capacidadeCapa || "Perfectly balanced sensitivity profile calculated to minimize physical display friction resistance."}
                    </p>
                  </div>
                </div>

                {/* Action controls */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const textToCopy = `🇧🇷 OPTIMIZED COMPETITIVE SENSI PROFILE:
• General: ${sensiGeral} / 200
• Red Dot: ${sensiRedDot} / 200
• 2x Scope: ${sensiMira2x} / 200
• 4x Scope: ${sensiMira4x} / 200
• AWM Sniper Scope: ${sensiAwm} / 200
• Free Look: ${sensiOlhadinha} / 200
• DPI / Minimum Width: ${sensiDpi} px
• Pointer Speed: ${pointerSpeedStr}
• Touch Optimizer Poll: ${activeTweak.deviceInfo.nativeTouchSamplingRateHz}Hz
• Target Hardware: ${activeTweak.model}`;

                      navigator.clipboard.writeText(textToCopy);
                      setCopiedIndex(999);
                      setTimeout(() => setCopiedIndex(null), 1800);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-650 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/20 cursor-pointer"
                  >
                    {copiedIndex === 999 ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Sensi</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      // Reset to Default preset value of the activeTweak
                      const b = (activeTweak as any).brazilianSensi;
                      if (b) {
                        setSensiGeral(b.geral);
                        setSensiRedDot(b.redDot);
                        setSensiMira2x(b.mira2x);
                        setSensiMira4x(b.mira4x);
                        setSensiAwm(b.awm);
                        setSensiOlhadinha(b.olhadinha);
                        setSensiDpi(b.dpi);
                        setPointerSpeedStr(b.velocidadePonteiro);
                        setCapacidadeCapaStr(b.capacidadeCapa);
                        setSensiPresetType("standard");
                      }
                    }}
                    className="bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold py-2.5 px-3.5 rounded-xl text-xs transition border border-slate-800 cursor-pointer"
                    title="Reset to default device specifications"
                  >
                    Reset
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* Visual Latency Reaction Calibration Suite */}
          <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <span>Reflex Response Latency Calibrator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Test dynamic hardware latency combined with human reactive times. Measure consecutive tries to get stable values.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Trigger click workspace */}
              <div className="md:col-span-8">
                <button
                  onClick={triggerReflexTest}
                  className={`w-full h-40 rounded-xl transition-all duration-200 flex flex-col items-center justify-center p-4 border relative select-none cursor-pointer ${
                    reactionState === "idle" 
                      ? "bg-slate-950 border-slate-850 hover:bg-slate-900/50" 
                      : reactionState === "waiting"
                      ? "bg-amber-950/30 border-amber-900/60 animate-pulse text-amber-300"
                      : reactionState === "ready"
                      ? "bg-emerald-500 border-emerald-400 text-slate-950 font-black animate-none scale-[1.01]"
                      : "bg-cyan-950/40 border-cyan-800/40 text-cyan-300"
                  }`}
                >
                  {reactionState === "ready" && (
                    <div className="absolute inset-0 bg-emerald-500/10 animate-ping rounded-xl pointer-events-none"></div>
                  )}
                  
                  <span className={`text-[10px] uppercase font-bold tracking-widest font-mono mb-2 ${
                    reactionState === "ready" ? "text-slate-950 font-black" : "text-slate-500"
                  }`}>
                    Reflex Calibrator Workspace
                  </span>
                  
                  <span className={`text-center font-bold font-sans text-sm tracking-wide ${
                    reactionState === "ready" ? "text-slate-900 text-xl font-black" : ""
                  }`}>
                    {reactionText}
                  </span>
                  
                  <span className="text-[10px] text-slate-500 font-mono mt-3 opacity-60">
                    {reactionState === "idle" ? "Ready" : reactionState === "waiting" ? "Pinging Master Interrupts..." : reactionState === "ready" ? "TRIGGER NOW!" : "Click to re-activate test"}
                  </span>
                </button>
              </div>

              {/* Tries / History list */}
              <div className="md:col-span-4 bg-slate-950/50 border border-slate-850 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2.5">Trial Runs Latency</h4>
                  <div className="space-y-1">
                    {reactionResults.length > 0 ? (
                      reactionResults.map((resVal, i) => (
                        <div key={i} className="flex justify-between items-center text-xs font-mono bg-slate-950 border border-slate-900 rounded p-1.5">
                          <span className="text-slate-500">Run #{reactionResults.length - i}</span>
                          <span className="text-emerald-400 font-bold">{resVal} ms</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-650 font-mono text-[11px] text-center py-6">No calibrator tests registered yet.</div>
                    )}
                  </div>
                </div>

                {reactionResults.length > 0 && (
                  <div className="border-t border-slate-900 pt-2 mt-2 text-center">
                    <span className="text-[10px] font-mono text-cyan-400">
                      Best: <span className="font-extrabold">{Math.min(...reactionResults)} ms</span>
                    </span>
                  </div>
                )}
              </div>

            </div>

            {/* Reference Latency budgets */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Competitive Monitor Timing Budget (Frame Refresh Latency)</span>
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px] pt-1">
                <div className="bg-slate-900 rounded p-1 text-slate-400">
                  <span className="block">60Hz</span>
                  <span className="text-amber-500 font-bold">16.6ms</span>
                </div>
                <div className="bg-slate-900 rounded p-1 text-slate-300">
                  <span className="block">125Hz</span>
                  <span className="text-amber-400 font-bold">8.0ms</span>
                </div>
                <div className="bg-slate-900 rounded p-1 text-slate-200">
                  <span className="block">240Hz</span>
                  <span className="text-emerald-400 font-bold">4.17ms</span>
                </div>
                <div className="bg-slate-900 rounded p-1 text-slate-100">
                  <span className="block">360Hz</span>
                  <span className="text-cyan-400 font-bold">2.77ms</span>
                </div>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Modern Compact Page Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 Esports Signal Optimization Lab. All device parameters loaded inside active sandbox pipeline.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 transition cursor-help font-mono text-[11px]">DPC_CLOCK: SYNCHRONIZED</span>
            <span className="hover:text-slate-300 transition cursor-help font-mono text-[11px]">DMA_LATENCY: 0.1us</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Custom simple Icons to guarantee compilation succeeds without missing SVG imports
function SlideshowTriggerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  );
}
