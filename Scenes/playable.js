class Object extends Phaser.Scene {
    constructor() {
        //Global Info
        super("MainLoop");
        this.canvas_width =  1000;
        this.canvas_height = 700;
        //Sprites
        this.my = {sprite:{}};
        this.EnemyGroup;
        this.bulletsGroup;
        this.plants = [];
        this.enableCollisions = false;
        //Mechanics
        this.selection = null;
        //Enemy Timer
        setInterval(
            this.enemyAction.bind(this),
            10000
        )
    }

    preload() {
        //Assets 
        this.load.setPath("./assets/Default(64px)/Characters/");
        this.load.image('obj_green','green_character.png');
        this.load.image('bullet_green', 'green_hand.png');
        this.load.image('obj_yellow','yellow_character.png');
        this.load.image('bullet_yellow', 'yellow_hand.png');
        this.load.image('obj_purple','purple_character.png');
        this.load.image('bullet_purple', 'purple_hand.png');
        this.load.image('obj_red','red_character.png');
        this.load.image('bullet_red', 'red_hand.png');
    }

    create() {
        //Background tile layout
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x76A524 , 1.0);

        let lawn_height = 12;
        let lawn_width = 12;
        let tile_sz = 80;
        let spc = 50;
        let center = tile_sz/2;
        this.lanes = [];

        for (let x=1;x<lawn_width;x+=2){
            for(let y=1;y<lawn_height;y+=2){
                graphics.strokeRoundedRect((spc*x)-center,(spc*y)-center,tile_sz,tile_sz,10);
                this.lanes.push(spc*y);
                console.log("Height ",spc*x, "Width", spc*y);
            }
        }

        //Toolbar---------
        let y_tb = 620; 
        let x_tb = 150; 
        let offset = 150;

        const plant1_button = this.add.graphics();
        plant1_button.fillStyle(0x76A524);
        plant1_button.fillRoundedRect(x_tb,y_tb,100,50,25);
        plant1_button.setInteractive(new Phaser.Geom.Rectangle(100, 610, 100, 50),Phaser.Geom.Rectangle.Contains);
        plant1_button.on('pointerdown', () => { console.log(this.selection)});

        const plant2_button = this.add.graphics();
        plant2_button.fillStyle(0x8ca78b);
        plant2_button.fillRoundedRect(x_tb + offset ,y_tb,100,50,25);
        plant2_button.setInteractive(new Phaser.Geom.Rectangle(100, 610, 100, 50),Phaser.Geom.Rectangle.Contains);
        plant2_button.on('pointerdown', () => { console.log(this.selection)});

        const plant3_button = this.add.graphics();
        plant3_button.fillStyle(0xefc3d2);
        plant3_button.fillRoundedRect(x_tb + offset *2,y_tb,100,50,25);
        plant3_button.setInteractive(new Phaser.Geom.Rectangle(100, 610, 100, 50),Phaser.Geom.Rectangle.Contains);
        plant3_button.on('pointerdown', () => { console.log(this.selection)});        
        
        //Sprite Group Constructing
        this.EnemyGroup = new EnemyGroup(this);
        //console.log(this.EnemyGroup);

        let enemy_array = this.EnemyGroup.getChildren()
        for (let i=0;i<20;i++){
        enemy_array[i].debugBodyColor = 0x0b5394;
        }
        //Interactive 
        this.input.on('pointerdown', (cursor)=>{
            //Making array to store plants
            this.plants.push(new Plant(this,cursor.downX,cursor.downY));
            //Accessing and getting bullet-enemy rotation
            //console.log(this.plants.slice(-1)[0].Bullets.getChildren());
            let bullet_array = this.plants.slice(-1)[0].Bullets.getChildren();
            this.enableCollisions = true;
            for (let i=0;i<6;i++){
                for (let j=0;j<20;j++){
                    this.physics.add.collider(bullet_array[i],enemy_array[j],this.hit);
                }
            }

        });
    }

    update() {
        //console.log(this.plants);
        //console.log(this.EnemyGroup.getChildren());
    }

    
    enemyAction(){
        //Action to spawn in new enemy
        let enemy_pos = this.lanes[Math.floor(Math.random() * this.lanes.length)];
        this.EnemyGroup.getEnemy(this.canvas_width,enemy_pos);
    }

    hit(bullet,enemy){
        //Collision consequences
        bullet.x = 1000;
        bullet.y = 700;
        bullet.setActive(false);
        enemy.x = 700;
        enemy.y = -60;
        console.log("HELP");
    }

}

/////////Enemy Groups////////////////////////////////////
class EnemyGroup extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world,scene);
        this.createMultiple({
            classType: Enemy, // This is the class we create just below
			frameQuantity: 20, // Create 30 instances in the pool
			active: false,
			visible: true,
            setXY: {x:50,y:-100},
			key: 'enemy'
        })
    }

    getEnemy(x,y){
        const enemy = this.getFirstDead(false);
        if (enemy){
            enemy.walk(x,y);
        }
    }
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'obj_red');
        this.game = scene;
	}
    preUpdate(time,delta){
        super.preUpdate(time,delta);

            if(this.x <= 0) {
                this.setActive(false);
                this.setVisible(false);
                this.game.scene.start("GameOver");
            }else if (this.x >= 1010){
                this.setActive(false);
                this.setVisible(false);
            }
    }

    walk(x,y){
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(-50);
    }
}

//Plant Behaviours/////////////////////////////////
class Plant extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y){
        super(scene,x,y);
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.Bullets = new Bullets(scene);
        this.put()
        this.bullet_action.bind(this),
        setInterval(
            this.bullet_action.bind(this),
            4000
        )
    }

    put(x,y){
        this.scene.physics.add.sprite(this.x,this.y,"obj_green");
    }

    bullet_action(){
        this.Bullets.getBullet(this.x,this.y);
    }
}


class Bullets extends Phaser.Physics.Arcade.Group{
    constructor(scene){
        super(scene.physics.world,scene);
        this.createMultiple({
            classType: bullet, // This is the class we create just below
			frameQuantity: 6, // Create 30 instances in the pool
			active: false,
			visible: false,
            setXY: {x:-50,y:-100},
			key: 'bullet'
        })

    }

    getBullet(x,y){
        const bullet = this.getFirstDead(false);
        if (bullet){
            bullet.move(x,y);
        }
    }
}

class bullet extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'bullet_green');
        this.scene = scene;
	}
    preUpdate(time,delta){
        super.preUpdate(time,delta);

            if(this.x > 1000) {
                this.setActive(false);
                this.setVisible(false);
            }
    }

    move(x,y){
        this.body.reset(x,y);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(50);
    }
}