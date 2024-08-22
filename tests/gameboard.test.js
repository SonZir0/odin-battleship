import GameBoard from '../src/js/gameboard';

let testBoard;

beforeEach(() => {
    testBoard = new GameBoard();
});

test('New ship is added to the fleet', () => {
    testBoard.addShip(3, true, 1, 1);
    expect(testBoard.fleet.length).toBe(1);
    testBoard.addShip(1, true, 3, 4);
    expect(testBoard.fleet.length).toBe(2);
});

test('The new ship is correctly placed on board/matrix', () => {
    const shipLength = 3;
    const isVertical = true;
    const startRow = 0;
    const startColumn = 0;
    testBoard.addShip(shipLength, isVertical, startRow, startColumn);

    for (let i = 0; i < shipLength; i++) {
        // 1 is ship ID (index in fleet array + 1, basically)
        expect(testBoard.board[startRow + i][startColumn]).toBe(1);
    }
});

test("Can't place new ships too close to another one", () => {
    const shipLength = 3;
    const isVertical = true;
    const startRow = 0;
    const startColumn = 0;
    testBoard.addShip(shipLength, isVertical, startRow, startColumn);
    expect(() =>
        testBoard
            .addShip(shipLength, isVertical, startRow, startColumn)
            .toThrowError('Too close to other ship!')
    );
});

test('The gameboard tracks hits and misses', () => {
    testBoard.addShip(1, false, 0, 0);
    expect(testBoard.board[0][0]).toBe(1);
    testBoard.receiveAttack(0, 0);
    expect(testBoard.board[0][0]).toBe(-2);
    testBoard.receiveAttack(0, 1);
    expect(testBoard.board[0][1]).toBe(-1);
    expect(testBoard.board[1][0]).toBeFalsy();
});

test('The gameboard should track how many operational ships remain', () => {
    expect(testBoard.shipsRemain()).toBe(0);
    testBoard.addShip(2, false, 0, 0);
    testBoard.addShip(2, true, 2, 1);
    expect(testBoard.shipsRemain()).toBe(2);
});
