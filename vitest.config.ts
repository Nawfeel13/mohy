import { getViteConfig } from 'astro/config';

// Cast : Vitest et Astro embarquent deux versions de Vite, leurs types de config divergent.
export default getViteConfig({ test: { include: ['tests/**/*.test.ts'] } } as object);
