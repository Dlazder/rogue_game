window.onload = function () {
	const MAP_WIDTH = 40;
	const MAP_HEIGHT = 25;
	const TILE_SIZE = 25;
	const map = [];
	const items = {
		sword: 2,
		healthPotion: 10,
	};
	const enemiesCount = 10;
	const hero = { x: 0, y: 0, health: 100, attack: 30 };
	const enemies = [];

	function createMap() {
		for (let y = 0; y < MAP_HEIGHT; y++) {
			map[y] = [];
			for (let x = 0; x < MAP_WIDTH; x++) {
				map[y][x] = 'tileW';
			}
		}
	}

	function createRoom(x, y, width, height) {
		for (let i = y; i < y + height; i++) {
			for (let j = x; j < x + width; j++) {
				map[i][j] = 'tile';
			}
		}
	}

	function createRooms(minRooms, maxRooms) {
		const numRooms = Math.floor(Math.random() * (maxRooms - minRooms) + minRooms)
		for (let i = 0; i < numRooms; i++) {
			const roomWidth = Math.floor(Math.random() * 6) + 3;
			const roomHeight = Math.floor(Math.random() * 6) + 3;
			const x = Math.floor(Math.random() * (MAP_WIDTH - roomWidth - 1)) + 1;
			const y = Math.floor(Math.random() * (MAP_HEIGHT - roomHeight - 1)) + 1;
			createRoom(x, y, roomWidth, roomHeight);
		}
	}

	function createCorridors() {
		const minCorridors = 3;
		const maxCorridors = 5;
		const numVerticalCorridors =
			Math.floor(Math.random() * (maxCorridors - minCorridors + 1)) + minCorridors;
		const numHorizontalCorridors =
			Math.floor(Math.random() * (maxCorridors - minCorridors + 1)) + minCorridors;

		// Вертикальные проходы
		for (let i = 0; i < numVerticalCorridors; i++) {
			const corridorX = Math.floor(Math.random() * (MAP_WIDTH - 2)) + 1;
			for (let y = 1; y < MAP_HEIGHT - 1; y++) {
				map[y][corridorX] = 'tile';
			}
		}

		// Горизонтальные проходы
		for (let i = 0; i < numHorizontalCorridors; i++) {
			const corridorY = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
			for (let x = 1; x < MAP_WIDTH - 1; x++) {
				map[corridorY][x] = 'tile';
			}
		}
	}

	function placeItems() {
		// Размещаем мечи
		for (let i = 0; i < items.sword; i++) {
			let x, y;
			do {
				x = Math.floor(Math.random() * MAP_WIDTH);
				y = Math.floor(Math.random() * MAP_HEIGHT);
			} while (map[y][x] !== 'tile');
			map[y][x] = 'tileSW';
		}

		// Размещаем зелья здоровья
		for (let i = 0; i < items.healthPotion; i++) {
			let x, y;
			do {
				x = Math.floor(Math.random() * MAP_WIDTH);
				y = Math.floor(Math.random() * MAP_HEIGHT);
			} while (map[y][x] !== 'tile');
			map[y][x] = 'tileHP';
		}
	}

	function createRoomsAndCorridors(minRooms, maxRooms) {
		const rooms = [];
		const numRooms = Math.floor(Math.random() * (maxRooms - minRooms) + minRooms);

		// Создаем комнаты и сохраняем их координаты
		for (let i = 0; i < numRooms; i++) {
			const roomWidth = Math.floor(Math.random() * 6) + 3;
			const roomHeight = Math.floor(Math.random() * 6) + 3;
			const x = Math.floor(Math.random() * (MAP_WIDTH - roomWidth - 1)) + 1;
			const y = Math.floor(Math.random() * (MAP_HEIGHT - roomHeight - 1)) + 1;
			createRoom(x, y, roomWidth, roomHeight);
			rooms.push({
				x: x + Math.floor(roomWidth / 2),
				y: y + Math.floor(roomHeight / 2),
				width: roomWidth,
				height: roomHeight
			});
		}

		// Соединяем комнаты коридорами
		for (let i = 1; i < rooms.length; i++) {
			connectRooms(rooms[i - 1], rooms[i]);
		}
	}

	function connectRooms(room1, room2) {
		if (Math.random() > 0.5) {
			createHorizontalTunnel(room1.x, room2.x, room1.y);
			createVerticalTunnel(room1.y, room2.y, room2.x);
		} else {
			createVerticalTunnel(room1.y, room2.y, room1.x);
			createHorizontalTunnel(room1.x, room2.x, room2.y);
		}
	}

	function createHorizontalTunnel(x1, x2, y) {
		const startX = Math.min(x1, x2);
		const endX = Math.max(x1, x2);
		for (let x = startX; x <= endX; x++) {
			map[y][x] = 'tile';
		}
	}

	function createVerticalTunnel(y1, y2, x) {
		const startY = Math.min(y1, y2);
		const endY = Math.max(y1, y2);
		for (let y = startY; y <= endY; y++) {
			map[y][x] = 'tile';
		}
	}

	createMap();
	// createRooms(5, 10);
	// Гарантирует отсутствие недоступных мест, но может получится слишком много свободного места.
	createRoomsAndCorridors(5, 10);
	createCorridors();
	placeItems();

	// Создаем массив пустых плиток
	const emptyTiles = [];
	for (let y = 0; y < MAP_HEIGHT; y++) {
		for (let x = 0; x < MAP_WIDTH; x++) {
			if (map[y][x] === 'tile') {
				emptyTiles.push({ x: x, y: y });
			}
		}
	}

	// Размещаем врагов
	for (let i = 0; i < enemiesCount; i++) {
		const randomIndex = Math.floor(Math.random() * emptyTiles.length);
		const randomTile = emptyTiles[randomIndex];
		const { x, y } = randomTile;
		enemies.push({ x: x, y: y, health: 100, attack: 5 });
		map[y][x] = 'tileE';
		emptyTiles.splice(randomIndex, 1);
	}

	do {
		hero.x = Math.floor(Math.random() * MAP_WIDTH);
		hero.y = Math.floor(Math.random() * MAP_HEIGHT);
	} while (map[hero.y][hero.x] !== 'tile');

	map[hero.y][hero.x] = 'tileP';

	const field = document.querySelector('.field');



	function updateMap() {
		// Очищаем поле
		field.innerHTML = '';

		for (let y = 0; y < MAP_HEIGHT; y++) {
			for (let x = 0; x < MAP_WIDTH; x++) {
				// Создаем элемент плитки
				const tile = document.createElement('div');
				tile.className = `tile ${map[y][x]}`;

				// Устанавливаем стили
				tile.style.left = `${x * TILE_SIZE}px`;
				tile.style.top = `${y * TILE_SIZE}px`;
				tile.style.width = `${TILE_SIZE}px`;
				tile.style.height = `${TILE_SIZE}px`;

				// Добавляем полоску здоровья
				if (map[y][x] === 'tileP' && hero.health) {
					tile.appendChild(createHealthBar(hero.health));
				}

				if (map[y][x] === 'tileE' && enemies.length > 0) {
					const enemy = enemies.find(e => e.x === x && e.y === y);
					if (enemy && enemy.health) {
						tile.appendChild(createHealthBar(enemy.health));
					}
				}

				// Атака противников
				if (map[y][x] === 'tileE' && hero.health && isPlayerAdjacent(x, y)) {
					hero.health -= 5;
					if (hero.health === 0) {
						location.reload();
					}
				}

				// Обновляем статистику
				document.querySelector('.hp').textContent = `ХП: ${hero.health} %`;
				document.querySelector('.attack').textContent = `Урон: ${hero.attack}`;

				// Добавляем плитку на поле
				field.appendChild(tile);
			}
		}
	}

	function createHealthBar(health) {
		const healthBar = document.createElement('div');
		healthBar.className = 'health';
		healthBar.style.width = `${health}%`;
		return healthBar;
	}

	function isPlayerAdjacent(x, y) {
		return (
			(x > 0 && map[y][x - 1] === 'tileP') ||
			(x < MAP_WIDTH - 1 && map[y][x + 1] === 'tileP') ||
			(y > 0 && map[y - 1][x] === 'tileP') ||
			(y < MAP_HEIGHT - 1 && map[y + 1][x] === 'tileP')
		);
	}

	document.addEventListener('keydown', function (e) {
		const key = e.key;
		let newX = hero.x;
		let newY = hero.y;

		const moveMap = {
			'w': { x: 0, y: -1 },
			'a': { x: -1, y: 0 },
			's': { x: 0, y: 1 },
			'd': { x: 1, y: 0 },

			'ц': { x: 0, y: -1 },
			'ф': { x: -1, y: 0 },
			'ы': { x: 0, y: 1 },
			'в': { x: 1, y: 0 },
		};

		if (moveMap.hasOwnProperty(key)) {
			const move = moveMap[key];
			newX += move.x;
			newY += move.y;
		} else if (key === ' ') { // Attack
			attackEnemies();
			updateMap();
			return;
		} else {
			return;
		}

		if (map[newY][newX] === 'tileSW') {
			hero.attack += 20;
			map[newY][newX] = 'tile';
		}

		if (canMoveTo(newX, newY) && !isEnemyAt(newX, newY)) {
			if (map[newY][newX] === 'tileHP') {
				const healthToAdd = Math.min(100 - hero.health, 50);
				hero.health = Math.min(hero.health + healthToAdd, 100);

				if (hero.health === 100) {
					map[newY][newX] = 'tile';
				}
			}
			moveHeroTo(newX, newY);
			updateMap();
		}
	});

	function isEnemyAt(x, y) {
		return map[y][x] === 'tileE';
	}

	function canMoveTo(x, y) {
		const tile = map[y][x];
		return (
			x >= 0 &&
			x < MAP_WIDTH &&
			y >= 0 &&
			y < MAP_HEIGHT &&
			(tile !== 'tileW' || tile === 'tileSW' || tile === 'tileHP')
		);
	}

	function moveHeroTo(x, y) {
		map[hero.y][hero.x] = 'tile';
		hero.x = x;
		hero.y = y;
		map[y][x] = 'tileP';
	}

	function attackEnemies() {
		for (const enemy of enemies) {
			if (isEnemyAdjacent(enemy)) {
				enemy.health -= hero.attack;
				if (enemy.health <= 0) {
					const index = enemies.indexOf(enemy);
					enemies.splice(index, 1);
					map[enemy.y][enemy.x] = 'tile';
				}
				// break;
			}
		}
	}

	function isEnemyAdjacent(enemy) {
		return Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y) === 1;
	}

	function moveEnemies() {
		for (const enemy of enemies) {
			if (isEnemyAdjacentToHero(enemy.x, enemy.y)) {
				continue;
			}

			let newX, newY;

			do {
				newX = enemy.x;
				newY = enemy.y;

				const direction = Math.floor(Math.random() * 4);

				switch (direction) {
					case 0: newY -= 1; break;
					case 1: newY += 1; break;
					case 2: newX -= 1; break;
					case 3: newX += 1; break;
				}
			} while (!canMoveTo(newX, newY) || isItem(newX, newY));

			map[enemy.y][enemy.x] = 'tile';
			enemy.x = newX;
			enemy.y = newY;
			map[newY][newX] = 'tileE';
		}
	}

	function isItem(x, y) {
		return map[y][x] === 'tileSW' || map[y][x] === 'tileHP';
	}

	function isEnemyAdjacentToHero(enemyX, enemyY) {
		return (
			(Math.abs(hero.x - enemyX) === 1 && hero.y === enemyY) ||
			(Math.abs(hero.y - enemyY) === 1 && hero.x === enemyX)
		);
	}

	updateMap();

	// Интервал для движения врагов
	setInterval(function () {
		moveEnemies();
		updateMap();
	}, 700);
};