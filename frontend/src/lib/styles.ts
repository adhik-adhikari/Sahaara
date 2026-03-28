export const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700&display=swap');



body {
  overflow: hidden;
  cursor: none;
}

#app-scroll {
  overflow-y: auto;
  height: 100vh;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.08) transparent;
}

@keyframes slideUp {
  from { transform: translateY(20px) scale(0.97); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes slideOut {
  from { transform: translateY(0) scale(1); opacity: 1; max-height: 200px; margin-bottom: 0; }
  to   { transform: translateY(-14px) scale(0.94); opacity: 0; max-height: 0; margin-bottom: -8px; }
}
@keyframes rippleOut {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(3.2); opacity: 0; }
}
@keyframes pulseGreen {
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.5; transform: scale(1.5); }
}
@keyframes typingBounce {
  0%,80%,100% { transform: translateY(0); opacity: 0.3; }
  40%          { transform: translateY(-4px); opacity: 1; }
}
@keyframes drainBar {
  from { width: 100%; }
  to   { width: 0%; }
}
@keyframes breathPulse {
  0%,100% { transform: scale(1); opacity: 0.6; }
  50%     { transform: scale(1.22); opacity: 1; }
}
@keyframes countPop {
  0%  { transform: scale(1); }
  40% { transform: scale(1.4); }
  100%{ transform: scale(1); }
}
@keyframes floatOrb {
  0%,100% { transform: translate(0,0); }
  33%     { transform: translate(14px,-20px); }
  66%     { transform: translate(-10px,12px); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes introPop {
  from { opacity: 0; filter: blur(28px); letter-spacing: 0.52em; }
  to   { opacity: 1; filter: blur(0px); letter-spacing: 0.28em; }
}
@keyframes lineExpand {
  from { width: 0; }
  to   { width: min(320px, 55vw); }
}
@keyframes charIn {
  from { opacity: 0; transform: translateY(60%) rotateX(-45deg); }
  to   { opacity: 1; transform: translateY(0) rotateX(0deg); }
}
@keyframes wordIn {
  from { opacity: 0; transform: translateY(50%) scale(0.87); filter: blur(18px); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
}
@keyframes wordOut {
  from { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
  to   { opacity: 0; transform: translateY(-40%) scale(1.07); filter: blur(10px); }
}
`;
