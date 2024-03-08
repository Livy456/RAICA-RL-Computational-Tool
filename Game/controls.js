class Controls{
    constructor(isPlayer){
        this.forward = false;
        this.backward = false;
        this.right = false;
        this.left = false;

        // only gives keyboard functionality to player
        if(isPlayer)
        {
            this.#addKeyboardListeners();
        }

        // other car objects default to moving forward
        else
        {
            this.forward = true;
        }
        
    }

    #addKeyboardListeners()
    {
        document.onkeydown = (event) => {
            // does case work to switch the keyboard attributes to true, indicates key is being pressed
            switch (event.key)
            {
                // move the car forward
                case "w":
                    this.forward = true;
                    break;
                case "W":
                    this.forward = true;
                    break;
                
                // move the car in reverse
                case "s":
                    this.backward = true;
                    break;
                case "S":
                    this.backward = true;
                    break;
                
                // move the car left
                case "a":
                    this.left = true;
                    break;
                case "A":
                    this.left = true;
                    break;
                
                // move the car right
                case "d":
                    this.right = true;
                    break;
                case "D":
                    this.right = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            // does case work to switch the keyboard attributes to false, indicates key not pressed
            switch (event.key)
            {
                case "w":
                    this.forward = false;
                    break;
                case "W":
                    this.forward = false;
                    break;

                case "s":
                    this.backward = false;
                    break;
                case "S":
                    this.backward = false;
                    break;
                
                case "d":
                    this.right = false;
                    break;
                case "D":
                    this.right = false;
                    break;
                
                case "a":
                    this.left = false;
                    break;
                case "A":
                    this.left = false;
                    break;
            }
        }
    }
}