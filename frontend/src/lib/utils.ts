export function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function ri(a: number, b: number): number {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function animCount(
  setter: (v: number) => void,
  target: number,
  duration = 1400
): void {
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    setter(Math.round(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
