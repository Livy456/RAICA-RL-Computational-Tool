class reinforcementLearning
{
    constructor(car, sensor)
    {
        this.num_states = 4;
        this.num_actions = 5;
        this.car = car;
        this.sensor = sensor;
        this.states = ["Car Detected", "Road Border Detected", "Collision", "Nothing Detected"];
        this.actions = ["Forward", "Backward", "Left", "Right", "Stop"];
        this.reward_array = this.#getRewards();
        this.reward_matrix = [];
        this.qTable = [];

        // ADD ANOTHER STATE, SPLIT UP THE ROAD BORDER INTO LEFT AND RIGHT BORDER DETECTED
        
        // initialize all q values to 0
        for (let i=0; i<this.num_states; i++)
        {
            let q_values = [];
            let reward_values = [];

            for (let j=0; j<this.num_actions;j++)
            {
                // q_values.push(Math.random() * this.num_actions);
                reward_values.push(1);
                q_values.push(0);
            }
            this.qTable.push(q_values);
            this.reward_matrix.push(reward_values);
        }
        
        // this.states = this.#getStates();                 // array of possible states for the car
        // this.actions = this.#getActions();               // array of possible actions for the car
        this.learning_rate = this.#getLearningRate();    // learning rate for the q learning process
        this.gamma = 0.9;   
        this.policy = new Map();                    // empty mapping of optimal action for car to take given a state
        this.current_action = "Forward";            // current action for player car to take
        this.current_state = "Nothing Detected";    // current state for player car
        this.actions_to_take = new Map([
            ["Forward", false],
            ["Backward", false],
            ["Left", false],
            ["Right", false],
            ["Stop", false],
        ]);
        this.actions_to_take_array = [false, false, false, false, false];
        this.action_index_mapping = new Map([
            ["Forward", 0],
            ["Backward", 1],
            ["Left", 2],
            ["Right", 3],
            ["Stop", 4],
        ]);
        this.state_index_mapping = new Map([
            ["Car Detected", 0],
            ["Road Border Detected", 1],
            ["Collision", 2],
            ["Nothing Detected", 3],
        ]);

        // MIGHT NEED TO ADD MORE STATES
        // CAR DETECTED FRONT
        // CAR DETECTED BEHIND
        // ROAD BORDER DETECTED LEFT
        // ROAD BORDER DETECTED RIGHT
        // END OF ROAD? - Road border detected above/below

        this.action_index_mapping = new Map([
            ["Forward", 0],
            ["Backward", 1],
            ["Left", 2],
            ["Right", 3],
            ["Stop", 4],
        ]);        
    }

    // #getStates()
    // {
    //     let states = [];
        
    //     for (let number = 0; number < this.num_states; number++)
    //     {
    //         let state_number = number + 1;
    //         let state_name = "state" + state_number.toString();
    //         let table = document.getElementById(state_name);
    //         let data = table.innerHTML;
    //         states.push(data);
    //     }

    //     return states;
    // }

    #getRewards()
    {
        let reward_array = [];
        const id_name = "value";

        for (let i = 1; i <= this.num_actions; i++)
        {
            let reward_id = id_name + i.toString();
            let reward = document.getElementById(reward_id).value;
            reward_array.push(reward);
        }

        this.reward_array = reward_array;
    }

    #getLearningRate()
    {
        let slider = document.getElementById("lr_slider");
        const learning_rate = slider.value / 100;

        // get learning rate from slider
        return learning_rate
    }

    #updateValues()
    {
        // updates learning rate based on slider value
        let slider = document.getElementById("lr_slider");
        this.learning_rate = slider.value / 100;
        let lr_label = document.getElementById("learning_rate_value");
        lr_label.innerHTML = this.learning_rate;
        const q_id_name = "q_value";
        const reward_id_name = "value";
        let heading = document.getElementById("q_values_heading");
        heading.innerHTML = "Q Values for " + this.current_state;
        let current_state_index = this.state_index_mapping.get(this.current_state);
        this.reward_matrix[current_state_index] = this.reward_array;
        // console.log(this.reward_matrix[current_state_index]);
        // console.log(this.reward_array);
        // console.log("qtable values: ", this.qTable);
        // let current_state_index = this.state_index_mapping.get(this.current_state);

        for (let i=1; i <= this.num_actions; i++)
        {
            let q_id = q_id_name + i.toString();
            let q_cell = document.getElementById(q_id);
            let reward_id = reward_id_name + i.toString();
            let reward_cell = document.getElementById(reward_id);

            let q_value = this.qTable[current_state_index][i-1].toFixed(2);
            let reward_value = this.reward_matrix[current_state_index][i-1];
            q_cell.innerHTML = q_value;
            reward_cell.value = reward_value;
        }

    }

    // need to make a time step function to be able to make a time step to the next state
    #updateState()
    {
        let state = "Nothing Detected";
        const num_sensors_quadrant = parseInt(this.sensor.num_sensors / 4);

        for (let i=0; i < this.sensor.num_sensors; i++)
        {
        
            // check if sensor intersected something
            if (this.sensor.sensor_readings[i])
            {
                // sensors in top right of the car detected something
                if (i <= num_sensors_quadrant - 1)
                {
                    state = "Object Intersection in Front";
                    this.current_state = "Car Detected";
                }

                // sensors in bottom right of the car detected something
                else if(num_sensors_quadrant - 1 < i && i <= 2*num_sensors_quadrant - 1)
                {
                    state = "Right Object Intersection";
                    this.current_state = "Road Border Detected";
                }

                // sensors in bottom left of the car detected something
                else if(2*num_sensors_quadrant - 1 < i && i <= 3*num_sensors_quadrant - 1)
                {
                    state = "Left Object Intersection";
                    this.current_state = "Road Border Detected";
                }

                // sensors in top left of the car detect something
                else if (i <= 4*num_sensors_quadrant-1)
                {
                    state = "Object Intersection in Front";
                    this.current_state = "Car Detected";
                }
                break;
                // let end = this.sensor.sensors[i][1];
                // // the car is not updating whether it is damaged
                // if (this.car.damaged)
                // {
                //     console.log("I got into a collision!!");
                //     state = "Collision";
                //     this.current_state = "Collision";
                //     break;
                // }

                // // check if object intersection is to left of the car
                // if (end.x < this.sensor.car.car_points[0].x) 
                // {
                //     state = "Left Object Intersection";
                //     this.current_state = "Road Border Detected";
                // }

                // // check if object intersection is in front of the car
                // else if (end.y < this.sensor.car.car_points[0].y)
                // {
                //     state = "Object Intersection in Front";
                //     this.current_state = "Car Detected";
                // }

                // // check if object intersection is to right of the car
                // else if (end.x > this.sensor.car.car_points[1].x)
                // {
                //     state = "Right Object Intersection";
                //     this.current_state = "Road Border Detected";
                // }

                // // check if object intersection is behind the car
                // else if (end.y > this.sensor.car.car_points[1].y)
                // {
                //     state = "Object Intersection Behind";
                //     this.current_state = "Car Detected";
                // }

                // break;
            }
        }

        return state
    }

    #optimalQValue(transition_state_index)
    {
        let optimal_action = "Forward";
        let max_qvalue = -100;

        // EXPLOITATION OPTION, greedy choice

        // selects a random state to transition to 
        for (let action_index = 0; action_index < this.num_actions; action_index++)
        {
            const q_value = this.qTable[transition_state_index][action_index];
            
            if(max_qvalue < q_value)
            {
                max_qvalue = q_value
                optimal_action = this.actions[action_index]
            }
        }

        // returns optimal action to take a given state and corresponding q value
        return optimal_action
    }

    // chooses an action to take given the current state
    #chooseAction(state)
    {
        // EXPLORATION OPTION, random choice
        // gets a random number from 0 to number of actions - 1
        const random_action_index = Math.floor(Math.random() * this.actions.length); 

        return this.actions[random_action_index];
    }

    #rewardFunction(prevState, nextState)
    {
        
        let reward = Math.random()*this.num_states;

        if(prevState === "Nothing Detected")
        {

            // continue to detected nothing
            if(nextState === "Nothing Detected")
            {
                // return 5
                // returns a random value between 0 and 5
                return reward 
            }

            else if (nextState === "Road Border Detected")
            {
                // return -1
                // returns a random value between -5 and 0
                return -reward
            }

            else if (nextState === "Collision")
            {
                // return -5
                return -reward
            }

            else if (nextState === "Car Detected")
            {
                // return -1
                return -reward
            }
        }

        if(prevState === "Car Detected")
        {

            // continue to detected nothing
            if(nextState === "Nothing Detected")
            {
                // return 5
                return reward
            }

            else if (nextState === "Road Border Detected")
            {
                // return 1
                return reward
            }

            else if (nextState === "Collision")
            {
                // return -5
                return -reward
            }

            else if (nextState === "Car Detected")
            {
                // return -1
                return -reward
            }
            
        }

        if(prevState === "Road Border Detected")
        {

            // continue to detected nothing
            if(nextState === "Nothing Detected")
            {
                // return 5
                return reward
            }

            else if (nextState === "Road Border Detected")
            {
                // return 0
                return reward
            }

            else if (nextState === "Collision")
            {
                // return -5
                return -reward
            }

            else if (nextState === "Car Detected")
            {
                // return 1
                return reward
            }
        }

        if(prevState === "Collision")
        {

            // continue to detected nothing
            if(nextState === "Nothing Detected")
            {
                // return 5
                return reward
            }

            else if (nextState === "Road Border Detected")
            {
                // return 1
                return reward
            }

            else if (nextState === "Collision")
            {
                // return -5
                return -reward
            }

            else if (nextState === "Car Detected")
            {
                // return -5
                return -reward
            }
        }
    }

    #image_url(state)
    {
        // assumes state is a string of a single state
        if(state === "Collision")
        {
            return "player_collision.png";
        }

        else if (state === "Nothing Detected")
        {
            return "player_nothing_detected.png";
        }

        else if(state === "Car Detected")
        {
            return "car_detected.png";
        }

        else if(state === "Left Road Border Detected")
        {   
            return "player_intersect_left_border.png";
        }

        else if(state === "Right Road Border Detected")
        {
            return "player_intersect_right_border.png";
        }   
    }

    Qlearning()
    {
        this.#getRewards();
        const state_index = this.state_index_mapping.get(this.current_state);
        this.reward_matrix[state_index] = this.reward_array; // updates the reward values for current state
        this.#updateValues(); 
        
        const prevState = this.current_state;
        const new_state = this.#updateState();
        this.current_action = this.#chooseAction(new_state); // Chooses a random action for new state
        const action_index = this.action_index_mapping.get(this.current_action);

        // resets all the actions
        this.actions_to_take.forEach((action, boolean_value) => {
            this.actions_to_take.set(action, false);
        });

        for(let i=0; i<this.actions_to_take_array.length; i++)
        {
            this.actions_to_take_array[i] = false;
        }

        let state_label  = document.getElementById("current_state")
        let state_img = document.getElementById("current_state_img");
        state_label.innerHTML = this.current_state;
        state_img.src = "../Game/Images/" + this.#image_url(this.current_state);

        let probability = Math.random();
        let threshold = 0.75;
        const new_reward = this.#rewardFunction(prevState, this.current_state);
        let optimal_action = this.#optimalQValue(state_index);
        
        const reward = this.reward_array[action_index];
        const current_q_value = this.qTable[state_index][action_index]

        // sets the next action to take to be the optimal action based on reward value
        this.actions_to_take.set(optimal_action, true);
        const new_action_index = this.action_index_mapping.get(optimal_action)
        this.actions_to_take_array[new_action_index] = true;

        // OLD REWARD SYSTEM
        this.qTable[state_index][action_index] = (1 - this.learning_rate) * current_q_value +
                                this.learning_rate * (reward + this.gamma);

        // NEW REWARD SYSTEM
        // this.qTable[state_index][action_index] = (1 - this.learning_rate) * current_q_value +
        //                             this.learning_rate * (new_reward + this.gamma);
    }
}
