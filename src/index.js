import { Client } from '@speechly/browser-client';

const client = new Client({
  appId: 'HereIs-AppId-From-The-Dashbord',
  language: 'en-US',
});

let init = false;

async function start() {
  if (!init) {
    await client.initialize();
    init = true;
  }
  client.startContext();
}

function stop() {
  client.stopContext();
}

window.onload = () => {
  document.getElementById('mic').onmousedown = start;
  document.getElementById('mic').onmouseup = stop;
};

client.onSegmentChange((segment) => {
  game = reducer(game, segment);
  renderBoard(game.position);
});

const defaultPosition = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

let game = {
  position: defaultPosition,
  activeColor: 'w',
  contextId: null,
  entityStartPosition: 0,
};

/**
 * Maps the game position to html table content 
 */
function renderBoard(position) {
  const view = position.map(
    (rank) => `<tr>${
      rank.map((file) => `<td>${file}</td>`).join('')
    }</tr>`,
  ).join('');
  document.getElementById('board').innerHTML = view;
};

/**
 * Creates a new position by changing current file and rank of a piece
 */
function move(position, {file, rank}, dst) {
  const piece = position[rank][file];
  let newPosition = position;
  newPosition[rank][file] = '.';
  newPosition[dst.rank][dst.file] = piece;
  return newPosition;
}

const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

/**
 * Transforms square string value like 'E4' to an object with coordinates
 * 
 * @param {string} square 
 * @return {object} file number and rank number combined in an object.
 */
const transformCoordinates = (square) => ({
  file: files.indexOf(square[0]),
  rank: 8 - square[1]
});

const pieces = {
  PAWN: 'P',
  KNIGHT: 'N',
  BISHOP: 'B',
  ROOK: 'R',
  QUEEN: 'Q',
  KING: 'K',
};

/**
 * Format entities to a key value object
 * @param {array} entities 
 * @return {object} key value object.
 */
const formatEntities = (entities) =>
  entities.reduce((accumulator, currentValue) => ({
    ...accumulator,
    [currentValue.type]: currentValue.value
  }), {});

/**
 * Filter out used entities
 * @return {array} filtered entities.
 */
const selectNewEntities = (segment, game) => {
  if (segment.contextId != game.contextId) {
    return segment.entities
  }

  return segment.entities.filter(entity =>
    entity.startPosition > game.entityStartPosition)
}

/**
 * Creates a new game state
 * @return {object} new state of the game.
 */
const reducer = (game, segment) => {
  if (!segment.intent) {
    return game;
  }
  const entities = selectNewEntities(segment, game);
  switch (segment.intent.intent) {
    case 'reset':
      const newGame = {
        position: defaultPosition,
        activeColor: 'w',
      };
      return newGame;
    case 'move':
      if (entities.length === 0) {
        return game;
      }
      let {piece, square} = formatEntities(entities);
      if (piece === undefined && square === undefined) {
        return {
          ...game,
          contextId: segment.contextId,
          entityStartPosition: entities[entities.length - 1].startPosition,
        }
      }
      if (square === undefined && piece) {
        return game
      }

      if (piece) {
        piece = pieces[piece];
      } else {
        piece = 'P';
      }
      piece = game.activeColor === 'b' ? piece.toLowerCase() : piece;  
      const {file, rank} = transformCoordinates(square);
      const selectedPiece = selectPiece(game, piece, file, rank);
      console.log(selectedPiece)
      if (!selectedPiece) {
        console.error(`Can't find out the piece ${piece} for move on ${square}`);
        return game;
      }
      return {
        position: move(game.position, selectedPiece, {file, rank}),
        activeColor: game.activeColor === 'w' ? 'b' : 'w',
        contextId: segment.contextId,
        entityStartPosition: entities[entities.length - 1].startPosition,
      };
    case 'capture':
      return game;
    case 'castle':
      let newPosition;
      if (game.activeColor === 'w') {
        newPosition = move(game.position, transformCoordinates('E1'), transformCoordinates('G1'));
        newPosition = move(newPosition, transformCoordinates('H1'), transformCoordinates('F1'));
      } else {
        newPosition = move(game.position, transformCoordinates('E8'), transformCoordinates('G8'));
        newPosition = move(newPosition, transformCoordinates('H8'), transformCoordinates('F8'));
      }
      return {
        position: newPosition,
        activeColor: game.activeColor === 'w' ? 'b' : 'w',
      };
    default:
      return game;
  }
}

/**
 * Since user provide us only with a destination square for eaxmple 'E4',
 * we add a selectPiece function to get the piece coordinates on the chessboard.
 */
function selectPiece(game, piece, newFile, newRank) {
  return game.position.flatMap((rank) => rank)
    .map((piece, i) => ({ piece, rank: Math.floor(i / 8), file: (i % 8) }))
    .find((item) =>
      item.piece === piece
      && isCorrectMove(piece, newRank, newFile, item.rank, item.file));
}

/**
 * Check correctness of a move
 * @return {boolean} is correct.
 */
function isCorrectMove(piece, rank, file, rankIndex, fileIndex) {
  const dRank = Math.abs(rankIndex - rank);
  const dFile = Math.abs(fileIndex - file);

  switch (piece.toUpperCase()) {
    case 'P':
      return file === fileIndex && dRank <= 2;
    case 'N':
      return dRank + dFile === 3 && Math.abs(dRank - dFile) == 1;
    case 'B':
      return dRank === dFile;
    case 'R':
      return rankIndex === rank || fileIndex === file;
    default:
      return false;
  }
};
