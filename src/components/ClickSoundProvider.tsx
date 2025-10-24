import React, { PropsWithChildren, useEffect, useRef } from "react";

/**
 * ClickSoundProvider
 * - Adds playful hover sounds on mouseenter for interactive elements
 * - Targets: a[href], button, [role=button], [data-hover-sound]
 * - Opt-out: add data-no-hover-sound to any element
 * - Custom sounds: add data-sound="pop" | "blip" | "boop" | "tweet"
 */
export type ClickSoundProviderProps = {
  volume?: number; // 0.0 - 1.0
  enabled?: boolean;
};

type SoundType = 'default' | 'pop' | 'blip' | 'boop' | 'tweet';

export const ClickSoundProvider: React.FC<PropsWithChildren<ClickSoundProviderProps>> = ({
  children,
  volume = 0.2,
  enabled = true,
}) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Different sound generators for variety
  const playSound = (ctx: AudioContext, type: SoundType, vol: number) => {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Add slight randomization to pitch for organic feel
    const pitchVariation = 0.95 + Math.random() * 0.1;

    switch (type) {
      case 'pop':
        // Quick pop sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 * pitchVariation, now);
        osc.frequency.exponentialRampToValueAtTime(150 * pitchVariation, now + 0.05);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.stop(now + 0.05);
        break;

      case 'blip':
        // Short blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 * pitchVariation, now);
        gain.gain.setValueAtTime(vol * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.stop(now + 0.03);
        break;

      case 'boop':
        // Playful boop
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 * pitchVariation, now);
        osc.frequency.setValueAtTime(600 * pitchVariation, now + 0.04);
        gain.gain.setValueAtTime(vol * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.stop(now + 0.08);
        break;

      case 'tweet':
        // Bird-like chirp (for social links)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 * pitchVariation, now);
        osc.frequency.exponentialRampToValueAtTime(1600 * pitchVariation, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(1200 * pitchVariation, now + 0.08);
        gain.gain.setValueAtTime(vol * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.stop(now + 0.1);
        break;

      default:
        // Default UI click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440 * pitchVariation, now);
        osc.frequency.exponentialRampToValueAtTime(660 * pitchVariation, now + 0.08);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(vol, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.stop(now + 0.08);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
  };

  useEffect(() => {
    if (!enabled) return;

    const handler = (e: Event) => {
      const target = e.target as Element | null;
      if (!target) return;

      // skip if explicitly disabled
      if ((target as HTMLElement).closest('[data-no-hover-sound]')) return;

      // play if any of these interactive elements were the target or ancestor
      const interactive = (target as HTMLElement).closest(
        'a[href], button, [role="button"], [data-hover-sound]'
      );

      if (!interactive) return;

      // Lazily create AudioContext to avoid autoplay restrictions until first user gesture
      if (!audioCtxRef.current) {
        try {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch {
          // Audio not supported, silently ignore
          return;
        }
      }

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // Check for custom sound type
      const soundType = (interactive.getAttribute('data-sound') as SoundType) || 'default';
      
      // Auto-detect social media links for special sounds
      const href = interactive.getAttribute('href') || '';
      let finalSound = soundType;
      
      if (soundType === 'default') {
        if (href.includes('twitter.com') || href.includes('x.com')) {
          finalSound = 'tweet';
        } else if (href.includes('github.com')) {
          finalSound = 'boop';
        } else {
          finalSound = 'blip'; // subtle blip for other links
        }
      }

      const v = Math.max(0, Math.min(1, volume));
      playSound(ctx, finalSound, v);
    };

    // Use mouseenter for hover sounds
    document.addEventListener('mouseenter', handler, { capture: true, passive: true } as AddEventListenerOptions);
    return () => document.removeEventListener('mouseenter', handler, { capture: true } as AddEventListenerOptions);
  }, [enabled, volume]);

  return <>{children}</>;
};
