import { clamp, initBoard, addProximityArea } from './utils';

/*  TargetBoard class represents opponent's board. The board itself is a matrix and numbers
    on it mark the following:
        -1      -   destroyed ship cell
        null    -   "fog of war" cell
        0       -   known empty cell. Marked as such automatically around destroyed ships or
                    after attacking water cells. Invalid target
        num > 0 -   damaged ship cell. Marked with target ID number (distinct from ship ID on
                    opponents board). It's used to mark destroyed part of a target that still
                    has other sections around it. Used by CPU/player assistance toggle?       */

export default class TargetBoard {
    board;
    damagedTargetsMap = new Map();
    nextTargetID = 1;

    constructor() {
        initBoard.call(this);
    }

    /*  Attack results:
        -1  - target is destroyed
         0  - miss
         1  - target is damaged, but not destroyed  */
    trackAttackResults(targetRow, targetColumn, resultCode) {
        if (resultCode === 0) this.board[targetRow][targetColumn] = 0;
        else if (resultCode === -1) {
            // later add the check for existing targetObject before marking tile as destroyed
            this.board[targetRow][targetColumn] = -1;
        }
        /*  add more complex damagedNotDestroyed case as targetObj implemented 
            needs a check for existing target and the edge case for the merging of the 2
            targetObj for the same ship    */
    }

    isValidAttack(targetRow, targetColumn) {
        if (
            targetRow >= 0 &&
            targetRow < 10 &&
            targetColumn >= 0 &&
            targetColumn < 10 &&
            this.board[targetRow][targetColumn] === null
        )
            return true;
        return false;
    }
}
