function linear_interpolation(a, b, f)
{
    // function to calculate intermediate values between the two ends of the road
    // a denotes the left side of the road
    // b denotes the right side of the road
    // f denotes what fraction of the road we want to occupy
    
    return a + (b-a) *f;
}

function getIntersection(start, end, left_boundary, right_boundary)
{
    const top_road_t = (right_boundary.x - left_boundary.x) * (start.y - left_boundary.y) 
                     - (right_boundary.y - left_boundary.y) * (start.x - left_boundary.x); 
    const top_road_u = (left_boundary.y - start.y) * (start.x - end.x) 
                     - (left_boundary.x - start.x) * (start.y - end.y);
    const bottom = (right_boundary.y - left_boundary.y) * (end.x - start.x)
                 - (right_boundary.x - left_boundary.x) * (end.y - start.y);
                 
    if (bottom !=0)
    {
        const t = Math.abs(top_road_t / bottom);
        const u = Math.abs(top_road_u / bottom);

        if(t >= 0 && t <=1 && u >= 0 && u <=1)
        {
            // finds what fraction of sensor is intersecting object in the x and y direction
            return {x: linear_interpolation(start.x, end.x, t),
                    y: linear_interpolation(start.y, end.y, t),
                    offset: t}
        }
    }

    return null;    
}


// FIX THIS FUNCTION LATER SO THAT IT IS ABLE TO DETECT WHEN TWO CAR OBJECTS COLLIDE WITH EACH OTHER!!!
function trafficIntersection(player, traffic, car)
{ 
    const tc_top_left = traffic[0];       // top left point of traffic car
    const tc_top_right = traffic[1];      // top right point of traffic car
    const tc_bottom_left = traffic[2];    // bottom left point of traffic car
    const tc_bottom_right = traffic[3];   // bottom right point of traffic car

    // checks if player car collides with any region of a specific traffic car
    for (let i=0; i<player.length;i++)
    {
        carPoint = player[i]; // gets one of the points of the car

        // checks if player x point is in between traffic car x points
        // checks if player y point is in between traffic car y points
        if ((carPoint.x >= tc_top_left.x) && (carPoint.x <= tc_top_right) &&
            (carPoint.y >= tc_top_left.y) && (carPoint.y <= tc_bottom_left))
        {
            return true;
        }

        // else if((carPoint.x >= tc_top_left.x) && (carPoint.y <= tc_bottom_right.y))
        // {
        //     document.write(" I am to the right of the top left corner point of traffic car")
        // }


    }
    
    return false;
}
function objectIntersection(player, object2)
{
    for (let i = 0; i < player.length; i++)
    {
        for (let j = 0; j < object2.length; j++)
        {
            const intersect = getIntersection(
                player[i], 
                player[(i+1)%player.length],
                object2[j],
                object2[(j+1)%object2.length]
            );
            
            if (intersect)
            {
                return true;
            }
        }
    }
    return false;
}

// come back to later and change parameter names!!!!
function playerCarIntersectRoad(sensor, road_boundary_left, road_boundary_right, car)
{
    
    const left_boundary = road_boundary_left[0];   // top left road boundary, has same x value of bottom left road boundary
    const right_boundary = road_boundary_right[0]; // top right road boundary, has same x value of bottom right road boundary  

    // let left_boundary = road_boundary_left;
    // let right_boundary = road_boundary_right;
    const start_point = sensor[0];
    const end_point = sensor[1]; // end point of sensor
    
    // document.write("hmmmm", left_boundary)
    // checks for intersection in x coordinate value
    if (parseInt(end_point.x) < parseInt(left_boundary.x + car.width + 5))
    {   
        
        // document.write("left intersection dectected");
        const t = 1- Math.abs((left_boundary.x - end_point.x) / (left_boundary.x + end_point.x)) -0.4;
        // t was originally a constant 0.4

        // computes the amount of sensor crossing road left boundary 
        return {x: linear_interpolation(start_point.x, end_point.x, t),// left_boundary.x + car.width + 5 - start_point.x,
                y: linear_interpolation(start_point.y, end_point.y, t),
                offset: t};
    }

    if (parseInt(end_point.x) > parseInt(right_boundary.x- car.width-5))
    {        
        const t = Math.abs((right_boundary.x - end_point.x) / (right_boundary.x + end_point.x)) +0.4;

        // computes the amount of sensor crossing road right boundary 
        return {x: linear_interpolation(start_point.x, end_point.x, t),
                y: linear_interpolation(start_point.y, end_point.y, t),
                offset: t};
    }
    // document.write("no intersections detected!!");

    return null;
}
