import * as PIXI from 'pixi.js'
import { Joystick } from './arcade/joystick'

export class Player extends PIXI.Sprite {
    
    public joystick : Joystick;
    public playerTexture : PIXI.Texture;
    
    constructor(joystick: Joystick, playerTexture: PIXI.Texture) {
        super(playerTexture)
        this.texture = playerTexture
        this.x = 150
        this.y = 150
        this.anchor.set(0.5)

        this.joystick = joystick
    }

    public update() {
        this.x += this.joystick.X * 5
        this.y += this.joystick.Y * 5
    }
}
