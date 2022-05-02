(function solve() {
  class Board {
    constructor() {
      this.pieces = [];
      this.kingOnBoard = false;
    }

    addPiece(piece) {
      if (piece instanceof King) {
        this.kingOnBoard = true;
      }
      this.pieces.push(piece);
    }

    performAttack(attack) {
      const attacker = this.getAttacker(attack);
      const victim = this.getVictim(attack);
      const attackerIndex = this.pieces.indexOf(attacker);
      this.pieces[attackerIndex].x = attack.to.x;
      this.pieces[attackerIndex].y = attack.to.y;
      this.pieces[attackerIndex].moveCount++;

      this.pieces.splice(this.pieces.indexOf(victim), 1);

      return victim;
    }

    revertAttack(attack, victim) {
      const attacker = this.pieces.filter((piece) => {
        return piece.x === attack.to.x && piece.y === attack.to.y;
      })[0];

      attacker.x = attack.from.x;
      attacker.y = attack.from.y;

      attacker.moveCount--;

      const victimCopy = Object.assign(
        Object.create(Object.getPrototypeOf(victim)),
        victim
      );

      this.pieces.push(victimCopy);
    }

    getVictim(attack) {
      return this.pieces.filter((piece) => {
        return piece.x === attack.to.x && piece.y === attack.to.y;
      })[0];
    }
    pieceAt(x, y) {
      const filtered = this.pieces.filter((piece) => {
        if (piece.x === x && piece.y === y) {
          return true;
        }
        return false;
      });

      if (filtered.length) {
        return true;
      }
      return false;
    }

    getAttacker(attack) {
      return this.pieces.filter((piece) => {
        return piece.x === attack.from.x && piece.y === attack.from.y;
      })[0];
    }
    constructAttacks() {
      let attacks = [];
      for (const piece of this.pieces) {
        attacks = [...attacks, ...piece.getAttacks(this.pieces)];
      }
      return attacks;
    }

    isFinished() {
      if (this.pieces.length === 1) {
        if (
          this.kingOnBoard &&
          this.pieces.filter((piece) => piece instanceof King).length === 0
        ) {
          return false;
        }
        return true;
      }
      return false;
    }
  }

  class Pawn {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.moveCount = 0;
    }

    isAttack(piece) {
      if (
        piece.y === this.y + 1 &&
        (piece.x === this.x + 1 || piece.x === this.x - 1)
      ) {
        return true;
      }
      return false;
    }

    getAttacks(pieces) {
      const attacks = pieces
        .filter((piece) => this.isAttack(piece) && !(piece instanceof King))
        .map((piece) => {
          return {
            from: { x: this.x, y: this.y },
            to: { x: piece.x, y: piece.y },
          };
        });
      return attacks;
    }
  }

  class Knight {
    constructor(x, y) {
      this.moveCount = 0;
      this.x = x;
      this.y = y;
    }

    isAttack(piece) {
      const deltas = [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2],
      ];

      for (const delta of deltas) {
        const newX = this.x + delta[0];
        const newY = this.y + delta[1];

        if (piece.x === newX && piece.y === newY) {
          return true;
        }
      }
    }

    getAttacks(pieces) {
      const attacks = pieces
        .filter((piece) => this.isAttack(piece) && !(piece instanceof King))
        .map((piece) => {
          return {
            from: { x: this.x, y: this.y },
            to: { x: piece.x, y: piece.y },
          };
        });
      return attacks;
    }
  }

  class King {
    constructor(x, y) {
      this.moveCount = 0;
      this.x = x;
      this.y = y;
    }
    isAttack(piece) {
      const deltas = [
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, -1],
        [0, 1],
      ];

      for (const delta of deltas) {
        const newX = this.x + delta[0];
        const newY = this.y + delta[1];

        if (piece.x === newX && piece.y === newY) {
          return true;
        }
      }
    }
    getAttacks(pieces) {
      const attacks = pieces
        .filter((piece) => this.isAttack(piece) && !(piece instanceof King))
        .map((piece) => {
          return {
            from: { x: this.x, y: this.y },
            to: { x: piece.x, y: piece.y },
          };
        });
      return attacks;
    }
  }

  class Rook {
    constructor(x, y) {
      this.moveCount = 0;
      this.x = x;
      this.y = y;
    }

    isAttack(piece) {
      // left
      let x = this.x - 1;
      let y = this.y;

      while (x >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        x--;
      }

      // right
      x = this.x + 1;
      y = this.y;
      while (x < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }

        x++;
      }

      // up
      x = this.x;
      y = this.y + 1;
      while (y < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }

        y++;
      }

      // down
      x = this.x;
      y = this.y - 1;

      while (y >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        y--;
      }
      return false;
    }

    getAttacks(pieces) {
      const attacks = pieces
        .filter((piece) => this.isAttack(piece) && !(piece instanceof King))
        .map((piece) => {
          return {
            from: { x: this.x, y: this.y },
            to: { x: piece.x, y: piece.y },
          };
        });
      return attacks;
    }
  }

  class Bishop {
    constructor(x, y) {
      this.moveCount = 0;
      this.x = x;
      this.y = y;
    }

    isAttack(piece) {
      let x = this.x - 1;
      let y = this.y + 1;

      // up left
      while (x >= 0 && y < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        x--;
        y++;
      }

      // up right
      x = this.x + 1;
      y = this.y + 1;

      while (x < 8 && y < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        x++;
        y++;
      }

      // down left
      x = this.x - 1;
      y = this.y - 1;

      while (x >= 0 && y >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        x--;
        y--;
      }

      // down right

      x = this.x + 1;
      y = this.y - 1;

      while (x < 8 && y >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        x++;
        y--;
      }

      return false;
    }

    getAttacks(pieces) {
      const attacks = pieces
        .filter((piece) => this.isAttack(piece) && !(piece instanceof King))
        .map((piece) => {
          return {
            from: { x: this.x, y: this.y },
            to: { x: piece.x, y: piece.y },
          };
        });
      return attacks;
    }
  }

  class Queen {
    constructor(x, y) {
      this.moveCount = 0;
      this.x = x;
      this.y = y;
    }

    isAttack(piece) {
      // diagonals

      let x = this.x - 1;
      let y = this.y + 1;

      // up left
      while (x >= 0 && y < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          // there is a piece, but it's not the target (else-if)
          break;
        }
        x--;
        y++;
      }

      // up right
      x = this.x + 1;
      y = this.y + 1;

      while (x < 8 && y < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          // there is a piece, but it's not the target (else-if)
          break;
        }
        x++;
        y++;
      }

      // down left
      x = this.x - 1;
      y = this.y - 1;

      while (x >= 0 && y >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          // there is a piece, but it's not the target (else-if)
          break;
        }
        x--;
        y--;
      }

      // down right

      x = this.x + 1;
      y = this.y - 1;

      while (x < 8 && y >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          // there is a piece, but it's not the target (else-if)
          break;
        }
        x++;
        y--;
      }

      // left
      x = this.x - 1;
      y = this.y;

      while (x >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        x--;
      }

      // right
      x = this.x + 1;
      y = this.y;
      while (x < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }

        x++;
      }

      // up
      x = this.x;
      y = this.y + 1;
      while (y < 8) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }

        y++;
      }

      // down
      x = this.x;
      y = this.y - 1;

      while (y >= 0) {
        if (x === piece.x && y === piece.y) {
          return true;
        } else if (board.pieceAt(x, y)) {
          break;
        }
        y--;
      }

      return false;
    }

    getAttacks(pieces) {
      const attacks = pieces
        .filter((piece) => this.isAttack(piece) && !(piece instanceof King))
        .map((piece) => {
          return {
            from: { x: this.x, y: this.y },
            to: { x: piece.x, y: piece.y },
          };
        });

      return attacks;
    }
  }
  const piecesContainer = document.querySelector(".board");
  const pieces = piecesContainer.querySelectorAll(".piece");

  const board = new Board();

  for (const piece of pieces) {
    const url = piece.style["background-image"];
    const pieceString = piece.classList[1];

    const positionString = piece.classList[2].split("-")[1];
		
    const m = {
      wp: Pawn,
      wk: King,
      wr: Rook,
      wq: Queen,
      wb: Bishop,
      wn: Knight,
    };

    const x = parseInt(positionString[0]) - 1;
    const y = parseInt(positionString[1]) - 1;
    const mapped = m[pieceString];

    const instance = new mapped();
    instance.x = x;
    instance.y = y;

    board.addPiece(instance);
  }

  let finalMoves = [];

  function recurse(moves) {
    if (board.isFinished()) {
      if (!finalMoves.length) {
        finalMoves = [...moves];
      }
      return moves;
    }

    const attacks = board.constructAttacks();

    for (const attack of attacks) {
      const attacker = board.getAttacker(attack);
      if (attacker.moveCount < 2) {
        const move = {
          from: { x: attack.from.x, y: attack.from.y },
          to: { x: attack.to.x, y: attack.to.y },
        };

        const victim = board.performAttack(attack);

        moves.push(move);

        if (recurse(moves)) {
          return true;
        } else {
          moves.pop();
          board.revertAttack(attack, victim);
        }
      }
    }
  }

  const before = performance.now();
  recurse([]);
  const after = performance.now();
  function getPieceAt(x, y, x1, y1) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    const move = `${files[x]}${y + 1} to ${files[x1]}${y1 + 1}`;
    return move;
  }

  for (const move of finalMoves) {
    const string = getPieceAt(move.from.x, move.from.y, move.to.x, move.to.y);

    console.log(string);
  }
  console.log(`executed in ${after - before} milliseconds`);

  return;
})();
