export default class TargetShip {
    isVertical = null;
    hitTilesArr = [];
    targetsInRowDirection = []; // e.g:     [1,0], [2,0], [3,0]
    targetsInColDirection = []; // e.g:     [0,1], [0,2], [0,3]

    constructor(attackedRow, attackedColumn, targetID) {
        this.targetID = targetID;
        this.hit(attackedRow, attackedColumn);
    }

    /*  after second successful attack on the same target (adjacent tiles), isVerticalUpdate 
        is set to true/false, to memorize direction of the enemy ship    */
    hit(attackedRow, attackedColumn, isVerticalUpdate = null) {
        this.hitTilesArr.push([attackedRow, attackedColumn]);

        /*  set direction (if previously unknown) and clear target queue on the wrong axis    */
        if (this.isVertical === null && isVerticalUpdate !== null) {
            this.isVertical = isVerticalUpdate;

            if (this.isVertical) this.targetsInColDirection = [];
            else this.targetsInRowDirection = [];
        }

        //  duplicate coords will be filtered by isValidAttack in the targetBoard
        if (this.isVertical === true || this.isVertical === null) {
            if (attackedRow - 1 >= 0)
                this.targetsInRowDirection.push([
                    attackedRow - 1,
                    attackedColumn,
                ]);
            if (attackedRow + 1 < 10)
                this.targetsInRowDirection.push([
                    attackedRow + 1,
                    attackedColumn,
                ]);
        }
        if (this.isVertical === false || this.isVertical === null) {
            if (attackedColumn - 1 >= 0)
                this.targetsInColDirection.push([
                    attackedRow,
                    attackedColumn - 1,
                ]);
            if (attackedColumn + 1 < 10)
                this.targetsInColDirection.push([
                    attackedRow,
                    attackedColumn + 1,
                ]);
        }

        return this.hitTilesArr; // array with all hit tiles is needed for cleanup after destruction
    }

    mergeWithOtherTarget(secondTargetObject) {
        Array.prototype.push.apply(
            this.hitTilesArr,
            secondTargetObject.hitTilesArr
        );
        if (this.isVertical === null)
            this.isVertical = secondTargetObject.isVertical;

        if (this.isVertical) {
            Array.prototype.push.apply(
                this.targetsInRowDirection,
                secondTargetObject.targetsInRowDirection
            );
            this.targetsInColDirection = [];
        } else {
            Array.prototype.push.apply(
                this.targetsInColDirection,
                secondTargetObject.targetsInColDirection
            );
            this.targetsInRowDirection = [];
        }

        return this.hitTilesArr; // array with all hit tiles is needed for cleanup after destruction
    }
}
