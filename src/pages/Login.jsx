import { useState } from 'react';
import './Login.css';
import titanLogo from '../assets/TITAN LOGO without BG.png';

/* ══════════════════════════════════════════════════
   SHARED SVG ASSETS
══════════════════════════════════════════════════ */

function ShieldLogo() {
  return (
    <img
      src={titanLogo}
      alt="Titan Learning System Logo"
      className="login-logo-img"
    />
  );
}

function BuildingsBg() {
  return (
    <svg className="login-buildings" viewBox="0 0 400 190" fill="none"
      preserveAspectRatio="xMidYMax meet">
      <rect x="0"   y="75"  width="52" height="115" fill="rgba(255,255,255,0.06)" />
      <rect x="6"   y="86"  width="9"  height="9"   fill="rgba(255,255,255,0.13)" />
      <rect x="20"  y="86"  width="9"  height="9"   fill="rgba(255,255,255,0.10)" />
      <rect x="34"  y="86"  width="9"  height="9"   fill="rgba(255,255,255,0.13)" />
      <rect x="6"   y="101" width="9"  height="9"   fill="rgba(255,255,255,0.08)" />
      <rect x="20"  y="101" width="9"  height="9"   fill="rgba(255,255,255,0.15)" />
      <rect x="34"  y="101" width="9"  height="9"   fill="rgba(255,255,255,0.08)" />
      <rect x="6"   y="116" width="9"  height="9"   fill="rgba(255,255,255,0.12)" />
      <rect x="34"  y="116" width="9"  height="9"   fill="rgba(255,255,255,0.12)" />

      <rect x="58"  y="44"  width="40" height="146" fill="rgba(255,255,255,0.04)" />
      <rect x="64"  y="55"  width="7"  height="7"   fill="rgba(255,255,255,0.10)" />
      <rect x="76"  y="55"  width="7"  height="7"   fill="rgba(255,255,255,0.10)" />
      <rect x="88"  y="55"  width="7"  height="7"   fill="rgba(255,255,255,0.10)" />
      <rect x="64"  y="67"  width="7"  height="7"   fill="rgba(255,255,255,0.10)" />
      <rect x="76"  y="67"  width="7"  height="7"   fill="rgba(255,255,255,0.07)" />
      <rect x="88"  y="67"  width="7"  height="7"   fill="rgba(255,255,255,0.10)" />
      <rect x="64"  y="79"  width="7"  height="7"   fill="rgba(255,255,255,0.07)" />
      <rect x="88"  y="79"  width="7"  height="7"   fill="rgba(255,255,255,0.10)" />

      <rect x="280" y="56"  width="58" height="134" fill="rgba(255,255,255,0.06)" />
      <rect x="287" y="68"  width="10" height="10"  fill="rgba(255,255,255,0.12)" />
      <rect x="303" y="68"  width="10" height="10"  fill="rgba(255,255,255,0.12)" />
      <rect x="319" y="68"  width="10" height="10"  fill="rgba(255,255,255,0.12)" />
      <rect x="287" y="84"  width="10" height="10"  fill="rgba(255,255,255,0.08)" />
      <rect x="303" y="84"  width="10" height="10"  fill="rgba(255,255,255,0.14)" />
      <rect x="319" y="84"  width="10" height="10"  fill="rgba(255,255,255,0.08)" />

      <rect x="344" y="86"  width="56" height="104" fill="rgba(255,255,255,0.04)" />
      <rect x="350" y="97"  width="8"  height="8"   fill="rgba(255,255,255,0.10)" />
      <rect x="363" y="97"  width="8"  height="8"   fill="rgba(255,255,255,0.10)" />
      <rect x="376" y="97"  width="8"  height="8"   fill="rgba(255,255,255,0.10)" />
      <rect x="350" y="111" width="8"  height="8"   fill="rgba(255,255,255,0.07)" />
      <rect x="376" y="111" width="8"  height="8"   fill="rgba(255,255,255,0.10)" />

      <rect x="0" y="188" width="400" height="2" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

function StudentIllustration() {
  return (
    <svg width="210" height="190" viewBox="0 0 210 190" fill="none">
      <ellipse cx="105" cy="183" rx="60" ry="7" fill="rgba(0,0,0,0.20)" />

      {/* Laptop base */}
      <rect x="48" y="152" width="114" height="7" rx="3.5" fill="#0d2254" />
      {/* Laptop body */}
      <rect x="52" y="110" width="106" height="45" rx="5" fill="#1e3a8a" />
      <rect x="56" y="113" width="98"  height="37" rx="3" fill="#2563eb" />
      <rect x="59" y="116" width="92"  height="31" rx="2" fill="#3b82f6" />
      {/* Screen content */}
      <rect x="63" y="120" width="52" height="5" rx="2.5" fill="rgba(255,255,255,0.38)" />
      <rect x="63" y="129" width="36" height="3.5" rx="1.5" fill="rgba(255,255,255,0.22)" />
      <rect x="63" y="136" width="46" height="3.5" rx="1.5" fill="rgba(255,255,255,0.22)" />
      <rect x="63" y="143" width="28" height="3.5" rx="1.5" fill="rgba(255,255,255,0.16)" />
      {/* Widget on screen */}
      <rect x="124" y="120" width="22" height="22" rx="4" fill="rgba(243,198,35,0.28)" />
      <rect x="128" y="124" width="14" height="3" rx="1.5" fill="rgba(243,198,35,0.7)" />
      <rect x="128" y="130" width="10" height="3" rx="1.5" fill="rgba(243,198,35,0.5)" />
      <rect x="128" y="136" width="12" height="3" rx="1.5" fill="rgba(243,198,35,0.6)" />

      {/* Legs cross-legged */}
      <path d="M68 145 Q82 164 105 158 Q128 164 142 145 Q134 137 105 141 Q76 137 68 145Z"
        fill="#1d4ed8" />
      <path d="M76 160 Q90 172 105 169 Q120 172 134 160"
        stroke="#1e40af" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Torso */}
      <rect x="88" y="103" width="34" height="47" rx="12" fill="#2563eb" />
      <path d="M101 107 L105 114 L109 107"
        stroke="white" strokeWidth="1.4" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Arms */}
      <path d="M88 118 Q70 126 63 142" stroke="#f4c5a0" strokeWidth="11" strokeLinecap="round" />
      <path d="M122 118 Q140 126 147 142" stroke="#f4c5a0" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="66" cy="145" rx="8" ry="5" fill="#f0b98c" />
      <ellipse cx="148" cy="145" rx="8" ry="5" fill="#f0b98c" />

      {/* Neck */}
      <rect x="101" y="95" width="8" height="12" rx="4" fill="#f4c5a0" />

      {/* Head */}
      <circle cx="105" cy="82" r="22" fill="#f4c5a0" />

      {/* Hair */}
      <path d="M83 78 Q84 58 105 55 Q126 58 127 78 Q124 66 105 64 Q86 66 83 78Z"
        fill="#1a0a00" />
      <path d="M83 78 Q78 73 80 65 Q84 57 105 55 Q84 58 83 78Z" fill="#1a0a00" />
      <path d="M127 78 Q132 73 130 65 Q126 57 105 55 Q126 58 127 78Z" fill="#1a0a00" />

      {/* Ears */}
      <ellipse cx="83" cy="84" rx="4" ry="5" fill="#e8a87c" />
      <ellipse cx="127" cy="84" rx="4" ry="5" fill="#e8a87c" />

      {/* Eyes */}
      <ellipse cx="98"  cy="82" rx="3.5" ry="4" fill="white" />
      <ellipse cx="112" cy="82" rx="3.5" ry="4" fill="white" />
      <circle  cx="99"  cy="83" r="2.2" fill="#1a0a00" />
      <circle  cx="113" cy="83" r="2.2" fill="#1a0a00" />
      <circle  cx="99.8" cy="82.2" r="0.7" fill="white" />
      <circle  cx="113.8" cy="82.2" r="0.7" fill="white" />

      {/* Eyebrows */}
      <path d="M94 76 Q98 74 102 76" stroke="#1a0a00" strokeWidth="1.4"
        fill="none" strokeLinecap="round" />
      <path d="M108 76 Q112 74 116 76" stroke="#1a0a00" strokeWidth="1.4"
        fill="none" strokeLinecap="round" />

      {/* Smile */}
      <path d="M99 90 Q105 95 111 90"
        stroke="#c47a5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Headphones */}
      <path d="M83 80 Q83 62 105 60 Q127 62 127 80"
        stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="79" y="79" width="7" height="10" rx="3.5" fill="#1e3a8a" />
      <rect x="124" y="79" width="7" height="10" rx="3.5" fill="#1e3a8a" />
    </svg>
  );
}

function TeacherIllustration() {
  return (
    <svg width="210" height="190" viewBox="0 0 210 190" fill="none">
      <ellipse cx="105" cy="184" rx="56" ry="6" fill="rgba(0,0,0,0.18)" />

      {/* Whiteboard */}
      <rect x="22" y="24" width="82" height="62" rx="5" fill="rgba(255,255,255,0.15)" />
      <rect x="24" y="26" width="78" height="58" rx="4" fill="rgba(255,255,255,0.22)" />
      <rect x="30" y="33" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.65)" />
      <rect x="30" y="42" width="34" height="3.5" rx="1.5" fill="rgba(255,255,255,0.42)" />
      <rect x="30" y="50" width="48" height="3.5" rx="1.5" fill="rgba(255,255,255,0.42)" />
      <rect x="30" y="58" width="38" height="3.5" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="30" y="66" width="28" height="3.5" rx="1.5" fill="rgba(255,255,255,0.28)" />
      {/* Board stand */}
      <line x1="63" y1="86" x2="53" y2="115"
        stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinecap="round" />
      <line x1="63" y1="86" x2="73" y2="115"
        stroke="rgba(255,255,255,0.28)" strokeWidth="3" strokeLinecap="round" />
      <line x1="46" y1="115" x2="80" y2="115"
        stroke="rgba(255,255,255,0.20)" strokeWidth="2" strokeLinecap="round" />

      {/* Books stack (right side) */}
      <rect x="154" y="150" width="38" height="8" rx="2" fill="#1e3a8a" />
      <rect x="157" y="142" width="32" height="8" rx="2" fill="#2563eb" />
      <rect x="153" y="134" width="36" height="8" rx="2" fill="#1d4ed8" />
      <rect x="158" y="126" width="28" height="8" rx="2" fill="#1e3a8a" />

      {/* Legs */}
      <rect x="94"  y="150" width="14" height="36" rx="7" fill="#1e3a8a" />
      <rect x="112" y="150" width="14" height="36" rx="7" fill="#1e3a8a" />
      <ellipse cx="101" cy="186" rx="10" ry="5" fill="#111827" />
      <ellipse cx="119" cy="186" rx="10" ry="5" fill="#111827" />

      {/* Torso — suit jacket */}
      <rect x="86" y="106" width="48" height="50" rx="12" fill="#0A3D91" />
      {/* Lapels */}
      <path d="M108 110 L101 122 L108 127" fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      <path d="M118 110 L125 122 L118 127" fill="rgba(255,255,255,0.14)"
        stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      {/* Tie */}
      <path d="M110 113 L113 132 L116 113" fill="#F3C623" />
      <path d="M110.5 112 L113 115.5 L115.5 112" fill="#e6b820" />

      {/* Left arm — pointing at board */}
      <path d="M86 122 Q66 116 48 100" stroke="#f4c5a0" strokeWidth="11" strokeLinecap="round" />
      {/* Right arm — at side */}
      <path d="M134 122 Q148 132 152 146" stroke="#f4c5a0" strokeWidth="11" strokeLinecap="round" />
      {/* Hands */}
      <circle cx="47"  cy="99"  r="7" fill="#f0b98c" />
      <circle cx="153" cy="147" r="7" fill="#f0b98c" />
      {/* Pointer */}
      <line x1="41" y1="93" x2="30" y2="80"
        stroke="#6b3a00" strokeWidth="2.5" strokeLinecap="round" />

      {/* Neck */}
      <rect x="103" y="97" width="14" height="13" rx="6" fill="#f4c5a0" />

      {/* Head */}
      <circle cx="110" cy="84" r="22" fill="#f4c5a0" />

      {/* Hair */}
      <path d="M88 79 Q89 60 110 57 Q131 60 132 79 Q129 67 110 65 Q91 67 88 79Z"
        fill="#0f0600" />
      <path d="M88 79 Q84 74 86 66 Q89 58 110 57 Q89 60 88 79Z" fill="#0f0600" />
      <path d="M132 79 Q136 74 134 66 Q131 58 110 57 Q131 60 132 79Z" fill="#0f0600" />

      {/* Ears */}
      <ellipse cx="88"  cy="86" rx="4" ry="5" fill="#e8a87c" />
      <ellipse cx="132" cy="86" rx="4" ry="5" fill="#e8a87c" />

      {/* Glasses */}
      <circle cx="104" cy="84" r="8" fill="none" stroke="#1e3a8a" strokeWidth="2" />
      <circle cx="120" cy="84" r="8" fill="none" stroke="#1e3a8a" strokeWidth="2" />
      <line x1="112" y1="84" x2="114" y2="84" stroke="#1e3a8a" strokeWidth="1.8" />
      <line x1="96"  y1="84" x2="90"  y2="82" stroke="#1e3a8a" strokeWidth="1.8"
        strokeLinecap="round" />
      <line x1="128" y1="84" x2="134" y2="82" stroke="#1e3a8a" strokeWidth="1.8"
        strokeLinecap="round" />
      {/* Eyes behind glasses */}
      <circle cx="104" cy="84" r="2.5" fill="#1a0a00" />
      <circle cx="120" cy="84" r="2.5" fill="#1a0a00" />
      <circle cx="104.8" cy="83.2" r="0.7" fill="white" />
      <circle cx="120.8" cy="83.2" r="0.7" fill="white" />

      {/* Eyebrows */}
      <path d="M98 77 Q104 75 110 77"
        stroke="#0f0600" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M114 77 Q120 75 126 77"
        stroke="#0f0600" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Smile */}
      <path d="M105 93 Q110 97 115 93"
        stroke="#c47a5a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PlantIllustration() {
  return (
    <svg width="64" height="126" viewBox="0 0 64 126" fill="none">
      {/* Pot */}
      <path d="M14 94 L19 120 L45 120 L50 94Z" fill="#b45309" />
      <rect x="11" y="86" width="42" height="11" rx="4" fill="#92400e" />
      <ellipse cx="32" cy="86" rx="21" ry="5" fill="#2d1400" />
      {/* Stem */}
      <path d="M32 86 Q31 70 32 52 Q33 36 32 20"
        stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M32 76 Q14 66 11 50 Q28 59 32 74Z" fill="#15803d" />
      <path d="M32 76 Q50 66 53 50 Q36 59 32 74Z" fill="#16a34a" />
      <path d="M32 62 Q10 50 7 33 Q26 44 32 60Z" fill="#16a34a" />
      <path d="M32 62 Q54 50 57 33 Q38 44 32 60Z" fill="#15803d" />
      <path d="M32 48 Q13 37 10 19 Q28 31 32 46Z" fill="#22c55e" />
      <path d="M32 48 Q51 37 54 19 Q36 31 32 46Z" fill="#15803d" />
      {/* Top */}
      <path d="M32 20 Q29 8 24 2  Q34 12 32 18Z" fill="#22c55e" />
      <path d="M32 20 Q35 8 40 2  Q30 12 32 18Z" fill="#16a34a" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════ */
const PersonIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
    stroke="#9CA3AF" strokeWidth="2.2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const LockIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
    stroke="#9CA3AF" strokeWidth="2.2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EyeOpenIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
    stroke="#9CA3AF" strokeWidth="2.2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      strokeLinecap="round" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeClosedIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
    stroke="#9CA3AF" strokeWidth="2.2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
      strokeLinecap="round" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
      strokeLinecap="round" />
    <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
  </svg>
);
const TeacherUserIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24"
    stroke="currentColor" strokeWidth="2.2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
      strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
  </svg>
);

/* ══════════════════════════════════════════════════
   BLUE PANEL (shared, flips illustration by type)
══════════════════════════════════════════════════ */
function BluePanel({ isTeacher }) {
  return (
    <div className="login-left">
      {/* Decorative blobs */}
      <div className="lp-deco lp-deco-1" />
      <div className="lp-deco lp-deco-2" />
      <div className="lp-deco lp-deco-3" />
      <div className="lp-deco lp-deco-4" />
      <div className="lp-deco lp-deco-5" />
      <div className="lp-dots" />

      <BuildingsBg />

      {/* Brand + headings */}
      <div className="login-left-content">
        <div className="login-brand">
          <ShieldLogo />
          <div className="login-brand-text">
            <span className="login-brand-name">TITAN</span>
            <span className="login-brand-sub">LEARNING SYSTEM</span>
          </div>
        </div>
        <h2 className="login-welcome">
          {isTeacher ? 'Hello, Educator! 🎓' : 'Welcome Back! 👋'}
        </h2>
        <p className="login-subtitle">
          {isTeacher
            ? 'Empower students and shape the future through knowledge'
            : 'Begin to continue your learning journey today'}
        </p>
      </div>

      {/* Illustration with float + glow */}
      <div className="login-illustration-area">
        <div className="illustration-glow" />
        <div className="illustration-float">
          {isTeacher ? <TeacherIllustration /> : <StudentIllustration />}
        </div>
        <div className="plant-float">
          <PlantIllustration />
        </div>
      </div>

      {/* Footer */}
      <div className="login-left-footer">
        <svg viewBox="0 0 400 24" className="login-footer-wave"
          preserveAspectRatio="none" height="24">
          <path d="M0 24 Q200 0 400 24 L400 24 L0 24Z"
            fill="rgba(255,255,255,0.08)" />
        </svg>
        <div className="login-footer-inner">
          <p>© 2025 Titan Learning System. All rights reserved.</p>
          <div className="login-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0A3D91" />
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   FORM PANEL (shared by both views)
══════════════════════════════════════════════════ */
function FormPanel({ isTeacher, form, setForm, onSwitch, onLogin }) {
  const [activeTab,    setActiveTab]    = useState('login');
  const [showPass,     setShowPass]     = useState(false);
  const [showCrPass,   setShowCrPass]   = useState(false);
  const [createForm,   setCreateForm]   = useState({ cnic: '', dob: '', password: '' });

  const idLabel       = isTeacher ? 'Employee / Teacher ID'             : 'CNIC / Student ID';
  const idPlaceholder = isTeacher ? 'Enter your Employee or Teacher ID' : 'Enter your CNIC or Student ID';
  const loginTitle    = isTeacher ? 'Teacher Login'                     : 'Student Login';
  const switchLabel   = isTeacher ? 'Student Login'                     : 'Teacher Login';

  const handleLogin = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  const handleCreatePassword = (e) => {
    e.preventDefault();
    if (onLogin) onLogin();
  };

  return (
    <div className="login-right">
      {/* ── Tabs: Login | Create Password ── */}
      <div className="login-tabs">
        <button
          className={`login-tab${activeTab === 'login' ? ' active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`login-tab${activeTab === 'create-password' ? ' active' : ''}`}
          onClick={() => setActiveTab('create-password')}
        >
          Create Password
        </button>
      </div>

      <div className="login-form-container">

        {/* ════ LOGIN TAB ════ */}
        {activeTab === 'login' && (
          <div key="login" className="form-tab-content">
            <h3 className="login-form-title">{loginTitle}</h3>
            <p className="login-form-sub">Enter your credentials to access your account</p>

            <form onSubmit={handleLogin}>
              <div className="login-field-group">
                <label className="login-label">{idLabel}</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><PersonIcon /></span>
                  <input
                    type="text"
                    className="login-input"
                    placeholder={idPlaceholder}
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="login-field-group">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><LockIcon /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    autoComplete="current-password"
                  />
                  <button type="button" className="login-eye-btn"
                    onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>

              <div className="login-row-between">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                    className="login-checkbox"
                  />
                  <span>Remember Me</span>
                </label>
                <a href="#" className="login-forgot">Forgot Password?</a>
              </div>

              <button type="submit" className="login-btn-primary">Login</button>

              {/* Switch student ↔ teacher */}
              <div className="login-switch-row">
                <span>{isTeacher ? 'Are you a Student?' : 'Are you a Teacher?'}</span>
                <button type="button" className="login-switch-link" onClick={onSwitch}>
                  {switchLabel}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ════ CREATE PASSWORD TAB ════ */}
        {activeTab === 'create-password' && (
          <div key="create-password" className="form-tab-content">
            <h3 className="login-form-title">Create a Password</h3>
            <p className="login-form-sub">
              Kindly provide the CNIC number and DOB used during SMIT course registration.
            </p>

            <form onSubmit={handleCreatePassword}>
              {/* CNIC */}
              <div className="login-field-group">
                <label className="login-label">
                  CNIC <span className="login-required">*</span>
                </label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><PersonIcon /></span>
                  <input
                    type="text"
                    className="login-input"
                    placeholder={isTeacher ? 'Enter your CNIC' : 'Enter your CNIC'}
                    value={createForm.cnic}
                    onChange={e => setCreateForm(f => ({ ...f, cnic: e.target.value }))}
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="login-field-group">
                <label className="login-label">
                  DOB <span className="login-required">*</span>
                </label>
                <div className="login-input-wrap">
                  <input
                    type="date"
                    className="login-input login-input-date"
                    value={createForm.dob}
                    onChange={e => setCreateForm(f => ({ ...f, dob: e.target.value }))}
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field-group">
                <label className="login-label">
                  Password <span className="login-required">*</span>
                </label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><LockIcon /></span>
                  <input
                    type={showCrPass ? 'text' : 'password'}
                    className="login-input"
                    placeholder="Create a password"
                    value={createForm.password}
                    onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button type="button" className="login-eye-btn"
                    onClick={() => setShowCrPass(p => !p)}
                    aria-label={showCrPass ? 'Hide password' : 'Show password'}>
                    {showCrPass ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn-primary login-btn-submit">
                SUBMIT
              </button>

              {/* Switch student ↔ teacher */}
              <div className="login-switch-row">
                <span>{isTeacher ? 'Are you a Student?' : 'Are you a Teacher?'}</span>
                <button type="button" className="login-switch-link" onClick={onSwitch}>
                  {switchLabel}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
══════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [isTeacher, setIsTeacher] = useState(false);

  // Separate preserved form state per login type
  const [studentForm, setStudentForm] = useState({ id: '', password: '', remember: false });
  const [teacherForm, setTeacherForm] = useState({ id: '', password: '', remember: false });

  return (
    <div className="login-page">
      <div className="login-outer">
        <div className={`login-views-track${isTeacher ? ' teacher' : ''}`}>

          {/* ── View 1: Student (Blue | Form) ── */}
          <div className="login-view">
            <BluePanel isTeacher={false} />
            <FormPanel
              isTeacher={false}
              form={studentForm}
              setForm={setStudentForm}
              onSwitch={() => setIsTeacher(true)}
              onLogin={() => onLogin(false)}
            />
          </div>

          {/* ── View 2: Teacher (Form | Blue) ── */}
          <div className="login-view">
            <FormPanel
              isTeacher={true}
              form={teacherForm}
              setForm={setTeacherForm}
              onSwitch={() => setIsTeacher(false)}
              onLogin={() => onLogin(true)}
            />
            <BluePanel isTeacher={true} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
