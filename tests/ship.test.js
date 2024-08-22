import Ship from '../src/js/ship';

test('Ship is hit', () => {
    const testShip = new Ship(3); // ship with length 3
    testShip.hit();
    expect(testShip.timesHit).toBe(1);
});

test('Ship is sunk after hit', () => {
    const shipLength = 2;
    const testShip = new Ship(shipLength);
    // one hit is not enough to sink the ship
    testShip.hit();
    expect(testShip.isSunk()).toBe(false);
    // 2-nd hit sinks it
    testShip.hit();
    expect(testShip.isSunk()).toBe(true);
});
