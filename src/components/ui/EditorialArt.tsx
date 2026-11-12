import React from 'react';

// Little doodle stars seen across top and background of screens
export const DoodleStar: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-[#FFCB45]' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="#171717" strokeWidth="2" strokeLinejoin="round" className={className}>
    <path d="M12 2L14.4 8.6L21.5 9.2L16.2 13.8L17.8 20.8L12 17.2L6.2 20.8L7.8 13.8L2.5 9.2L9.6 8.6L12 2Z" />
  </svg>
);

// Clapperboard doodle with yellow and black hatch
export const ClapperboardDoodle: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="16" width="40" height="26" rx="4" fill="#FFFFFF" stroke="#171717" strokeWidth="2.5" />
    <path d="M4 16L38 8L44 16H4Z" fill="#171717" stroke="#171717" strokeWidth="2.5" />
    <path d="M11 15L16 9" stroke="#FF704D" strokeWidth="3" strokeLinecap="round" />
    <path d="M21 13L26 7" stroke="#FFCB45" strokeWidth="3" strokeLinecap="round" />
    <path d="M31 11L36 5" stroke="#FFA6BA" strokeWidth="3" strokeLinecap="round" />
    <rect x="12" y="24" width="24" height="10" rx="2" fill="#FFF8E9" stroke="#171717" strokeWidth="2" />
    <circle cx="24" cy="29" r="3" fill="#FF704D" />
  </svg>
);

// Film Reel icon
export const FilmReelIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="20" fill="#171717" stroke="#171717" strokeWidth="2.5" />
    <circle cx="24" cy="24" r="17" fill="#FFA6BA" stroke="#171717" strokeWidth="2" />
    <circle cx="24" cy="24" r="7" fill="#171717" />
    <circle cx="24" cy="24" r="4" fill="#FFFFFF" />
    <circle cx="24" cy="11" r="3.5" fill="#171717" />
    <circle cx="24" cy="37" r="3.5" fill="#171717" />
    <circle cx="11" cy="24" r="3.5" fill="#171717" />
    <circle cx="37" cy="24" r="3.5" fill="#171717" />
  </svg>
);

// Charminar / Hyderabad Silhouette in sketch style
export const CharminarSketch: React.FC<{ className?: string }> = ({ className = 'w-full h-16 opacity-35' }) => (
  <svg viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
    <path d="M10 80V60H30V80M290 80V60H310V80" stroke="#171717" strokeWidth="2" />
    {/* Arch & Minarets */}
    <path d="M120 80V40H110V20L115 10L120 20V40H140V80" stroke="#171717" strokeWidth="2" fill="#FFF8E9" />
    <path d="M180 80V40H200V20L205 10L210 20V40H190V80" stroke="#171717" strokeWidth="2" fill="#FFF8E9" />
    <path d="M140 50C140 35 180 35 180 50V80H140V50Z" stroke="#171717" strokeWidth="2" fill="#FFE082" />
    <path d="M60 80V50H80V80M240 80V50H260V80" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

// Popcorn with cool sunglasses illustration
export const PopcornEmojiIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Popcorn bucket */}
    <path d="M12 20L15 44H33L36 20H12Z" fill="#FFA6BA" stroke="#171717" strokeWidth="2.5" />
    <path d="M18 20V44M24 20V44M30 20V44" stroke="#FFFFFF" strokeWidth="3" />
    <path d="M18 20V44M24 20V44M30 20V44" stroke="#171717" strokeWidth="1" />
    {/* Popcorn puffs */}
    <circle cx="15" cy="16" r="6" fill="#FFCB45" stroke="#171717" strokeWidth="2" />
    <circle cx="24" cy="13" r="7" fill="#FFF8E9" stroke="#171717" strokeWidth="2" />
    <circle cx="33" cy="16" r="6" fill="#FFCB45" stroke="#171717" strokeWidth="2" />
    {/* Sunglasses on popcorn */}
    <rect x="17" y="26" width="6" height="5" rx="1.5" fill="#171717" />
    <rect x="25" y="26" width="6" height="5" rx="1.5" fill="#171717" />
    <path d="M23 28H25" stroke="#171717" strokeWidth="2" />
  </svg>
);

// Hero with sunglasses in red shirt (as in prompt reference splash)
export const TeluguHeroSplash: React.FC<{ className?: string }> = ({ className = 'w-44 h-44' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Charminar background hint */}
    <path d="M20 160V120H30V100L35 90L40 100V120H50V160" stroke="#171717" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
    <path d="M110 160V120H120V100L125 90L130 100V120H140V160" stroke="#171717" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
    
    {/* Body / Red Shirt */}
    <path d="M42 160L46 128C46 114 62 108 80 108C98 108 114 114 114 128L118 160H42Z" fill="#FF704D" stroke="#171717" strokeWidth="3" />
    {/* Open Collar */}
    <path d="M72 108L80 126L88 108" fill="#FFF8E9" stroke="#171717" strokeWidth="2.5" />
    <path d="M60 108L72 120M100 108L88 120" stroke="#171717" strokeWidth="2.5" />
    {/* Gold Chain */}
    <path d="M74 122C76 128 84 128 86 122" stroke="#FFCB45" strokeWidth="3" strokeLinecap="round" />

    {/* Neck & Head */}
    <rect x="72" y="94" width="16" height="18" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
    <circle cx="80" cy="74" r="26" fill="#FAD0B1" stroke="#171717" strokeWidth="3" />

    {/* Wavy Hair */}
    <path d="M52 74C50 50 64 42 80 42C96 42 110 50 108 74C108 62 94 48 80 48C66 48 54 62 52 74Z" fill="#171717" stroke="#171717" strokeWidth="3" />
    <path d="M54 58C60 48 72 44 80 46" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

    {/* Cool Sunglasses */}
    <rect x="62" y="66" width="16" height="11" rx="3" fill="#171717" stroke="#171717" strokeWidth="2" />
    <rect x="82" y="66" width="16" height="11" rx="3" fill="#171717" stroke="#171717" strokeWidth="2" />
    <path d="M78 70H82" stroke="#171717" strokeWidth="3" />
    <path d="M64 68L70 74M84 68L90 74" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

    {/* Mustache and Confident Grin */}
    <path d="M70 85C74 83 86 83 90 85C88 88 72 88 70 85Z" fill="#171717" />
    <path d="M72 89C76 93 84 93 88 89" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
    {/* Stubble */}
    <path d="M66 84C66 98 94 98 94 84" stroke="#171717" strokeWidth="2" strokeDasharray="2 3" />
  </svg>
);

// Hero and Heroine Celebrating (Reference Home Hero banner)
export const CinemaCoupleHero: React.FC<{ className?: string }> = ({ className = 'w-full h-36' }) => (
  <svg viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Charminar sketched backdrop */}
    <path d="M15 120V70H25V55L30 45L35 55V70H45V120" stroke="#171717" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
    
    {/* Left Guy: Red shirt & sunglasses */}
    <path d="M75 120L78 95C78 85 92 80 105 80C118 80 132 85 132 95L135 120H75Z" fill="#FF704D" stroke="#171717" strokeWidth="2.5" />
    <circle cx="105" cy="56" r="18" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
    <path d="M86 56C84 40 94 34 105 34C116 34 126 40 124 56C124 48 114 38 105 38C96 38 88 48 86 56Z" fill="#171717" />
    {/* Sunglasses */}
    <rect x="94" y="52" width="10" height="7" rx="2" fill="#171717" />
    <rect x="107" y="52" width="10" height="7" rx="2" fill="#171717" />
    <path d="M104 55H107" stroke="#171717" strokeWidth="2" />
    <path d="M99 68C103 72 108 72 112 68" stroke="#171717" strokeWidth="2" strokeLinecap="round" />

    {/* Right Girl: Flowing dark hair & smiling */}
    <path d="M145 120L148 98C148 88 160 84 172 84C184 84 196 88 196 98L199 120H145Z" fill="#88D49E" stroke="#171717" strokeWidth="2.5" />
    {/* Long hair background */}
    <path d="M152 58C148 75 150 100 156 108M192 58C196 75 194 100 188 108" stroke="#171717" strokeWidth="4" strokeLinecap="round" />
    <circle cx="172" cy="58" r="17" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
    <path d="M156 56C156 42 164 36 172 36C180 36 188 42 188 56C185 45 180 40 172 40C164 40 159 45 156 56Z" fill="#171717" />
    {/* Bindi, Eyes & Smile */}
    <circle cx="172" cy="51" r="1.5" fill="#FF704D" />
    <path d="M164 55C166 54 168 54 170 56M174 56C176 54 178 54 180 55" stroke="#171717" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M166 65C170 70 174 70 178 65" stroke="#171717" strokeWidth="2" strokeLinecap="round" />
    {/* Earring */}
    <circle cx="155" cy="62" r="2" fill="#FFCB45" stroke="#171717" strokeWidth="1" />

    {/* Sparkles / Cinema joy */}
    <path d="M220 30L224 40L234 44L224 48L220 58L216 48L206 44L216 40L220 30Z" fill="#FFCB45" stroke="#171717" strokeWidth="1.5" />
    <path d="M50 35L53 43L61 46L53 49L50 57L47 49L39 46L47 43L50 35Z" fill="#FFA6BA" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

// Forehead Player Icon (Hands holding phone on forehead)
export const ForeheadPlayerIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="28" r="14" fill="#FAD0B1" stroke="#171717" strokeWidth="2" />
    <path d="M10 24C10 16 16 10 24 10C32 10 38 16 38 24" fill="#171717" />
    {/* Phone on forehead */}
    <rect x="14" y="6" width="20" height="12" rx="2" fill="#B3D4FC" stroke="#171717" strokeWidth="2.5" />
    <circle cx="24" cy="12" r="2" fill="#FF704D" />
    {/* Hands holding the sides of phone */}
    <path d="M10 14C11 11 13 8 15 8V16C13 16 11 15 10 14Z" fill="#FAD0B1" stroke="#171717" strokeWidth="1.5" />
    <path d="M38 14C37 11 35 8 33 8V16C35 16 37 15 38 14Z" fill="#FAD0B1" stroke="#171717" strokeWidth="1.5" />
  </svg>
);

// Hands holding phone landscape (Reference screen 5 "Head Set Go")
export const HeadSetGoForeheadIllustration: React.FC<{ movieName: string; className?: string }> = ({ movieName, className = 'w-full' }) => (
  <div className={`relative flex items-center justify-center py-4 ${className}`}>
    {/* Left Hand */}
    <div className="absolute left-1 z-10 w-16 h-28 pointer-events-none">
      <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M5 100V50C5 35 20 20 40 20H55V85C40 85 25 90 5 100Z" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
        <rect x="42" y="15" width="16" height="30" rx="6" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
        <rect x="42" y="45" width="16" height="20" rx="5" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
      </svg>
    </div>

    {/* Center Phone Display */}
    <div className="w-[84%] max-w-sm h-36 bg-[#B3D4FC] border-3 border-[#171717] rounded-2xl shadow-[4px_4px_0_#171717] flex flex-col items-center justify-center px-4 relative z-0">
      <div className="w-8 h-2 bg-[#171717] rounded-full mb-2 opacity-30" />
      <span className="text-2xl sm:text-3xl font-black text-[#171717] tracking-wider uppercase text-center">
        {movieName}
      </span>
      <div className="absolute bottom-2 text-[10px] font-black uppercase text-[#171717]/60">
        Tap below or tilt device
      </div>
    </div>

    {/* Right Hand */}
    <div className="absolute right-1 z-10 w-16 h-28 pointer-events-none transform -scale-x-100">
      <svg viewBox="0 0 60 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M5 100V50C5 35 20 20 40 20H55V85C40 85 25 90 5 100Z" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
        <rect x="42" y="15" width="16" height="30" rx="6" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
        <rect x="42" y="45" width="16" height="20" rx="5" fill="#FAD0B1" stroke="#171717" strokeWidth="2.5" />
      </svg>
    </div>
  </div>
);

// Dumb Charades mime silhouette
export const MimeActorIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-36' }) => (
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Silhouette in iconic mime action pose */}
    <circle cx="60" cy="24" r="12" fill="#171717" />
    <path d="M60 36V70M60 70L45 105M60 70L75 105" stroke="#171717" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    {/* Bent dramatic arms */}
    <path d="M60 45L35 35L22 48" stroke="#171717" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M60 45L85 35L98 22" stroke="#171717" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Wooden Auction Gavel
export const WoodenGavelIllustration: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="18" y="8" width="12" height="18" rx="2" transform="rotate(45 18 8)" fill="#D97706" stroke="#171717" strokeWidth="2.5" />
    <line x1="24" y1="20" x2="38" y2="34" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
    <line x1="24" y1="20" x2="38" y2="34" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="8" y="38" width="32" height="6" rx="2" fill="#FFCB45" stroke="#171717" strokeWidth="2.5" />
  </svg>
);
