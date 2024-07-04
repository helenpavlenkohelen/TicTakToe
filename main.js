class Game {
	#layout;
	#blocks;
	#restartBtn;
	#player;
	#bot;
	#infoStepDiv;
	#winner;
	#idInterval;

	constructor(player) {
		this.#layout = document.querySelector(".game");
		this.#blocks = document.querySelectorAll(".field div");
		this.#restartBtn = document.querySelector(".btn_restart");
		this.#player = player;
		this.#winner = null;
		this.#idInterval = -1;
		this.#bot = new Bot(() => this.#checkWinBot());
		this.#infoStepDiv = document.querySelector(".step");
		this.#refreshGame();
	}

	get layout() {
		return this.#layout;
	}

	#checkWinBot() {
		const resultWinBot = this.#checkWin(this.#bot.color);
		if (resultWinBot == "Победа") {
			this.#winner = "Bot";
			this.#showModal();
		} else if (resultWinBot == "Ничья") {
			this.#winner = "Friends";
			this.#showModal();
		}
	}

	#addHistoryOnSite() {
		const historyDiv = document.querySelector(".players");
		let currentDate = new Date();
		let year = currentDate.getFullYear();
		let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
		let day = ("0" + currentDate.getDate()).slice(-2);
		let hours = ("0" + currentDate.getHours()).slice(-2);
		let minutes = ("0" + currentDate.getMinutes()).slice(-2);
		let seconds = ("0" + currentDate.getSeconds()).slice(-2);
		let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		const p1 = document.createElement("p");
		p1.textContent = `играли ${this.#player.name} с bot, победа за ${
			this.#winner
		} дата игры: ${formattedDate}`;
		historyDiv.append(p1);
	}

	#controllerCloseModal() {
		const modalWindow = document.querySelector(".window");
		const elemWinner = document.querySelector(".winner");

		elemWinner.onclick = (e) => {
			e.stopPropagation();
		};

		modalWindow.onclick = (e) => {
			modalWindow.classList.remove("open");
			this.#addHistoryOnSite();
			this.#refreshGame();
			clearTimeout(this.#idInterval);
		};
	}

	#showModal() {
		const modalWindow = document.querySelector(".window");
		const elemWinner = document.querySelector(".winner");

		elemWinner.textContent = `Выиграл: ${this.#winner}`;
		modalWindow.classList.add("open");

		this.#idInterval = setTimeout(() => {
			modalWindow.classList.remove("open");
			this.#addHistoryOnSite();
			this.#refreshGame();
		}, 3000);
	}

	#refreshGame() {
		for (const block of this.#blocks) {
			block.style.background = "";
		}

		this.#bot.stateStep = false;
		this.#winner = null;
		this.#infoStepDiv.textContent = `Ходит: ${this.#player.name}`;
	}

	#controllerBlockClick() {
		for (const block of this.#blocks)
			block.onclick = () => {
				if (
					this.#bot.stateStep == false &&
					block.style.background == ""
				) {
					block.style.background = this.#player.color;
					const resultWin = this.#checkWin(this.#player.color);
					if (resultWin == "Победа") {
						this.#winner = this.#player.name;
						this.#showModal();
					} else if (resultWin == "Ничья") {
						this.#winner = "Friends";
						this.#showModal();
					} else {
						this.#bot.step(
							this.#blocks,
							this.#infoStepDiv,
							this.#player.name
						);
					}
				}
			};
	}

	#checkWin(color) {
		if (
			this.#blocks[0].style.background == color &&
			this.#blocks[1].style.background == color &&
			this.#blocks[2].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[3].style.background == color &&
			this.#blocks[4].style.background == color &&
			this.#blocks[5].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[6].style.background == color &&
			this.#blocks[7].style.background == color &&
			this.#blocks[8].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[0].style.background == color &&
			this.#blocks[4].style.background == color &&
			this.#blocks[8].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[2].style.background == color &&
			this.#blocks[4].style.background == color &&
			this.#blocks[6].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[0].style.background == color &&
			this.#blocks[3].style.background == color &&
			this.#blocks[6].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[1].style.background == color &&
			this.#blocks[4].style.background == color &&
			this.#blocks[7].style.background == color
		) {
			return "Победа";
		} else if (
			this.#blocks[2].style.background == color &&
			this.#blocks[5].style.background == color &&
			this.#blocks[8].style.background == color
		) {
			return "Победа";
		}

		let whiteBlock = undefined;
		for (const block of this.#blocks) {
			if (block.style.background == "") {
				whiteBlock = block;
				break;
			}
		}
		if (whiteBlock == undefined) {
			return "Ничья";
		}

		return "Ничего";
	}

	#controllerBtnRestart() {
		this.#restartBtn.onclick = () => {
			this.#refreshGame();
		};
	}

	start() {
		this.#controllerBlockClick();
		this.#controllerBtnRestart();
		this.#controllerCloseModal();
		this.#layout.classList.add("on");
		this.#infoStepDiv.textContent = `Ходит: ${this.#player.name}`;
	}
}

class Player {
	#name;
	#color;
	#stateStep = false;

	constructor(name, color) {
		this.#name = name;
		this.#color = color;
	}

	get stateStep() {
		return this.#stateStep;
	}

	get name() {
		return this.#name;
	}
	get color() {
		return this.#color;
	}
	set stateStep(step) {
		this.#stateStep = step;
	}
}

class Bot extends Player {
	#checkWinBot;
	constructor(checkWinBot) {
		super("Bot", "black");
		this.#checkWinBot = checkWinBot;
	}

	step(blocks, infoStep, namePlayer) {
		this.stateStep = true;
		infoStep.textContent = `Ходит: ${this.name}`;
		let min = 0;
		let max = 8;

		let blockStepBot = null;
		while (true) {
			const coord_step = Math.floor(
				min + Math.random() * (max + 1 - min)
			);
			blockStepBot = blocks[coord_step];
			if (blockStepBot.style.background == "") {
				break;
			}
		}

		setTimeout(() => {
			blockStepBot.style.background = this.color;
			this.stateStep = false;
			this.#checkWinBot();
			infoStep.textContent = `Ходит: ${namePlayer}`;
		}, 2000);
	}
}

class Menu {
	#layout;
	#startBtn;
	#nameUserInput;
	#colorUserInput;
	#exitBtn;

	constructor() {
		this.#layout = document.querySelector(".menu");
		this.#startBtn = document.querySelector(".got_game");
		this.#nameUserInput = this.#layout.children[0];
		this.#colorUserInput = this.#layout.children[1];
		this.#exitBtn = document.querySelector(".game_exit");
	}

	#controllerExitGame(gameLayout) {
		this.#exitBtn.onclick = () => {
			this.#layout.classList.remove("off");
			this.#layout.classList.add("on");
			gameLayout.classList.remove("on");
			gameLayout.classList.add("off");
			this.#nameUserInput.value = "";
			this.#colorUserInput.value = "";
		};
	}

	#controllerBtnStart() {
		this.#startBtn.onclick = () => {
			this.#layout.classList.remove("on");
			this.#layout.classList.add("off");
			const player = new Player(
				this.#nameUserInput.value,
				this.#colorUserInput.value
			);

			const game = new Game(player);
			this.#controllerExitGame(game.layout);
			this.#exitBtn.classList.add("on");
			game.start();
		};
	}

	start() {
		this.#controllerBtnStart();
	}
}

const menu = new Menu();
menu.start();
