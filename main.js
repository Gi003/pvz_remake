//Me when I cryyy
"use strict"

let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    backgroundColor: '#f7e1d2',
    render: {
        pixelArt: true  
    },
    fps: {
        //forceSetTimeOut:true,
        target:30
    },
    physics: {
		default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    width: 1000,
    height: 700,
    scene: [Object,GameOver]
}

const game = new Phaser.Game(config);