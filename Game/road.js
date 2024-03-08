class Road{
    constructor(x, width, num_lanes, type, car_width)
    {
        this.x = x;
        this.width = width;
        this.height = 10;
        this.type = type; // type of road the game will design- highway, construction, stoplight, crosswalk
        this.number_lanes = num_lanes;
        this.left = WIDTH/4;
        this.right = 3*WIDTH/4; 

        this.topRoad = -1000000;        // if you make this number too small, the dashed lines disappear
        this.bottomRoad = 1000000;      // if you make this number too big, the dashed lines disappear

        const top_left_road = {x: this.left - car_width - 5, y: this.topRoad};
        const bottom_left_road = {x: this.left - car_width - 5, y: this.bottomRoad};
        const top_right_road = {x: this.right + car_width + 5, y: this.topRoad};
        const bottom_right_road = {x: this.right + car_width + 5, y: this.bottomRoad};
        
        // const top_left_road = {x: this.left - car_width - 5, y: -550};
        // const bottom_left_road = {x: this.left - car_width - 5, y: 550};
        // const top_right_road = {x: this.right + car_width + 5, y: -550};
        // const bottom_right_road = {x: this.right + car_width + 5, y: 550};

        this.road_boundaries = [[top_left_road, bottom_left_road],
                                  [top_right_road, bottom_right_road]];
    }

    drawHighwayRoad(ctx)
    {
        ctx.lineWidth = HIGHWAY_LINE_WIDTH;
        ctx.strokeStyle = "white";

        // draws the default highway road without the white dashed lines
        context.fillStyle = "lime";
        context.fillRect(0, 0, WIDTH/4, this.topRoad);
        context.fillStyle = "lime";
        context.fillRect(0, 0, WIDTH/4, this.bottomRoad);
        context.fillStyle = "lime";
        context.fillRect(3*WIDTH/4, 0, WIDTH/4, this.topRoad);
        context.fillStyle = "lime";
        context.fillRect(3*WIDTH/4, 0, WIDTH/4, this.bottomRoad);
        context.fillStyle = "#AFAFAF";
        context.fillRect(WIDTH/4, 0, WIDTH/2, this.topRoad);
        context.fillStyle = "#AFAFAF";
        context.fillRect(WIDTH/4, 0, WIDTH/2, this.bottomRoad);

        // drawing dashed lines on the highway to signify lanes
        for(let i=1; i < this.number_lanes; i++)
        {
            const x_position = linear_interpolation(this.left, this.right, i/this.number_lanes); // shifts the x value across the canvas
            
            // calculates the number of dashed lines to draw
            const space = 10;
            const dash_line_height = 20;
            const half_height_road = this.bottomRoad;   // using total height of the road would make the game too slow
            const num_dash_lines = half_height_road / dash_line_height; 

            for (let j = 0; j < num_dash_lines; j++)
            {
                const y_position = (j*dash_line_height + space*j)
                ctx.fillStyle = "white";
                ctx.fillRect(x_position, this.topRoad + y_position, this.width, this.height);
            }    
        }
    }
}