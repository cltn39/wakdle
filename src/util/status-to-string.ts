const blocks = ['⬜', '🟩', '🟨', '⬛'];

export default function(status: number[][], emptyShow: boolean) {
  let str = '';
  for (let y = 0; y < status.length; y++) {
    if (status[y].findIndex(v => v === 0) !== -1 && !emptyShow) continue;
    for (let x = 0; x < status[y].length; x++) {
      str += blocks[status[y][x]];
    }
    str += '\n';
  }

  return str.trim();
}
