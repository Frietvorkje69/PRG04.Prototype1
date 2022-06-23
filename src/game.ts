import * as PIXI from 'pixi.js'
import { Arcade } from './arcade/arcade'
import { Player } from './player'

import playerImage from "./img/player.png"
import backgroundImage from "./img/background.png"

export class Game {

    private arcade: Arcade
    private pixi: PIXI.Application
    private joystickListener: EventListener
    private player: Player
    private instructions: PIXI.Text

    constructor() {
        this.pixi = new PIXI.Application({ width: 800, height: 450})
        document.body.appendChild(this.pixi.view)

        //load textures
        this.pixi.loader.add('playerTexture', playerImage)
            .add('backgroundTexture', backgroundImage)
        this.pixi.loader.load(() => this.loadCompleted())
    }

    private loadCompleted() {
        const background = new PIXI.Sprite(this.pixi.loader.resources["backgroundTexture"].texture!)
        this.pixi.stage.addChild(background)

        this.instructions = new PIXI.Text('Press a button on the controller')
        this.instructions.x = 10
        this.instructions.y = 10
        this.pixi.stage.addChild(this.instructions)

        // Create arcade cabinet with 2 joysticks (with 6 buttons)
        this.arcade = new Arcade(this)

        // Game waits for controller to connect
        console.log("waiting for controller to connect")
        this.joystickListener = (e: Event) => this.joyStickFound(e as CustomEvent)
        document.addEventListener("joystickcreated", this.joystickListener)
    }


    private joyStickFound(e: CustomEvent) {
        this.instructions.text = "Move around using the left stick!"
        let joystick = this.arcade.Joysticks[e.detail]

        // DEBUG, shows inputs of controller
        for (const buttonEvent of joystick.ButtonEvents) {
            document.addEventListener(buttonEvent, () => console.log(buttonEvent))
        }

        // Create Player
        this.player = new Player(joystick, this.pixi.loader.resources["playerTexture"].texture!)
        this.pixi.stage.addChild(this.player)

        // Add update
        this.pixi.ticker.add((delta) => this.update())
    }

    update() {
        for (let joystick of this.arcade.Joysticks) {
            joystick.update()
        }

        this.player.update()
    }

    public disconnect() {
        document.removeEventListener("joystickcreated", this.joystickListener)
    }
}

new Game()