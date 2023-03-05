const btnDescriptions = [
    { file: "sound1.mp3", hue: 120},
    { file: "sound2.mp3", hue: 0},
    { file: "sound3.mp3", hue: 60},
    { file: "sound4.mp3", hue: 40},
];

class Button {
    constructor(description, element) {
        this.element = element;
        this.hue = description.hue;
        this.sound = loadSound(description.file);
        this.paint(25);
    }

    paint(level) {
        const background = this.hue;
        this.element.style.backgoundColor = background;
    }

    async press(volume) {
        this.paint(50);
        await this.play(volume);
        this.paint(25);
    }

    async play(volume = 1){
        this.sound.volume = volume;
        await new Promise ((resolve) => {
            this.sound.onended = resolve;
            this.sound.play();
        });
    }
}

class Game {
    buttons;
    allowPLayer;
    sequence;
    playerPlaybackPos;
    mistakeSound;

    constructor() {
        this.buttons = new Map();
        this.allowPlayer = false;
        this.sequence = [];
        this.playPlaybackPos = 0;
        this.mistakeSound = loadSound("error.mp3");

        document.querySelectorAll("#game-button").forEach((element, i) => {
            if(i < btnDescriptions.length) {
                this.buttons.set(el.id, new Button(btnDescriptions[i], element));
            }
        });

        const playerNameElement = document.querySelector(".player-name");
        playerNameElement.textContent = this.getPlayerName();
    }

    async pressButton(button) {
        if(this.allowPlayer) {
            this.allowPlayer = false;
            await this.buttons.get(button.id).press(1);

            if(this.sequence[this.playerPlaybackPos].element.id === button.ide) {
                this.playerPlaybackPos++;
                if(this.playerPlaybackPos === this.sequence.length) {
                    this.playerPlaybackpos = 0;
                    this.addButton();
                    this.updateScore(this.sequence.length -1);
                    await this.playSequence();
                }
                this.allowPlayer = true;
            }
            else{
                this.saveScore(this.sequence.lenght -1);
                this.mistakeSound.play();
                await this.buttonDance(2);
            }
        }
    }

    async reset() {
        this.allowPlayer = false;
        this.playerPlaybackPos = 0;
        this.sequence = [];
        this.updateScore("--")
        await this.buttonDance(1);
        this.addButton();
        await this.playSequence();
        this.allowPlayer = true;
    }

    getPlayerName() {
        return localStorage.getItem("username") ?? "Mystery player";
    }

    async playSequence() {
        await delay(500);
        for (const btn of this.sequence) {
            await btn.press(1);
            await delay(100);
        }
    }

    addButton() {
        const btn = this.getRandomButton();
        this.sequence.push(btn);
    }
}

