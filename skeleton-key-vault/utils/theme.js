/*
    Skeleton Key Vault Theme

    Primary:
        Purple  #A020F0

    Neon Palette:
        Cyan    #00FFFF
        Green   #39FF14
        Yellow  #FFFF00
        Red     #FF3030
        White   #FFFFFF
*/

const RESET = "\x1b[0m";

export const theme = {
    RESET,
    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    RED:    "\x1b[38;2;255;48;48m",
    GREEN:  "\x1b[38;2;57;255;20m",
    YELLOW: "\x1b[38;2;255;255;0m",
    PURPLE: "\x1b[38;2;160;32;240m",
    CYAN:   "\x1b[38;2;0;255;255m",
    WHITE:  "\x1b[38;2;255;255;255m",

    success: (msg) => `\x1b[1;38;2;57;255;20m${msg}${RESET}`,
    error:   (msg) => `\x1b[1;38;2;255;48;48m${msg}${RESET}`,
    info:    (msg) => `\x1b[1;38;2;0;255;255m[!]${RESET} ${msg}`,
    warn:    (msg) => `\x1b[1;38;2;255;255;0m${msg}${RESET}`,
    accent:  (msg) => `\x1b[38;2;160;32;240m${msg}${RESET}`,
    cyan:    (msg) => `\x1b[38;2;0;255;255m${msg}${RESET}`,
    bcyan:   (msg) => `\x1b[1;38;2;0;255;255m${msg}${RESET}`,
    bpurple: (msg) => `\x1b[1;38;2;160;32;240m${msg}${RESET}`,
    bred:    (msg) => `\x1b[1;38;2;255;48;48m${msg}${RESET}`,
    bwhite:  (msg) => `\x1b[1;38;2;255;255;255m${msg}${RESET}`,
    header:  (msg) => `\x1b[1;38;2;160;32;240m${msg.toUpperCase()}${RESET}`,
};
