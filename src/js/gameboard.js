import Ship from './ship';
import { clamp } from './index';

/* On board numbers mean following:
        -2      -   damaged ship. Attacking this cell is invalid action
        -1      -   miss. Attacking this cell is invalid action
        null    -   water cell
        0       -   water cell that is directly adjacent to some ship. Only used during
                    "ship placement" stage to prevent units being too close to each other
        num > 0 -   cell with ship ID number (should be positive). It's used to point out
                    correct ship/index in fleet array       */

export default class GameBoard {
    board;
    fleet = [];

    constructor() {
        this.initBoard();
    }

    initBoard() {
        //  create 10x10 board and fill it with water (null)
        this.board = new Array(10);
        for (let i = 0; i < 10; i++) {
            this.board[i] = new Array(10).fill(null);
        }
    }

    addShip(size, isVertical = true, startRow = 0, startColumn = 0) {
        if (!this.inBounds(...arguments)) throw new Error('Out of bounds!');

        if (isVertical) {
            this.placeVertical(size, startRow, startColumn);
        } else this.placeHorizontal(size, startRow, startColumn);

        this.fleet.push(new Ship(...arguments));
    }

    inBounds(size, isVertical, startRow, startColumn) {
        if (isVertical)
            return (
                startRow >= 0 &&
                startRow + size - 1 < 10 &&
                startColumn >= 0 &&
                startColumn < 10
            );
        else
            return (
                startRow >= 0 &&
                startRow < 10 &&
                startColumn >= 0 &&
                startColumn + size - 1 < 10
            );
    }

    /*  check proximity to other ships, if too close - throw error. 
        If all green - place the ship and it's own proximity area                   */
    placeHorizontal(size, startRow, startColumn) {
        for (let i = 0; i < size; i++) {
            //  null means empty space away from other ships
            if (this.board[startRow][startColumn + i] !== null)
                throw new Error('Too close to other ship!');
        }

        this.addProximityArea(
            clamp(startRow - 1, 0, 9),
            clamp(startRow + 1, 0, 9),
            clamp(startColumn - 1, 0, 9),
            clamp(startColumn + size, 0, 9)
        );

        for (let i = 0; i < size; i++) {
            this.board[startRow][startColumn + i] = this.fleet.length + 1;
        }
    }

    /*  check proximity to other ships, if too close - throw error. 
        If all green - place the ship and it's own proximity area                  */
    placeVertical(size, startRow, startColumn) {
        for (let i = 0; i < size; i++) {
            //  null means empty space away from other ships
            if (this.board[startRow + i][startColumn] !== null)
                throw new Error('Too close to other ship!');
        }

        this.addProximityArea(
            clamp(startRow - 1, 0, 9),
            clamp(startRow + size, 0, 9),
            clamp(startColumn - 1, 0, 9),
            clamp(startColumn + 1, 0, 9)
        );

        for (let i = 0; i < size; i++) {
            this.board[startRow + i][startColumn] = this.fleet.length + 1;
        }
    }

    addProximityArea(startRow, endRow, startColumn, endColumn) {
        for (let i = startRow; i <= endRow; i++)
            for (let j = startColumn; j <= endColumn; j++) this.board[i][j] = 0;
    }

    receiveAttack(row, column) {
        if (this.board[row][column] < 0)
            throw new Error('This cell was attacked already. Invalid action');

        //  if cell is water (null) or space near ship (0)
        if (!this.board[row][column]) {
            this.board[row][column] = -1; //  mark as miss
            return false;
        }

        //  if we have ship "ID"
        if (this.board[row][column] > 0) {
            let shipIndex = this.board[row][column] - 1;
            this.fleet[shipIndex].hit(); //  register hit
            this.board[row][column] = -2; //  mark cell as attacked

            if (this.fleet[shipIndex].isSunk());
            // add some DOM logic to announce the destruction of the ship

            return true;
        }
    }

    shipsRemain() {
        return this.fleet.reduce(
            (counter, currentShip) => counter + !currentShip.isSunk(),
            0
        );
    }
}
