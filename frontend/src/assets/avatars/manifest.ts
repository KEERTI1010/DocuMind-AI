export const AVATARS = [
  { id: "girl-blonde", name: "Blonde Girl", file: "girl-blonde.svg", color: "theme-accent-peach" },
  { id: "girl-brown", name: "Brown Hair Girl", file: "girl-brown.svg", color: "theme-accent-mint" },
  { id: "girl-black", name: "Black Hair Girl", file: "girl-black.svg", color: "theme-accent-blue" },
  { id: "girl-red", name: "Red Hair Girl", file: "girl-red.svg", color: "theme-accent-pink" },
  { id: "boy-blonde", name: "Blonde Boy", file: "boy-blonde.svg", color: "theme-accent-blue" },
  { id: "boy-brown", name: "Brown Hair Boy", file: "boy-brown.svg", color: "theme-accent-mint" },
  { id: "boy-black", name: "Black Hair Boy", file: "boy-black.svg", color: "theme-accent-peach" },
  { id: "boy-red", name: "Red Hair Boy", file: "boy-red.svg", color: "theme-accent-pink" },
  { id: "cat", name: "Cute Cat", file: "cat.svg", color: "theme-accent-peach" },
  { id: "panda", name: "Panda", file: "panda.svg", color: "theme-surface-alt" },
  { id: "bear", name: "Bear", file: "bear.svg", color: "theme-accent-mint" },
  { id: "rabbit", name: "Rabbit", file: "rabbit.svg", color: "theme-accent-blue" },
  { id: "robot", name: "Friendly Robot", file: "robot.svg", color: "theme-accent-pink" },
  { id: "fairy", name: "Fairy", file: "fairy.svg", color: "theme-accent-mint" },
  { id: "wizard", name: "Wizard", file: "wizard.svg", color: "theme-accent-blue" },
  { id: "princess", name: "Princess", file: "princess.svg", color: "theme-accent-pink" },
  { id: "knight", name: "Knight", file: "knight.svg", color: "theme-accent-peach" },
  { id: "default", name: "Default", file: "default.svg", color: "theme-primary" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export function getAvatarUrl(id: string): string {
  return `/src/assets/avatars/${id}.svg`;
}

export function getDefaultAvatarId(): string {
  return "default";
}
