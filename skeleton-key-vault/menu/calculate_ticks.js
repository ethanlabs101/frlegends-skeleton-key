export function getDotNetTicks() {
    const epochOffset = 62135596800000;
    return (Date.now() + epochOffset) * 10000;
}
