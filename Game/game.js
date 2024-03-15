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

// Instantiate Objects for game
const highway = new Road(WIDTH/2, 10, HIGHWAY_LANE_COUNT, "highway", CAR_WIDTH); // instantiates a road instance
const car = new Car(WIDTH/2 + 10, HEIGHT/2, CAR_WIDTH, CAR_HEIGHT, true); // put the car in the middle of the page
const traffic = [
    new Car(WIDTH/2 + 10, -HEIGHT/2, CAR_WIDTH, CAR_HEIGHT, false),
    new Car(WIDTH/2 + 10, -3*HEIGHT/2, CAR_WIDTH, CAR_HEIGHT, false),
    new Car(WIDTH/2 + 10, HEIGHT/8, CAR_WIDTH, CAR_HEIGHT, false),
    new Car(WIDTH/2 + 10, -3* HEIGHT/4, CAR_WIDTH, CAR_HEIGHT, false),
];

// MAYBE ADD A BUTTON THAT RESETS THE GAME WHEN THE PLAYER GETS DAMAGED/COLLIDES WITH OTHER OBJECTS
// MIGHT HAVE TO ADD A NEW FUNCTION TO CAR CALLED RESTART, WHICH RESETS THE damaged ATTRIBUTE value

let button = document.getElementById("Start-Button");
let play_game = false;
console.log(button);
button.value = "Play";

function startPlayingGame(btn){
    console.log("Inner html of button", btn.textContent);

    if (btn.textContent === "Play")
    {
        play_game = true;
        btn.textContent = "Pause";
        console.log("First conditional, want to play game!!");
    }
    
    else if(btn.textContent === "Pause")
    {
        play_game = false;
        btn.textContent = "Play";
        console.log("Second conditional, want to pause game!!");
    }
    console.log("Inside onclick function!!");
    
};

// button.innerHTML = button.value;
// console.log(button);
// console.log(button.value);
// console.log(play_game);
// car.is_damaged = false;

button.onclick = startPlayingGame(button);

// button.addEventListener("click", startPlayingGame(button));
// let play_game = false;    


function animateGame()
{    
    // let button = document.getElementById("Start-Button");
    highway.drawHighwayRoad(context);   // draws the highway state for the game
    // button.onclick = startPlayingGame(button);
    // its not updating the button context


    // button.addEventListener("click", startPlayingGame(button));
    console.log("on click updated play_game ", play_game);
    if(play_game)
    {
        console.log("inside animation function!!!");
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
        requestAnimationFrame(animateGame); // repeatedly runs function, to make the game appear animated    
    }

    // button.removeEventListener("onclick", startPlayingGame(button));
}

// makes a one second delay between function calls to slow down animate
setTimeout(animateGame(), 5000);