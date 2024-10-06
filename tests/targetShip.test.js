import TargetShip from '../src/js/targetShip';

/*  write tests:
        1)  TargetShip(TS) correctly tracks isVertical and possible targets
        2)  TS correctly merges necessary data with other TargetObjects       */

let testTS;

beforeEach(() => {
    testTS = new TargetShip(1, 1, 1); // (hitX, hitY, targetID)
});

test('TargetShip(TS) correctly tracks isVertical and possible targets list', () => {
    expect(testTS.targetsInRowDirection).toEqual([
        [0, 1],
        [2, 1],
    ]);

    expect(testTS.targetsInColDirection).toEqual([
        [1, 0],
        [1, 2],
    ]);

    // simulate successful attack on the potential target
    expect(testTS.targetsInRowDirection.pop()).toEqual([2, 1]);
    testTS.hit(2, 1, true); // marked as "row target", isVertical = true

    expect(testTS.isVertical).toBe(true);
    expect(testTS.targetsInColDirection).toEqual([]); // yAxis is cleared, since is Vertical = true
    expect(testTS.targetsInRowDirection).toEqual([
        [0, 1],
        [1, 1], // duplicate will be removed during isValidAttack
        [3, 1],
    ]);
});

/*  One big ship's attacked from different sides and has 2 targetShip objects pointing at it.
    Data needs to be merged and extra class removed at targetBoard level    */
test('TargetShip correctly merges necessary data with other TargetShips', () => {
    let targetShip2 = new TargetShip(1, 3, 2); // coords [1,3], targetID = 2
    // targets should be [[0,3], [2,3]] for RowTarget and [[1,2], [1,4]] for ColTarget

    // simulate successful attack on TargetShip1
    expect(testTS.targetsInColDirection.pop()).toEqual([1, 2]);
    testTS.hit(1, 2, false); // coords[1,2], marked as horizontal target
    expect(testTS.targetsInColDirection).toEqual([
        [1, 0],
        [1, 1], // duplicate will be removed during isValidAttack
        [1, 3],
    ]);

    targetShip2.mergeWithOtherTarget(testTS);
    expect(targetShip2.isVertical).toBe(false);
    expect(targetShip2.targetsInRowDirection).toEqual([]);
    expect(targetShip2.targetsInColDirection).toEqual([
        [1, 2],
        [1, 4],
        [1, 0],
        [1, 1],
        [1, 3],
    ]);
});
