// gets the canvas element
const canvas = document.getElementById("car_game_design");
const context = canvas.getContext("2d");
let gameState = "highway";
const WIDTH = 550;
const HEIGHT = 150;
const HIGHWAY_LINE_WIDTH = 5;
const HIGHWAY_LANE_COUNT = 3;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 45;
const player_car_position = [WIDTH/2 + 10, 2 * HEIGHT/3+150];
// [WIDTH/2 + 10, 2 * HEIGHT/3 + 150];
const traffic_car_positions = [ 
                                [WIDTH/2 + 10, HEIGHT/2 -50],
                                [WIDTH/2 + 10, -3*HEIGHT/2],
                                [WIDTH/2 + 10, -HEIGHT],
                                // [WIDTH/2 + 10, -3* HEIGHT/4]
                                [WIDTH/2 + 10, 2* HEIGHT/3]
                              ];



for (let i=0; i < traffic_car_positions.length; i++)
{
    let position = traffic_car_positions[i];

    console.log("this is ", i, " th car's height: ", position[1]);
}

// Instantiate Objects for game
const highway = new Road(WIDTH/2, 10, HIGHWAY_LANE_COUNT, "highway", CAR_WIDTH); // instantiates a road instance
let car = new Car(player_car_position[0], player_car_position[1], CAR_WIDTH, CAR_HEIGHT, true); // put the car in the middle of the page
let traffic = [
    new Car(traffic_car_positions[0][0], traffic_car_positions[0][1], CAR_WIDTH, CAR_HEIGHT, false),
    new Car(traffic_car_positions[1][0], traffic_car_positions[1][1], CAR_WIDTH, CAR_HEIGHT, false),
    new Car(traffic_car_positions[2][0], traffic_car_positions[2][1], CAR_WIDTH, CAR_HEIGHT, false),
    new Car(traffic_car_positions[3][0], traffic_car_positions[3][1], CAR_WIDTH, CAR_HEIGHT, false),
];

function changeRewardValue(id, index){
    
    let textfield = document.getElementById(id);
   
    // updates the reward array
    car.learning.reward_array[index] = textfield.value;
}

function startPlayingGame(){
    let button = document.getElementById("Start-Button");

    if (button.value === "Pause")
    {
        button.value = "Play";
    }
    
    else if(button.value === "Play")
    {
        button.value = "Pause";
    }    

    else if(button.value === "Reset")
    {
        button.value = "Pause"
        // resets the attributes of the player car
        car = new Car(player_car_position[0], player_car_position[1], CAR_WIDTH, CAR_HEIGHT, true)
        let learning_rate = document.getElementById("lr_slider");
        let lr_label = document.getElementById("learning_rate_value");
        learning_rate.value = 50;
        lr_label.innerHTML = learning_rate.value / 100;

        // resets the attributes of the traffic cars
        traffic = [
            new Car(traffic_car_positions[0][0], traffic_car_positions[0][1], CAR_WIDTH, CAR_HEIGHT, false),
            new Car(traffic_car_positions[1][0], traffic_car_positions[1][1], CAR_WIDTH, CAR_HEIGHT, false),
            new Car(traffic_car_positions[2][0], traffic_car_positions[2][1], CAR_WIDTH, CAR_HEIGHT, false),
            new Car(traffic_car_positions[3][0], traffic_car_positions[3][1], CAR_WIDTH, CAR_HEIGHT, false),
        ];

        // reset the q values
        for (let i=1; i <= 5; i++)
        {
            let q_id = "q_value" + i.toString();
            let q_cell = document.getElementById(q_id);
            q_cell.innerHTML = 0;
        }

        // resets the reward values
        for (let i=1; i <=5; i++)
        {
            let reward_id = "value" + i.toString();
            let reward_field = document.getElementById(reward_id);
            reward_field.value = 1;
        }
    }
};

function animateGame()
{       
    let button = document.getElementById("Start-Button");

    if(button.value === "Pause")
    {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        for(let i = 0; i < traffic.length; i++)
        {
            // will stop the traffic car if it goes outside road boundaries or collides with the player car
            traffic[i].updateCar(highway.road_boundaries, [car]);
        }
        car.updateCar(highway.road_boundaries, traffic); // updates the position of the car
        
        // make the highway seem like it's moving
        context.save();
        // context.translate(0, -car.y + 2 * HEIGHT/3);
        // context.translate(0, -car.y);       
        // context.translate(0, HEIGHT); 
        context.translate(0, -car.y - HEIGHT*2);
        // console.log("translation amount: ", -car.y + HEIGHT + 50);
        // console.log("car location: ", car.y, "; negation of location: ", -car.y);
        // console.log("height: ", HEIGHT);

        highway.drawHighwayRoad(context);   // draws the highway state for the game
        context.restore();

        // redraws traffic cars on the canvas
        for (let j=0; j < traffic.length; j++)
        {
            traffic[j].drawTraffic(context); 
        }
        car.drawPlayer(context);    // redraws the car object on the canvas
    }

    requestAnimationFrame(animateGame); // repeatedly runs function, to make the game appear animated
    
    // makes a reset button if the car is damaged
    if (car.damaged)
    {
        button.value = "Reset";
        car.learning.current_state = "Collision";

    }
}

// makes a five second delay between function calls to slow down animate
setTimeout(animateGame(), 5000);
