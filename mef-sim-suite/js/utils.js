export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
export const today = () => new Date().toLocaleDateString();

export function createParticles(count, width, height, speedScale = 1) {
  const particles = [];
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.6 + Math.random() * 1.4) * speedScale;
    particles.push({
      x: 20 + Math.random() * (width - 40),
      y: 20 + Math.random() * (height - 40),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 5
    });
  }
  return particles;
}
