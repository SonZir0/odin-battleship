import { clamp, addProximityArea } from './utils';

/*  TargetBoard class represents opponent's board. The board itself is a matrix and numbers
    on it mark the following:
        -1      -   destroyed ship cell
        null    -   "fog of war" cell
        0       -   known empty cell. Marked as such automatically around destroyed ships or
                    after attacking water cells. Invalid target
        num > 0 -   cell with ship target ID number (distinct from ship ID on opponents board).
                    It's used to mark cells that might have other sections of some damaged but
                    not destroyed ship. Used by CPU and maybe in player assistance toggle?      */

export default class TargetBoard {
    board;
    damagedTargetsMap = new Map();
    nextTargetID = 1;

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

    /*  Attack results:
        -1  - target is destroyed
         0  - miss
         1  - target is damaged, but not destroyed  */
    trackAttackResults(targetX, targetY, resultCode) {
        if (resultCode === 0) this.board[targetX][targetY] = 0;
        else if (resultCode === -1) {
            // later add the check for existing targetObject before marking tile as destroyed
            this.board[targetX][targetY] = -1;
        }
        // add more complex damagedNotDestroyed case as targetObj implemented
    }

    isValidAttack(targetX, targetY) {
        if (
            targetX >= 0 &&
            targetX < 10 &&
            targetY >= 0 &&
            targetY < 10 &&
            (this.board[targetX][targetY] === null ||
                this.board[targetX][targetY] > 0)
        )
            return true;
        return false;
    }
}
