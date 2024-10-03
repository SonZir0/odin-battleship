export function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

/*  mark all empty/water cells in provided area as '0'. Has slightly different meaning depending on the board:
        gameBoard:      'adjacent to other ship' and is unavailable for placement
        targetBoard:    'definitely empty cell' that is not a valid target       */
export function addProximityArea(startRow, endRow, startColumn, endColumn) {
    for (let i = startRow; i <= endRow; i++)
        for (let j = startColumn; j <= endColumn; j++)
            if (this.board[i][j] === null) this.board[i][j] = 0;
}
