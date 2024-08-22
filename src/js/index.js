// mock function to check if jest works
export function sum(first, second) {
    return first + second;
}
console.log('Printing from "index.js": 10 + 20 =', sum(10, 20));

export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}
