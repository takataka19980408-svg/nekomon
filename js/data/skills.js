// skills.js - SKILL_MAPエクスポートを追加
import { SKILLS } from './skills_data.js';
export { SKILLS };
export const SKILL_MAP = Object.fromEntries(SKILLS.map(s => [s.id, s]));
