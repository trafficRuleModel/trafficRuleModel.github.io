// initialize the road ( create a two dimension matrix )
function zeros2(x, y)
{
	var zeros = new Array(x);
	for (i = 0; i < x; i++)
		zeros[i] = new Array(y);
	for (i = 0; i < x; i++)
	{
		for (j = 0; j < y; j++)
		{	zeros[i][j] = 0; }
	}
	return zeros;
}
// define three dimension matrix for gap
function zeros3(x, y, z)
{
	var zeros = zeros2(x, y);
	for (i = 0; i < x; i++)
	{
		for (j = 0; j < y; j++)
		{	zeros[i][j] = new Array(z); }
	}
	for (i = 0; i < x; i++)
	{
		for (j = 0; j < y; j++)
		{
			for (k = 0; k < z; k++)
			{	zeros[i][j][k] = 0; }
		}
	}
	return zeros;
}
// update the road state
function updateRoad(a_C, a_V)
{
	var road = new Object;
	road.Cell = a_C;
	road.Vel = a_V;
	road.Lane = a_C.length;
	road.Length = a_C[0].length;
	return road;
}
/*=====================*/
// calculate the gap
function calculateGap(road)
{
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var gap = zeros3(W, L, 5);
		// the gap[][][0] is the left front's gap
		// the gap[][][1] is the front gap
		// the gap[][][2] is the right front's gap
		// the gap[][][3] is the left behind's gap
		// the gap[][][4] is the right behind's gap
	/*-----------------*/
	// calculate the left gap
	for (i = 1; i < W; i++)
	{
		// the left front gap
		for (j = 0; j < (L - 1); j++)
		{
			if (C[(i - 1)][j] == 0)
			{
				for (k = (j + 1); k < L; k++)
				{
					if (C[(i - 1)][k] != 0)
					{
						gap[i][j][0] = k - j - 1;
						break;
					}
					else
					{
						if (k == (L - 1))
						{
							gap[i][j][0] = L - j - 1;
						}
					}
				}
			}
		}
		// the left behind gap
		for (j = (L - 1); j > 1; j--)
		{
			if (C[(i - 1)][j] == 0)
			{
				for (k = (j - 1); k >= 0; k--)
				{
					if (C[(i - 1)][k] != 0)
					{
						gap[i][j][3] = j - k - 1;
						break;
					}
					else
					{
						if (k == 0)
						{
							gap[i][j][3] = j;
						}
					}
				}
			}
		}
	}
	// calculate the front gap
	for (i = 0; i < W; i++)
	{
		for (j = 0; j < (L - 1); j++)
		{
			for (k = (j + 1); k < L; k++)
			{
				if (C[i][k] != 0)
				{
					gap[i][j][1] = k - j - 1;
					break;
				}
				else
				{
					if (k == (L - 1))
					{
						gap[i][j][1] = L - j - 1;
					}
				}
			}
		}
	}
	// calculate the right gap
	for (i = 0; i < (W - 1); i++)
	{
		// the right front gap
		for (j = 0; j < (L - 1); j++)
		{
			if (C[(i + 1)][j] == 0)
			{
				for (k = (j + 1); k < L; k++)
				{
					if (C[(i + 1)][k] != 0)
					{
						gap[i][j][2] = k - j - 1;
						break;
					}
					else
					{
						if (k == (L - 1))
						{
							gap[i][j][2] = L - j - 1;
						}
					}
				}
			}
		}
		// the right behind gap
		for (j = (L - 1); j >= 1; j--)
		{
			if (C[(i + 1)][j] == 0)
			{
				for ( k = (j - 1); k >= 0; k--)
				{
					if (C[(i + 1)][k] != 0)
					{
						gap[i][j][4] = j - k - 1;
						break;
					}
					else
					{
						if (k == 0)
						{
							gap[i][j][4] = j;
						}
					}
				}
			}
		}
	}
	return gap;
}
/*=====================*/
// find the location of the last car
function findLastCar(road)
{
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var lastC = new Array(W);
	for (i = 0; i < W; i++)
	{
		for (j = 0; j < L; j++)
		{
			if (C[i][j] != 0)
			{
				lastC[i] = j;
				break;
			}
			else
			{
				if (j == (L - 1))
				{
					lastC[i] = L;
					// it means that there is no car one the lane
				}
			}
		}
	}
	return lastC;
}/*=====================*/
// find the location of the lead car
function findLeadCar(road)
{
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var leadC = new Array(W);
	for (i = 0; i < W; i++)
	{
		for (j = (L - 1); j >= 0; j--)
		{
			if (C[i][j] != 0)
			{
				leadC[i] = j;
				break;
			}
			else
			{
				if (j == 0)
				{
					leadC[i] = -1;
					// it means that there is no car on the lane
				}
			}
		}
	}
	return leadC;
}

/*=====================*/
// judge the safety
function judgeSafety(road)
{
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var gap = calculateGap(road);
	// judge the right side safety, if safe, the value is 1, else the value is 0
	var rightSafe = zeros2(W, L);
	for (i = 0; i < (W - 1); i++)
	{
		for (j = 0; j < L; j++)
		{
			if ((C[i][j] != 0) && (C[i + 1][j] == 0))
			{
				if ((gap[i][j][2] >= V[i][j]) || (gap[i][j][2] + j >= (L - 1)))
				{
					if (gap[i][j][4] >= j)
					// judge right behind if car or not
					{	rightSafe[i][j] = 1; }
					else
					{
						if (gap[i][j][4] >= V[i + 1][(j - gap[i][j][4] - 1)])
						{	rightSafe[i][j] = 1; }
					}
				}
			}
		}
	}
	// judge the left side safety, if safe, the vale is 1, else the value is 0
	var leftSafe = zeros2(W, L);
	for (i = 1; i < W; i++)
	{
		for (j = 0; j < L; j++)
		{
			if ((C[i][j] != 0) && (C[i - 1][j] == 0))
			{
				if ((gap[i][j][0] >= V[i][j]) || (gap[i][j][0] + j >= (L - 1)))
				{
					if (gap[i][j][3] > (j - 1))
					{	leftSafe[i][j] = 1; }
					else
					{
						if (gap[i][j][3] >= V[(i - 1)][(j - gap[i][j][3] - 1)])
						{	leftSafe[i][j] = 1; }
					}
				}
			}
		}
	}
	var safety = new Object;
	safety.left = leftSafe;
	safety.right = rightSafe;
	return safety;
}
/*---------------------*/
// Driving Right-Most
function driveRight(road, vLim, pErr)
{
	if (Math.random() <= pErr)
		return road;
	/*\------------------\*/
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var gap = calculateGap(road);
	var newC = zeros2(W, L);
	var newV = zeros2(W, L);
	var safety = judgeSafety(road);
	var leftSafe = safety.left;
	var rightSafe = safety.right;
	// change lane
	for (i = 0; i < W; i++)
	{
		for (j = 0; j < L; j++)
		{
			if (C[i][j] != 0)
			{
				if (rightSafe[i][j] == 1)
				{
					newC[(i + 1)][j] = C[i][j];
					newV[(i + 1)][j] = V[i][j];
				}
				else
				{
					if (((leftSafe[i][j] == 1) && ((gap[i][j][1] <= V[i][j]) && (gap[i][j][0] > gap[i][j][1]))) && (newC[(i - 1)][j] == 0))
					{
					// if the right is not safe, and the front is not enough to run fast, and the left is safe, go left to overtaking
					// if the left is using by the car go right, can not change lane
						newC[(i - 1)][j] = C[i][j];
						newV[(i - 1)][j] = V[i][j];
					}
					else
					{
						newC[i][j] = C[i][j];
						newV[i][j] = V[i][j];
					}
				}
			}
		}
	}
	return updateRoad(newC, newV);
}
/*==================================*/
/*\ THIS IS WORK FOR INSUREFASTLANE\*/
function checkLaneType(road)
{
	var W = road.Lane;
	var laneType = new Array(W);
	for (i = (W - 1); i >= 0; i--)
	{
		if (i > 0)
		{
			var ii = W - i - 1;
			var t = ii - Math.floor(ii/3)*3;
			if (t == 0 || t == 2)
			{	laneType[i] = 1; }
			else
			{	laneType[i] = 0; }
		}
		else
		{
			if (laneType[1] == 1)
			{	laneType[0] = 0; }
			else
			{	laneType[0] = 1; }
		}
	}
	return laneType;
}
/*---------------------*/
// Insure the exist of fast lane
function insureFastLane(road, vLim, pErr)
{
	if (Math.random() <= pErr)
		return road;
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var gap = calculateGap(road);
	var newC = zeros2(W, L);
	var newV = zeros2(W, L);
	var safety = judgeSafety(road);
	var leftSafe = safety.left;
	var rightSafe = safety.right;
	var laneType = checkLaneType(road);
	/*=============================*/
	// change lane
	//-----------------------------//
	// the fast lane, change lane, it's priority
	for (i = 0; i < W; i++)
	{
		for (j = 0; j < L; j++)
		{
			if (C[i][j] != 0)
			{
				if (laneType[i] == 0)
				{
					if (rightSafe[i][j] == 1)
					{
						newC[i + 1][j] = C[i][j];
						newV[i + 1][j] = V[i][j];
					}
					else
					{
						if (leftSafe[i][j] == 1)
						{
							newC[i - 1][j] = C[i][j];
							newV[i - 1][j] = V[i][j];
						}
						else
						{
							newC[i][j] = C[i][j];
							newV[i][j] = V[i][j];
						}
					}
				}
			}
		}
	}
	//--------------------------//
	// the usual lane, is inferior
	for (i = 0; i < W; i++)
	{
		for (j = 0; j < L; j++)
		{
			if (C[i][j] != 0)
			{
				if (laneType[i] == 1)
				{
					if (gap[i][j][1] < V[i][j])
					{
						if ((rightSafe[i][j] == 1) && (leftSafe[i][j] == 1))
						{
							if ((laneType[i + 1] == 0) && (newC[i + 1][j] == 0))
							{
								newC[i + 1][j] = C[i][j];
								newV[i + 1][j] = V[i][j];
							}
							else
							{
								if ((laneType[i - 1] == 0) && (newC[i - 1][j] == 0))
								{
									newC[i - 1][j] = C[i][j];
									newV[i - 1][j] = V[i][j];
								}
								else
								{
									if (newC[i + 1][j] == 0)
									{
										newC[i + 1][j] = C[i][j];
										newV[i + 1][j] = V[i][j];
									}
									else
									{
										if (newC[i - 1][j] == 0)
										{
											newC[i - 1][j] = C[i][j];
											newV[i - 1][j] = V[i][j];
										}
										else
										{
											newC[i][j] = C[i][j];
											newV[i][j] = V[i][j];
										}
									}
								}
							}
						}
						else
						{
							if ((rightSafe[i][j] == 1) && (newC[i + 1][j] == 0))
							{
								newC[i + 1][j] = C[i][j];
								newV[i + 1][j] = V[i][j];
							}
							else
							{
								if ((leftSafe[i][j] == 1) && (newC[i - 1][j] == 0))
								{
									newC[i - 1][j] = C[i][j];
									newV[i - 1][j] = V[i][j];
								}
								else
								{
									newC[i][j] = C[i][j];
									newV[i][j] = V[i][j];
								}
							}
						}
					}
					else
					{
						newC[i][j] = C[i][j];
						newV[i][j] = V[i][j];
					}
				}
			}
		}
	}
	return updateRoad(newC, newV);
}
/*\==========================================\*/
//----WORK FOR CHANGEVELOCITY----//
function slowDown(V, vLim, pErr)

{

	var p = Math.random();
	var fV = 0;

	if (p < Math.pow(pErr, (vLim - V + 1)))

	{

		fV = Math.max(0, V - 1);

	}

	else

	{

		if (p < pErr)

		{

			fV = V;

		}

		else

		{

			fV = Math.min(vLim, V + 1);

		}

	}

	return fV;

}
//---------------------------------------//
// change velocity

function changeVelocity(road, vLim, pErr)

{

	var W = road.Lane;

	var L = road.Length;

	var newC = road.Cell;

	var newV = road.Vel;

	var gap = calculateGap(road);

	var leadC = findLeadCar(road);

	for (i = 0; i < W; i++)

	{

		var ed = leadC[i];

		if (ed >= 0)

		{

			for (j = ed; j >= 0; j--)

			{

				var fV = slowDown(newV[i][j], vLim, pErr);

				if (j == ed)

				{

					newV[i][j] = fV;

				}

				else

				{

					if (newC[i][j] != 0)

					{

						var jj = gap[i][j][1] + 1 + j;

						newV[i][j] = Math.min(fV, gap[i][j][1]);

					}

				}

			}

		}

	}

	return updateRoad(newC, newV);

}

/*=====================*/
// update state
function updateState(road)
{
	var W = road.Lane;
	var L = road.Length;
	var C = road.Cell;
	var V = road.Vel;
	var newC = zeros2(W, L);
	var newV = zeros2(W, L);
	var countOut = 0;
	// update the exist car state
	for (i = 0; i < W; i++)
	{
		for (j = 0; j < L; j++)
		{
			if (C[i][j] != 0)
			{
				newJ = j + V[i][j];
				if (newJ < L)
				{
					newC[i][newJ] = C[i][j];
					newV[i][newJ] = V[i][j];
				}
				else
				{
					countOut++;
				}
			}
		}
	}
	var road = updateRoad(newC, newV);
	return {Road: road, Count: countOut };
}
/*=====================*/
// ready flow in new car
function flowInCar(road, vLim, pFlowIn)
{
	var W = road.Lane;
	var lastC = findLastCar(road);
	var countIn = 0;
	// flow in car
	for (i = 0; i < W; i++)
	{
		if (Math.random() <= pFlowIn)
		{
			var loc = Math.min(vLim, (lastC[i] - 1));
			if (loc >= 0)
			{
				road.Cell[i][loc] = 1;
				road.Vel[i][loc] = loc;
				countIn++;
				
			}
		}
	}
	return {Road: road, Count:countIn};
}
// count car on the road
function countCar(road)
{
	var C = road.Cell;
	var W = road.Lane;
	var L = road.Length;
	var quantCar = 0;
	for (i = 0; i < w; i++)
	{
		for (j = 0; j < l; j++)
		{
			if (C[i][j] != 0)
			{
				quantCar++;
			}
		}
	}
	return quantCar;
}
function trafficRuleMain(road, vLim, pFlowIn, pErr, rule)
{
/*
	vLim: the road's limit velocity;
	pFlowIn: the flow in car's density
	pErr: the probability of slow down by drivers
	rule: the traffic rule to change lane
	road: for initialize the road, this is a Object, the properties can refer by function 'updateRoad(C, V)'.
*/
	/*---------CHANGE LANE------------*/
	// IF ADD NEW RULE, WILL ADD THE FLOW CODE'S CASE
	switch (rule)
	{
		case "driveRight": road = driveRight(road, vLim, pErr); break;
		case "insureFastLane": road = insureFastLane(road, vLim, pErr); break;
	}
	/*---------CHANGE VELOCITY------------*/
	road = changeVelocity(road, vLim, pErr);
	/*--------- UPDATE STATE AND COUNT THE FLOW OUT'S CAR ------------*/
	var roadAndOut = updateState(road);
	road = roadAndOut.Road;
	var quantOut = roadAndOut.Count;
	/*--------- FLOW IN NEW CAR ------------*/
	var roadAndIn = flowInCar(road, vLim, pFlowIn);
	road = roadAndIn.Road;
	var quantIn = roadAndIn.Count;
	/*======================================*/
	var roadModel = new Object;
	roadModel.Road = road;
	roadModel.cIn = quantIn;
	roadModel.cOut = quantOut;
	return roadModel;
}
