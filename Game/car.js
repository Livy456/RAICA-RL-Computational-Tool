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
        this.learning = new reinforcementLearning(this.car_sensors); 

        // NO LONGER NEED THE CONTROLS CLASS
        // this.controls = new Controls(player); // no controls for non player cars

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
        // checks if car has hit any of the road borders
        for(let i = 0; i < road_boundaries.length; i++)
        {
            // car_points is list of objects corresponding to x, y coordinates of following car points
            // top left, top right, bottom left, bottom right
            if (objectIntersection(this.car_points, road_boundaries[i]))
            {
                return true;
            }
            // continue;

        }

        // checks if the player car collided with traffic car
        for (let i=0; i < traffic.length; i++)
        {
            // checks if the player car collides with any of the trafic cars
            // if(trafficIntersection(this.car_points, traffic[i].car_points, this))
            // {
            //     return true;
            // }
            if (objectIntersection(this.car_points, traffic[i].car_points))
            {
                return true;
            }
        }
        return false;

    }

    // movePosition(road_boundaries, top, bottom)
    #movePosition()
    {
        // document.write("I made it in the move position function in simulation car!!!");
        // console.time(); // starts the time 
        // setTimeout(this.learning.Qlearning(), 2000);
        // console.timeEnd();
        this.learning.Qlearning();
        
        // default movement for a non player character is forward
        if (! this.player)
        {
            this.y-=0.5;
        }

        // moves the car object's x and y positions
        // bound the carPlayer to the grey road
        // if (this.controls.forward && car.y > 0)
        // if (this.controls.forward && car.y > top)
        
        
    
        // if (this.controls.forward)
        // if(this.player && (this.learning.actions_to_take.get("Forward")))

        // 0 index corresponds to forward action
        if(this.player && (this.learning.actions_to_take_array[0]))
        {
            this.y -= 0.7
        
        }


        // bound the carPlayer to the grey road
        // if (this.controls.right && car.x +car.width < (3*WIDTH/4))
        // if ( this.player && (this.learning.actions_to_take.get("Right")))
        if(this.player && (this.learning.actions_to_take_array[3]))
        // if (this.controls.right)
        {
            this.x+=2;
        }




        // bound the carPlayer to the grey road
        // if (this.controls.backward && car.y + car.height <= bottom)
        // if (this.player && (this.learning.actions_to_take.get("Backward")))
        if(this.player && (this.learning.actions_to_take_array[1]))
        // if (this.controls.backward)
        {
            this.y+=0.7;
        }




        // bound the carPlayer to the grey road
        //if (this.controls.left && car.x > (WIDTH/4) + HIGHWAY_LINE_WIDTH)
        //if (this.controls.left && car.x > (WIDTH/4))
        // if (this.player && (this.learning.actions_to_take.get("Left")))
        if(this.player && (this.learning.actions_to_take_array[2]))
        // if (this.controls.left)
        {
            this.x-=2;
        }

        // this.learning.actions_to_take.forEach((action, boolean_value) => {
        //     this.learning.actions_to_take.set(action, false);
        // });
    }

    updateCar(road_boundaries, traffic)
    {
        // document.write("updating car!!");
        // stops the car from moving past the road boundaries


        // CREATE A RESET FUNCTION SO THAT IF THE CAR GETS INTO A COLLISION
        // WITH ANOTHER CAR OR THE ROAD IT WILL RESET AT THE MIDDLE OF THE SIMULATION ENVIRONMENT
        // OR MAKE ADD IN A BUTTON TO THE CANVAS WHENEVER this.damaged == true

        if(!this.damaged)
        {
            this.#movePosition();
            this.car_points = this.#createPoints();
            this.damaged = this.#isDamaged(road_boundaries, traffic);
            // document.write("car class, updateCar function, not damaged!!");}
        }
        // this.#movePosition();
        // this.car_points = this.#createPoints();
        // this.damaged = this.#isDamaged(road_boundaries);
        

        if (this.player)
        {
            // document.write("before updating car sensor in car file, update car method");
            this.car_sensors.updateSensor(road_boundaries, traffic);
            console.log(this.car_sensors);
        }
    }

    drawPlayer(ctx)
    {
        
        if (this.damaged)
        {
            // ctx.fillStyle = "grey";
            // change this to grey version of the car
            const img = new Image();
            img.onload = () =>{
                ctx.drawImage(img, this.x, this.y, this.width, this.height);
            };
            img.src = "../Images/carAvatar.png";
        }
        else
        {
            // ctx.fillStyle = "black";    
        }
        
        // // ctx.fillRect(this.x, this.y, this.width, this.height);
        // ctx.beginPath();
        // ctx.moveTo(this.car_points[0].x, this.car_points[0].y);

        // for (let i = 1; i < this.car_points.length; i++)
        // {
        //     ctx.lineTo(this.car_points[i].x, this.car_points[i].y);
        // }
        // ctx.fill();
    
        this.car_sensors.drawSensor(ctx); // draws on the sensors
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
        // ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.moveTo(this.car_points[0].x, this.car_points[0].y);

        for (let i = 1; i < this.car_points.length; i++)
        {
            ctx.lineTo(this.car_points[i].x, this.car_points[i].y);
        }
        ctx.fill();
    }
}
