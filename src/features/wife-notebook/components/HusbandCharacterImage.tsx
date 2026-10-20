import React from 'react';

export type HusbandMood = 'confident' | 'surprised' | 'nervous' | 'broken';

interface HusbandCharacterImageProps {
  mood: HusbandMood;
  size?: number;
  className?: string;
}

/**
 * Interactive SVG Character Portrait for Husband Hoàng.
 * Renders distinct expressive vector artwork for each confrontation state:
 * - confident: Smug half-smile, sharp eyes, sleek hair, navy blazer, cool blue/slate aura.
 * - surprised: Wide eyes, raised eyebrows, open mouth, defensive hand, amber aura, sweat drop.
 * - nervous: Gritted teeth, hand scratching head, flying sweat beads, orange/amber aura.
 * - broken: Bowed head, tearful closed eyes, hands clasped apologetically, deep rose/purple aura.
 *
 * Strict invariants:
 * - 100% Vector SVG, zero emojis, zero external image downloads.
 * - Responsive and crisp at all DPIs.
 */
export const HusbandCharacterImage: React.FC<HusbandCharacterImageProps> = ({
  mood,
  size = 140,
  className = '',
}) => {
  const moodDescriptions: Record<HusbandMood, string> = {
    confident: 'Hoàng khoanh tay, tự tin chối quanh',
    surprised: 'Hoàng giật mình, phân bua',
    nervous: 'Hoàng toát mồ hôi, gãi đầu bao biện',
    broken: 'Hoàng cúi đầu, chắp tay nhận tội',
  };

  return (
    <div
      role="img"
      aria-label={moodDescriptions[mood]}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-2xl transition-transform duration-300"
      >
        <defs>
          {/* Background Gradients */}
          <linearGradient id="bg-confident" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="bg-surprised" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="bg-nervous" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
          <linearGradient id="bg-broken" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#831843" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Skin Gradients */}
          <linearGradient id="skin-light" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fba66c" />
          </linearGradient>
          <linearGradient id="skin-blush" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#f87171" />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id="hair-dark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Aura Rings */}
          <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Aura Frame */}
        <circle
          cx="100"
          cy="100"
          r="94"
          fill={`url(#bg-${mood})`}
          stroke={
            mood === 'confident'
              ? '#38bdf8'
              : mood === 'surprised'
              ? '#facc15'
              : mood === 'nervous'
              ? '#fb923c'
              : '#f43f5e'
          }
          strokeWidth="3.5"
          filter="url(#glow-effect)"
        />

        {/* Clip Path for Inner Character */}
        <clipPath id="circle-clip">
          <circle cx="100" cy="100" r="92" />
        </clipPath>

        <g clipPath="url(#circle-clip)">
          {/* Spotlight Backing */}
          <circle
            cx="100"
            cy="70"
            r="65"
            fill={
              mood === 'confident'
                ? 'rgba(56, 189, 248, 0.15)'
                : mood === 'surprised'
                ? 'rgba(250, 204, 21, 0.18)'
                : mood === 'nervous'
                ? 'rgba(251, 146, 60, 0.2)'
                : 'rgba(244, 63, 94, 0.2)'
            }
          />

          {/* Torso / Blazer */}
          <path
            d="M 45 200 L 55 145 Q 100 135 145 145 L 155 200 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Shirt Collar & Tie */}
          <path d="M 85 142 L 100 165 L 115 142 Z" fill="#f8fafc" />
          {mood !== 'broken' ? (
            <path
              d="M 97 155 L 103 155 L 106 195 L 100 200 L 94 195 Z"
              fill={mood === 'confident' ? '#0284c7' : '#e11d48'}
            />
          ) : (
            /* Disheveled Tie for Broken state */
            <path d="M 95 158 L 102 155 L 112 195 L 105 198 L 97 195 Z" fill="#9f1239" />
          )}

          {/* Neck */}
          <rect x="88" y="115" width="24" height="30" rx="4" fill="url(#skin-light)" />

          {/* Head Base */}
          {mood === 'broken' ? (
            /* Bowed head lowered */
            <ellipse cx="100" cy="102" rx="34" ry="38" fill="url(#skin-light)" />
          ) : (
            <ellipse cx="100" cy="94" rx="34" ry="38" fill="url(#skin-light)" />
          )}

          {/* Ears */}
          <circle cx={mood === 'broken' ? 65 : 64} cy={mood === 'broken' ? 104 : 95} r="7" fill="#fba66c" />
          <circle cx={mood === 'broken' ? 135 : 136} cy={mood === 'broken' ? 104 : 95} r="7" fill="#fba66c" />

          {/* Hair */}
          {mood === 'broken' ? (
            /* Disheveled, drooped hair */
            <path
              d="M 64 95 Q 60 62 100 58 Q 140 62 136 95 Q 128 72 100 70 Q 72 72 64 95 Z"
              fill="url(#hair-dark)"
            />
          ) : mood === 'nervous' ? (
            /* Messy, ruffled hair */
            <path
              d="M 64 90 Q 56 50 100 48 Q 144 50 136 90 Q 125 66 100 66 Q 75 66 64 90 Z"
              fill="url(#hair-dark)"
            />
          ) : (
            /* Sleek stylish hair */
            <path
              d="M 64 88 Q 62 54 100 52 Q 138 54 136 88 Q 124 64 100 64 Q 76 64 64 88 Z"
              fill="url(#hair-dark)"
            />
          )}

          {/* Facial Features per Mood */}
          {mood === 'confident' && (
            <g id="features-confident">
              {/* Sharp confident eyebrows */}
              <path d="M 76 83 Q 86 78 94 82" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 106 82 Q 114 78 124 83" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Calm, smug eyes */}
              <circle cx="85" cy="92" r="3.5" fill="#0f172a" />
              <circle cx="115" cy="92" r="3.5" fill="#0f172a" />
              <circle cx="86" cy="90.5" r="1" fill="#ffffff" />
              <circle cx="116" cy="90.5" r="1" fill="#ffffff" />

              {/* Nose */}
              <path d="M 100 90 L 98 103 L 102 103" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Smug, confident half-smile */}
              <path d="M 88 116 Q 100 122 114 113" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {mood === 'surprised' && (
            <g id="features-surprised">
              {/* Raised arched eyebrows */}
              <path d="M 74 76 Q 85 70 95 76" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 105 76 Q 115 70 126 76" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Wide open eyes */}
              <ellipse cx="85" cy="88" rx="6" ry="7" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="85" cy="88" r="3" fill="#0f172a" />
              <ellipse cx="115" cy="88" rx="6" ry="7" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <circle cx="115" cy="88" r="3" fill="#0f172a" />

              {/* Nose */}
              <path d="M 100 87 L 97 101 L 103 101" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Open stammering mouth "O" */}
              <ellipse cx="100" cy="116" rx="6" ry="8" fill="#991b1b" stroke="#0f172a" strokeWidth="2" />

              {/* Single sweat drop */}
              <path d="M 126 75 C 126 75 132 84 132 87 C 132 90 129 92 126 92 C 123 92 120 90 120 87 C 120 84 126 75 126 75 Z" fill="#38bdf8" />
            </g>
          )}

          {mood === 'nervous' && (
            <g id="features-nervous">
              {/* Angled worried eyebrows */}
              <path d="M 75 80 Q 86 84 94 78" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 106 78 Q 114 84 125 80" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Squinting nervous eyes */}
              <path d="M 78 88 Q 85 82 92 88" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="85" cy="89" r="2.5" fill="#0f172a" />
              <path d="M 108 88 Q 115 82 122 88" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="115" cy="89" r="2.5" fill="#0f172a" />

              {/* Nose */}
              <path d="M 100 87 L 97 101 L 103 101" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Gritted teeth awkward grimace */}
              <rect x="88" y="112" width="24" height="9" rx="4.5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              <line x1="94" y1="112" x2="94" y2="121" stroke="#94a3b8" strokeWidth="1" />
              <line x1="100" y1="112" x2="100" y2="121" stroke="#94a3b8" strokeWidth="1" />
              <line x1="106" y1="112" x2="106" y2="121" stroke="#94a3b8" strokeWidth="1" />

              {/* Multiple sweat drops running down face */}
              <path d="M 68 76 C 68 76 72 83 72 85 C 72 87 70 89 68 89 C 66 89 64 87 64 85 C 64 83 68 76 68 76 Z" fill="#38bdf8" />
              <path d="M 130 84 C 130 84 135 93 135 96 C 135 99 133 101 130 101 C 127 101 125 99 125 96 C 125 93 130 84 130 84 Z" fill="#38bdf8" />
              <path d="M 122 108 C 122 108 126 114 126 116 C 126 118 124 120 122 120 C 120 120 118 118 118 116 C 118 114 122 108 122 108 Z" fill="#38bdf8" />

              {/* Hand scratching head behind ear */}
              <path d="M 134 76 Q 146 70 144 85 Q 138 88 134 82 Z" fill="#fba66c" stroke="#ea580c" strokeWidth="1.5" />
            </g>
          )}

          {mood === 'broken' && (
            <g id="features-broken">
              {/* Slanted sad defeated eyebrows */}
              <path d="M 76 90 Q 86 94 94 99" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 106 99 Q 114 94 124 90" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Squeezed shut crying eyes */}
              <path d="M 78 102 Q 85 96 92 102" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 108 102 Q 115 96 122 102" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Tears flowing down cheeks */}
              <path d="M 85 102 C 85 102 83 118 81 122 C 79 124 83 126 85 125 C 87 124 87 120 87 102 Z" fill="#60a5fa" opacity="0.85" />
              <path d="M 115 102 C 115 102 117 118 119 122 C 121 124 117 126 115 125 C 113 124 113 120 113 102 Z" fill="#60a5fa" opacity="0.85" />

              {/* Flushed red cheeks & nose */}
              <circle cx="76" cy="112" r="8" fill="url(#skin-blush)" opacity="0.6" />
              <circle cx="124" cy="112" r="8" fill="url(#skin-blush)" opacity="0.6" />
              <ellipse cx="100" cy="106" rx="4" ry="3" fill="#f43f5e" opacity="0.5" />

              {/* Sad, trembling downturned mouth */}
              <path d="M 91 122 Q 100 115 109 122" stroke="#991b1b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* Hands clasped in apologetic prayer gesture */}
              <g id="clasped-hands">
                <path d="M 93 175 Q 100 155 107 175 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
                <path d="M 88 178 Q 100 162 112 178 Z" fill="#fba66c" stroke="#ea580c" strokeWidth="1" />
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
