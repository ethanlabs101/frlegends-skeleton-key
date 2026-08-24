import { theme } from './theme.js';

const WIDTH = 60;
const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');

export const box = {
    drawRow: (content) => {
        const visibleLen = stripAnsi(content).length;
        const padding = " ".repeat(Math.max(0, WIDTH - visibleLen - 1));
        console.log(`${theme.header("║")} ${content}${padding}${theme.header("║")}`);
    },
    drawCentered: (content) => {
    const lines = content.split('\n');
    lines.forEach(line => {
        const visibleLen = stripAnsi(line).length;
        const totalPadding = Math.max(0, WIDTH - visibleLen - 2);
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        console.log(`${theme.header("║")} ${" ".repeat(leftPadding)}${line}${" ".repeat(rightPadding)} ${theme.header("║")}`);
        });
    },
    top: () => theme.header("╔" + "═".repeat(WIDTH) + "╗"),
    mid: () => theme.header("╠" + "═".repeat(WIDTH) + "╣"),
    bottom: () => theme.header("╚" + "═".repeat(WIDTH) + "╝")
};
