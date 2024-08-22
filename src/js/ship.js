export default class Ship {
    timesHit = 0;
    constructor(length, isVertical = true, startX = 0, startY = 0) {
        this.length = length;
        this.isVertical = isVertical;
        this.startX = startX;
        this.startY = startY;
    }

    hit() {
        this.timesHit++;
    }

    isSunk() {
        return !(this.length - this.timesHit);
    }
}
