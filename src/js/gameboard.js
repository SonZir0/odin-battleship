import Ship from './ship';
import { clamp, addProximityArea } from './utils';

/*  GameBoard class represents player's team. The boards itself is a matrix and numbers
    on it mark the following:
        -2      -   damaged ship cell
        -1      -   attacked empty/water cell
        null    -   empty/water cell
        0       -   water cell that is directly adjacent to some ship. Used only during
                    "ship placement" stage to prevent units being too close to each other.
                    During the game this cell works as a water cell.
        num > 0 -   cell with ship ID number (always positive). It's used to point out
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
        If all green - mark the area around as occupied and place the ship  */
    placeHorizontal(size, startRow, startColumn) {
        for (let i = 0; i < size; i++) {
            //  null means empty/water cell away from other ships
            if (this.board[startRow][startColumn + i] !== null)
                throw new Error('Too close to other ship!');
        }

        addProximityArea.call(
            this,
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
        If all green - mark the area around as occupied and place the ship  */
    placeVertical(size, startRow, startColumn) {
        for (let i = 0; i < size; i++) {
            //  null means empty/water cell away from other ships
            if (this.board[startRow + i][startColumn] !== null)
                throw new Error('Too close to other ship!');
        }

        addProximityArea.call(
            this,
            clamp(startRow - 1, 0, 9),
            clamp(startRow + size, 0, 9),
            clamp(startColumn - 1, 0, 9),
            clamp(startColumn + 1, 0, 9)
        );

        for (let i = 0; i < size; i++) {
            this.board[startRow + i][startColumn] = this.fleet.length + 1;
        }
    }

    receiveAttack(row, column) {
        if (this.board[row][column] < 0)
            throw new Error('This cell was attacked already. Invalid action');

        //  if attacked cell is empty/water cell(null or 0)
        if (!this.board[row][column]) {
            this.board[row][column] = -1; //  mark as miss
            return false;
        }

        //  if we have ship "ID"
        if (this.board[row][column] > 0) {
            let shipIndex = this.board[row][column] - 1;
            this.fleet[shipIndex].hit(); //  register hit
            this.board[row][column] = -2; //  mark cell as destroyed

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
