import TargetBoard from '../src/js/targetBoard';

/*  write tests:
        1)  TargetBoard (TB) can tracks hits and misses
        2)  TB checks validity of the attack
        3)  TB marks area around destroyed ships as invalid target
        4)  TB adds damaged but not destroyed ships to targetList
        5)  TB marks where other sections of the damaged target could be    */

let testTB;

beforeEach(() => {
    testTB = new TargetBoard();
});

test('TB can tracks hits and misses', () => {
    testTB.trackAttackResults(...[0, 0], 0); // coords [0,0], code 0 - miss
    testTB.trackAttackResults(...[1, 1], -1); // coords [1,1], code -1 - destroyed
    expect(testTB.board[0][0]).toBe(0); // should be marked as empty cell
    expect(testTB.board[1][1]).toBe(-1); // should be marked as destroyed cell
    expect(testTB.board[3][3]).toBeNull(); // unknown tile
});

test('TargetBoard (TB) checks validity of the attack', () => {
    expect(testTB.isValidAttack(-1, -1)).toBe(false); // out of bounds
    expect(testTB.isValidAttack(0, 0)).toBe(true); // unknown cell is a valid target

    testTB.trackAttackResults(...[0, 0], -1); // mark as destroyed ship (to test validity)
    testTB.trackAttackResults(...[0, 1], 0); // mark as known empty tile (to test validity)

    expect(testTB.isValidAttack(0, 0)).toBe(false); // no longer a valid target
    expect(testTB.isValidAttack(0, 1)).toBe(false); // not a valid target either
});
