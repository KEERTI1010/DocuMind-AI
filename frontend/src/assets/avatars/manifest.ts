import girlBlonde from "./girl-blonde.svg";
import girlBrown from "./girl-brown.svg";
import girlBlack from "./girl-black.svg";
import girlRed from "./girl-red.svg";
import boyBlonde from "./boy-blonde.svg";
import boyBrown from "./boy-brown.svg";
import boyBlack from "./boy-black.svg";
import boyRed from "./boy-red.svg";
import cat from "./cat.svg";
import panda from "./panda.svg";
import bear from "./bear.svg";
import rabbit from "./rabbit.svg";
import robot from "./robot.svg";
import fairy from "./fairy.svg";
import wizard from "./wizard.svg";
import princess from "./princess.svg";
import knight from "./knight.svg";
import defaultAvatar from "./default.svg";

export const AVATARS = [
  { id: "girl-blonde", name: "Blonde Girl", url: girlBlonde, color: "theme-accent-peach" },
  { id: "girl-brown", name: "Brown Hair Girl", url: girlBrown, color: "theme-accent-mint" },
  { id: "girl-black", name: "Black Hair Girl", url: girlBlack, color: "theme-accent-blue" },
  { id: "girl-red", name: "Red Hair Girl", url: girlRed, color: "theme-accent-pink" },
  { id: "boy-blonde", name: "Blonde Boy", url: boyBlonde, color: "theme-accent-blue" },
  { id: "boy-brown", name: "Brown Hair Boy", url: boyBrown, color: "theme-accent-mint" },
  { id: "boy-black", name: "Black Hair Boy", url: boyBlack, color: "theme-accent-peach" },
  { id: "boy-red", name: "Red Hair Boy", url: boyRed, color: "theme-accent-pink" },
  { id: "cat", name: "Cute Cat", url: cat, color: "theme-accent-peach" },
  { id: "panda", name: "Panda", url: panda, color: "theme-surface-alt" },
  { id: "bear", name: "Bear", url: bear, color: "theme-accent-mint" },
  { id: "rabbit", name: "Rabbit", url: rabbit, color: "theme-accent-blue" },
  { id: "robot", name: "Friendly Robot", url: robot, color: "theme-accent-pink" },
  { id: "fairy", name: "Fairy", url: fairy, color: "theme-accent-mint" },
  { id: "wizard", name: "Wizard", url: wizard, color: "theme-accent-blue" },
  { id: "princess", name: "Princess", url: princess, color: "theme-accent-pink" },
  { id: "knight", name: "Knight", url: knight, color: "theme-accent-peach" },
  { id: "default", name: "Default", url: defaultAvatar, color: "theme-primary" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

const avatarMap = Object.fromEntries(AVATARS.map((a) => [a.id, a.url]));

export function getAvatarUrl(id: string): string {
  return avatarMap[id] || avatarMap.default;
}

export function getDefaultAvatarId(): string {
  return "default";
}