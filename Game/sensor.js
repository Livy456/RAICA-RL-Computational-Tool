class Sensor
{
    constructor(car)
    {
        this.car = car; // car object
        // this.num_sensors = 5; 
        // this.num_sensors = 3
        this.num_sensors = 31; 
        this.sensor_length = 50;
        // this.sensor_arc = Math.PI/2; // 90 degree angle between sensors
        this.sensor_arc = Math.PI*2; // 360 degree 
        this.sensor_readings = [];
        this.sensors = [];
    }

    updateSensor(road_x_boundaries, traffic)
    {
        this.#createSensor();
        
        this.sensor_readings = [];
        // left road boundary x is 97.5
        // right road boundary x is 452.5

        // will check if the sensor segment has intersected another object
        for(let i=0; i < this.num_sensors; i++)
        {
            // document.write("sensor readings!!");
            const sensor_reading = this.get_sensor_readings(this.sensors[i], road_x_boundaries, traffic);
            this.sensor_readings.push(sensor_reading);
        }
    }
    #createSensor()
    {
        this.sensors = [];
        
        for(let i=0; i < this.num_sensors; i++)
        {
            const sensorAngle = linear_interpolation(this.sensor_arc/2, -this.sensor_arc/2, i/(this.num_sensors-1)); 
            // const sensorAngle = linear_interpolation(Math.PI, -Math.PI, i/(this.num_sensors-1)); // 360 sensing capability

            const start_sensor_segment = {x: this.car.car_points[0].x - this.car.width/2,
                                          y: this.car.car_points[0].y + this.car.height/2}
            
            const end_sensor_segment = {x: this.car.car_points[0].x - this.car.width/2- Math.sin(sensorAngle) * this.sensor_length,
                                        y: this.car.car_points[0].y + this.car.height/2 - Math.cos(sensorAngle) * this.sensor_length};       
            
            // const start_sensor_segment = {x: this.car.x, y: this.car.y}; // the sensor starts at the car object x and y position
            // const end_sensor_segment = {x: this.car.x - Math.sin(sensorAngle)*this.sensor_length,
            //                             y: this.car.y  - Math.cos(sensorAngle)*this.sensor_length};

            this.sensors.push([start_sensor_segment, end_sensor_segment]); // adds the sensor line segment 
        }
    }

    get_sensor_readings(sensor, road_boundaries, traffic)
    {
        let all_intersections = [];

        // for(let i=0; i < road_boundaries.length; i++)
        // {
        //     // if no intersections this function will return none
        //     // if there is an intersection then getIntersection returns, object -> x, y, offset
        //     // sensor[0] => start object
        //     // sensor[1] => end object
        //     // road_boundaries[i][0] => left side of road object
        //     // road_boundaries[i][1] => right side of road object

        
        //     // const intersection = carIntersectRoad(sensor, road_boundaries[i][0], road_boundaries[i][1]);
        //     const intersection = getIntersection(sensor[0], sensor[1], road_boundaries[i][0], road_boundaries[i][1]);
        //     // const intersection = objectIntersection(sensor, road_boundaries[i])
            
    
        //     // checks for any intersections
        //     if (intersection)
        //     {
        //         // document.write("car sensor class, get sensor reading method, intersection detected!!!");
        //         // intersection is being detected!!!
        //         all_intersections.push(intersection);
        //     }
        // }
        
        // checks for sensor intersection with the left or right road boundary
        const intersection = playerCarIntersectRoad(sensor, road_boundaries[0], road_boundaries[1], this.car);
        
        if (intersection)
        {
            // intersection is being detected!!!
            all_intersections.push(intersection);
        }

        for(let i=0; i<traffic.length;i++)
        {
            const traffic_car = traffic[i].car_points;

            for (let j=0; j < traffic_car.length; j++)
            {
                
                // const intersect = playerCarIntersectRoad(sensor, traffic_car[j], traffic_car[(j+1) %traffic_car.length], this.car);

                const intersect = getIntersection(sensor[0], sensor[1], 
                                                  traffic_car[j], traffic_car[(j+1)%traffic_car.length]);
                if (intersect)
                {
                    all_intersections.push(intersect);
                }
            }
        }

        // WILL HAVE TO DEFINE MY OWN FUNCTION FOR DETECTING WHETHER OR NOT A PLAYER CAR COLLIDES
        // WITH THE TRAFFIC CAR
        // for (let i=0; i< traffic.length;i++)
        // {
        //     const collision = playerCarIntersect(sensor, traffic[0], traffic[1], this.car);
            
        //     if (intersection)
        //     {
        //         // intersection is being detected!!!
        //         all_intersections.push(intersection);
        //     }
        // }

        // checks if sensors are intersecting no other objects
        if(all_intersections.length === 0)
        { 
            return null; // no intersections
        }

        else
        {
            let offsets = [];

            // add all the offsets from the sensor to object
            for (let i=0; i < all_intersections.length; i++)
            {
                offsets.push(all_intersections[i].offset); // gets the offset attribute from each intersection object
            }

            // const minimum_offset = Math.min(offsets); // unsure if Math.min can unpack an array if we have to 
            let minimum_offset = 100000;

            // iterate through each offset value and check which is smallest
            for (let i=0; i < offsets.length; i++)
            {
                const offset_value = offsets[i];

                if (offset_value < minimum_offset)
                {
                    minimum_offset = offset_value;
                }
            }

            // finds the closest object that the car is sensing
            const closest_object = all_intersections.find(element => element.offset === minimum_offset);

            return closest_object
        }
    }

    // draws each of the sensors at an angle pertruding from the car
    drawSensor(ctx)
    {
        for(let i=0; i < this.num_sensors; i++)
        {
            const start = this.sensors[i][0];
            let end = this.sensors[i][1]; // can be modified
            const previous_end = this.sensors[i][1];
            
            if (this.sensor_readings[i])
            {
                end = this.sensor_readings[i]; // sets end to the object -> x, y, offset
            }

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(previous_end.x, previous_end.y);
            ctx.stroke();

            // colors the intersection region of sensor red 
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "red";
            ctx.moveTo(previous_end.x, previous_end.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}