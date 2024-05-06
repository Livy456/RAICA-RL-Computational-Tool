const Direction = {
    Forward: 0,
    Backward: 1,
    Left: 2,
    Right: 3
}

class Car{
    constructor(x, y, width, height, player)
    {
        this.x = x;           // x position of car
        this.y = y;           // y position of car  
        this.width = width;   // width of car
        this.height = height; // height of car
        
        this.player = player; // boolean value indicating if car is player or not
        this.damaged = false;   // confirms whether the car is damaged or not 
        this.car_sensors = new Sensor(this); // creates sensor object using car instance
        this.learning = new reinforcementLearning(this, this.car_sensors); 

        this.car_points = [
                            {x: this.x - this.width/2,
                            y: this.y - this.height/2}, // top left point of car
                            {x: this.x + this.width/2,
                            y: this.y - this.height/2}, // top right point of car
                            {x: this.x - this.width/2,
                            y: this.y + this.height/2}, // bottom left point of car
                            {x: this.x + this.width/2,
                            y: this.y + this.height/2}  // bottom right point of car
        ];
        this.car_img = new Image();
        this.car_img.src = "../Images/carAvatar.png";
        // this.car_img.onload()
        this.damaged_img = new Image();
        this.damaged_img.src = "../Images/damaged_car.png";
        // might have to change the points of the car to see if this changes  
        // when the player car determines when the intersection occurs
    }

    #createPoints()
    {
        const points = [];
        
        // calculates out the points radius of the car
        const radius = Math.hypot(this.width, this.height)/2;
        const angle = Math.atan2(this.width, this.height); 

        //adds objects-> {x, y} to the points array
        points.push({
            x: this.x - Math.sin(-angle)*radius,
            y: this.y - Math.cos(-angle)*radius
        });

        points.push({
            x: this.x - Math.sin(angle)*radius,
            y: this.y - Math.cos(angle)*radius
        });

        points.push({
            x: this.x - Math.sin(Math.PI - angle)*radius,
            y: this.y - Math.cos(Math.PI - angle)*radius
        });

        points.push({
            x: this.x - Math.sin(Math.PI + angle)*radius,
            y: this.y - Math.cos(Math.PI + angle)*radius
        });

        return points
    }

    #isDamaged(road_boundaries, traffic)
    {
        
        // BUG: need to fix the intersection of player car with another object        

        // checks if car has hit any of the road borders
        for(let i = 0; i < road_boundaries.length; i++)
        {
            // car_points is list of objects corresponding to 
            // x, y coordinates of following car points
            // top left, top right, bottom left, bottom right
            if (objectIntersection(this.car_points, road_boundaries[i]))
            {
                return true;
            }
        }

        // checks if the player car collided with traffic car
        for (let i=0; i < traffic.length; i++)
        {
            // DOESN'T WORK, NO TRAFFIC CAR 
            // checks if the player car collides with any of the trafic cars
            // if(trafficIntersection(this.car_points, traffic[i].car_points, this))
            // {
            //     return true;
            // }

            if (objectIntersection(this.car_points, traffic[i].car_points))
            {
                // console.log("car class, is damaged function, the car detected me!!!");
                return true;
            }
        }

        // debugger; // acts as a breakpoint
        return false;
    }

    #movePosition()
    {
        setTimeout(this.learning.Qlearning(), 5000);
        
        // default movement for a non player character is forward
        if (! this.player)
        {
            this.y-=0.1;
        }

        // moves player car forward
        if(this.player && (this.learning.actions_to_take_array[Direction.Forward]))
        {
            this.y -= 0.2
        }

        // moves player backward
        else if(this.player && (this.learning.actions_to_take_array[Direction.Backward]))
        {
            this.y+=0.2
        }

        // moves player car to right
        if(this.player && (this.learning.actions_to_take_array[Direction.Right]))
        {
            this.x+=0.5;
        }

        // moves player car to the left
        else if(this.player && (this.learning.actions_to_take_array[Direction.Left]))
        {
            this.x-=0.5;
        }
    }

    updateCar(road_boundaries, traffic, playing_game=true)
    {
        if (! playing_game)
        {
            this.car_points = this.#createPoints();
            this.damaged = this.#isDamaged(road_boundaries, traffic);
        }

        // stops the car if collision occurred or if it moved past the road boundaries
        if(( (!this.damaged) || (!this.player) ) && (playing_game))
        {
            this.#movePosition();
            this.car_points = this.#createPoints();
            this.damaged = this.#isDamaged(road_boundaries, traffic);
        }
    
        // draws sensors for the player car
        if (this.player)
        {
            this.car_sensors.updateSensor(road_boundaries, traffic);
        }
    }

    drawPlayer(ctx)
    {
        this.car_sensors.drawSensor(ctx); // draws on the sensors
        
        if (this.damaged)
        {
            // checks if the damaged image has been drawn once onto the canvas
            if (this.damaged_img.complete)
                {
                    ctx.drawImage(this.damaged_img, this.x - this.width/2, this.y - this.height/2, 
                                this.width+10, this.height+20);
                }
        }
        else
        {
            // checks if the player car image has been drawn once onto the canvas
            if (this.car_img.complete)
            {
                ctx.drawImage(this.car_img, this.x - this.width/2, this.y - this.height/2, 
                            this.width, this.height);
            }
        }
    }

    drawTraffic(ctx)
    {
        if (this.damaged)
        {
            ctx.fillStyle = "red";
        }
        else
        {
            ctx.fillStyle = "blue";    
        }
        ctx.beginPath();
        ctx.moveTo(this.car_points[0].x, this.car_points[0].y);

        for (let i = 1; i < this.car_points.length; i++)
        {
            ctx.lineTo(this.car_points[i].x, this.car_points[i].y);
        }
        ctx.fill();
    }
}
