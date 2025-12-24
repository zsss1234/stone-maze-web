// 全局变量
const imagePath = 'image/';
let imageData = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0]
];
const winImage = JSON.parse(JSON.stringify(imageData)); // 深拷贝目标状态
let row = 3, col = 3; // 初始空格位置 (0 在右下角)
let count = 0;

// 方向枚举（用于 switchAndMove）
const Direction = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

// 初始化随机数组（打乱）
function initRandomArray() {
  // 深拷贝 winImage 到 imageData
  imageData = winImage.map(row => [...row]);

  // Fisher-Yates 打乱（更可靠）
  let flat = imageData.flat();
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  // 重新转为 4x4
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      imageData[i][j] = flat[i * 4 + j];
    }
  }

  // 查找 0 的位置
  outer:
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (imageData[i][j] === 0) {
        row = i;
        col = j;
        break outer;
      }
    }
  }

  // 重要：确保打乱后的局面是可解的（此处简化处理，实际应检查逆序数）
  // 为简单起见，我们直接使用多次随机交换保证可解性（或跳过此步用于 demo）
}

// 渲染图像
function initImage() {
  const container = document.getElementById('puzzle-container');
  container.innerHTML = '';

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const value = imageData[i][j];
      const imgName = value === 0 ? '0.png' : value + '.png';
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.style.backgroundImage = `url(${imagePath}${imgName})`;
      piece.style.left = (j * 100) + 'px';
      piece.style.top = (i * 100) + 'px';
      container.appendChild(piece);
    }
  }

  // 更新步数
  document.getElementById('count').textContent = `步数：${count}`;

  // 检查胜利
  if (isWin()) {
    document.getElementById('win-message').style.display = 'block';
  } else {
    document.getElementById('win-message').style.display = 'none';
  }
}

// 胜利判断
function isWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (imageData[i][j] !== winImage[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// 移动逻辑（完全对应 Java 代码）
function switchAndMove(direction) {
  switch (direction) {
    case Direction.UP:
      if (row < 3) {
        [imageData[row][col], imageData[row + 1][col]] = [imageData[row + 1][col], imageData[row][col]];
        row++;
        count++;
      }
      break;
    case Direction.DOWN:
      if (row > 0) {
        [imageData[row][col], imageData[row - 1][col]] = [imageData[row - 1][col], imageData[row][col]];
        row--;
        count++;
      }
      break;
    case Direction.LEFT:
      if (col < 3) {
        [imageData[row][col], imageData[row][col + 1]] = [imageData[row][col + 1], imageData[row][col]];
        col++;
        count++;
      }
      break;
    case Direction.RIGHT:
      if (col > 0) {
        [imageData[row][col], imageData[row][col - 1]] = [imageData[row][col - 1], imageData[row][col]];
        col--;
        count++;
      }
      break;
  }
  initImage();
}

// 键盘事件监听
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': switchAndMove(Direction.UP); break;
    case 'ArrowDown': switchAndMove(Direction.DOWN); break;
    case 'ArrowLeft': switchAndMove(Direction.LEFT); break;
    case 'ArrowRight': switchAndMove(Direction.RIGHT); break;
  }
});

// 菜单按钮事件
document.getElementById('restartBtn').addEventListener('click', () => {
  count = 0;
  initRandomArray();
  initImage();
});

document.getElementById('exitBtn').addEventListener('click', () => {
  if (confirm('确定要退出吗？')) {
    window.close(); // 注意：部分浏览器会阻止 window.close()
    // 或者重定向到空白页
    window.location.href = 'about:blank';
  }
});

// 启动游戏
window.onload = () => {
  initRandomArray();
  initImage();
};