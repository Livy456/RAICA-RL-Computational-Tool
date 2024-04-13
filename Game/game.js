// gets the canvas element
const canvas = document.getElementById("car_game_design");
const context = canvas.getContext("2d");
let gameState = "highway";
const WIDTH = 550;
const HEIGHT = 150;
const HIGHWAY_LINE_WIDTH = 5;
const HIGHWAY_LANE_COUNT = 3;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 35;
const traffic_car_positions = [ [WIDTH/2 + 10, -HEIGHT/2],
                                [WIDTH/2 + 10, -3*HEIGHT/2],
                                [WIDTH/2 + 10, HEIGHT/8],
                                [WIDTH/2 + 10, -3* HEIGHT/4]];

// Instantiate Objects for game
const highway = new Road(WIDTH/2, 10, HIGHWAY_LANE_COUNT, "highway", CAR_WIDTH); // instantiates a road instance
const car = new Car(WIDTH/2 + 10, 2 * HEIGHT/3 + 50, CAR_WIDTH, CAR_HEIGHT, true); // put the car in the middle of the page
const traffic = [
    new Car(traffic_car_positions[0][0], traffic_car_positions[0][1], CAR_WIDTH, CAR_HEIGHT, false),
    new Car(traffic_car_positions[1][0], traffic_car_positions[1][1], CAR_WIDTH, CAR_HEIGHT, false),
    new Car(traffic_car_positions[2][0], traffic_car_positions[2][1], CAR_WIDTH, CAR_HEIGHT, false),
    new Car(traffic_car_positions[3][0], traffic_car_positions[3][1], CAR_WIDTH, CAR_HEIGHT, false),
];

// MAYBE ADD A BUTTON THAT RESETS THE GAME WHEN THE PLAYER GETS DAMAGED/COLLIDES WITH OTHER OBJECTS
// MIGHT HAVE TO ADD A NEW FUNCTION TO CAR CALLED RESTART, WHICH RESETS THE damaged ATTRIBUTE value

let play_game = false;

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
        car.damaged = false;
        let learning_rate = document.getElementById("lr_slider");
        let lr_label = document.getElementById("learning_rate_value");
        learning_rate.value = 50;
        lr_label.innerHTML = learning_rate.value / 100;
        // resets the car's position
        car.x = WIDTH/2 + 10;
        car.y = 2 * HEIGHT/3 + 50;

        // resets the traffic carss position
        for(let i=0; i<traffic.length;i++)
        {
            traffic[i].x = traffic_car_positions[i][0];
            traffic[i].y = traffic_car_positions[i][1];
        }
        
    }
};

function animateGame()
{    
    highway.drawHighwayRoad(context);   // draws the highway state for the game
    let button = document.getElementById("Start-Button");
    // console.log("button value: ", button.value);

    if(button.value === "Pause" || button.value === "Reset")
    {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height) // resets the canvas so the moving objects don't blend into one long line
        
        for(let i = 0; i < traffic.length; i++)
        {
            // will stop the traffic car if it goes outside road boundaries or collides with the player car
            traffic[i].updateCar(highway.road_boundaries, [car]);
        }
        car.updateCar(highway.road_boundaries, traffic); // updates the position of the car
        // car.movePosition(highway.road_boundaries, highway.topRoad, highway.bottomRoad); // moves x and y position of car object
        
        // make the highway seem like it's moving
        context.save();
        context.translate(0, -car.y + 3*HEIGHT / 4); // WEIRD 1 PIXEL HORIZONTAL BLUE LINE FORMS ON THE CANVAS
        // context.translate(0, -car.y + HEIGHT / 2) // LOOKS NORMAL
                                    
        highway.drawHighwayRoad(context);   // draws the highway state for the game
        
        // document.write("highway is drawn")
        for (let j=0; j < traffic.length; j++)
        {
            traffic[j].drawTraffic(context); 
        }
        
        car.drawPlayer(context);    // redraws the car object on the canvas
        context.restore();
            
    }
    requestAnimationFrame(animateGame); // repeatedly runs function, to make the game appear animated
    
    // makes a reset button if the car is damaged
    if (car.damaged)
    {
        button.value = "Reset";
    }
}

// makes a one second delay between function calls to slow down animate

setTimeout(animateGame(), 5000);

console.log("outside the while loop!!!");
// animateGame();