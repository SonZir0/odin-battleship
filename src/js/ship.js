export default class Ship {
    timesHit = 0;
    constructor(size, isVertical = true, startRow = 0, startColumn = 0) {
        this.size = size;
        this.isVertical = isVertical;
        this.startRow = startRow;
        this.startColumn = startColumn;
    }

    hit() {
        this.timesHit++;
    }

    isSunk() {
        return !(this.size - this.timesHit);
    }
}
