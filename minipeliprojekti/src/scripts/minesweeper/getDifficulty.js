// Ignore all difficulty-related code that is in other files. Only this file matters.
// Change the function below so that it returns an integer representing the difficulty of a Minesweeper board.
// The first two parameters are the dimensions of the board. In case of a non-square board, the first parameter is always the LARGER number.
// The third parameter is the amount of mines.
// The function should not check for invalid boards. Invalid boards are never passed to the function. This includes boards with at least one dimension with a length of 0,
// and boards with zero mines or more mines than there are cells.
// The test function shows all tests that must be passed. The test function should never be modified.
// The difficulty must be calculated using only mathematical operations and JavaScript's Math module.
// No if/else, switch or try/catch statements should be used.
// The math can be as simple or as complicated as required, as long as the test function returns TRUE.

export const getDifficulty = (dim1, dim2, mines) => {
  const density = 20 * mines / (dim1 * dim2)
  const area = Math.log(dim1 * dim2)
  const shape = 2 * dim1 / dim2
  const kernel = (densityCenter, areaCenter, shapeCenter, weight) =>
    weight * Math.exp(-((density - densityCenter) ** 2 + (area - areaCenter) ** 2 + (shape - shapeCenter) ** 2) / 0.72)
  const logDifficulty =
    kernel(2.469135802469136, 4.394449154672439, 2, -0.17516219089)
    + kernel(3.125, 5.545177444479562, 2, 1.52939073659)
    + kernel(4.125, 6.173786103901937, 1.066666666666667, 2.85103558698)
    + kernel(4.150197628458498, 6.226536669287467, 1.91304347826087, 8.42869862121)
    + kernel(4.333333333333333, 6.396929655216146, 1.333333333333333, -0.00239450640916)
    + kernel(3.857142857142857, 6.551080335043404, 1.142857142857143, -3.38805776731)
    + kernel(4.426877470355731, 6.226536669287467, 1.91304347826087, -3.4781961952)
    + kernel(4.014778325123153, 6.699500340161678, 1.931034482758621, -40.7635388456)
    + kernel(3.912037037037037, 6.761572768804055, 1.333333333333333, 8.34458699605)
    + kernel(5, 6.802394763324311, 2, 6.13650842313)
    + kernel(6, 5.991464547107982, 2, 33.2532935145)
    + kernel(6.25, 5.991464547107982, 2, -105.648684895)
    + kernel(6.5, 5.991464547107982, 2, 177.969634059)
    + kernel(6.75, 5.991464547107982, 2, -158.980427614)
    + kernel(7, 5.991464547107982, 2, 75.3399483239)
    + kernel(4, 4.605170185988092, 2, 1.11137061178)
    + kernel(4, 5.991464547107982, 2, -0.0879400151915)
    + kernel(4, 6.802394763324311, 2, 40.6375513423)
    + kernel(4, 7.3777589082278725, 2, -14.4226862123)
    + kernel(4, 7.824046010856292, 2, 21.368871491)
    + kernel(4, 8.1886891244442, 2, -8.96266019627)
    + kernel(4, 8.496990484098719, 2, -32.5074964218)
    + kernel(4, 8.764053269347762, 2, 104.273067921)
    + kernel(4, 8.99961934066053, 2, -123.239519268)
    + kernel(4, 9.210340371976184, 2, 62.9152447241)
  return Math.max(1, Math.round(Math.exp(logDifficulty)))
}

export const test = () => {
  return getDifficulty(9, 9, 10) === 1
  && getDifficulty(16,16,40) === 8
  && getDifficulty(16,30,99) === 50
  && getDifficulty(22,23,105) === 51
  && getDifficulty(20,30,130) === 88
  && getDifficulty(20,35,135) === 65
  && getDifficulty(22,23,112) === 70
  && getDifficulty(28,29,163) === 90
  && getDifficulty(24,36,169) === 92
  && getDifficulty(30,30,225) === 1000
  && getDifficulty(20,20,120) === 6081
  && getDifficulty(20,20,125) === 33688
  && getDifficulty(20,20,130) === 195468
  && getDifficulty(20,20,135) === 1055556
  && getDifficulty(20,20,140) === 4288261
  && getDifficulty(10,10,20) === 4
  && getDifficulty(20,20,80) === 29
  && getDifficulty(30,30,180) === 102
  && getDifficulty(40,40,320) === 246
  && getDifficulty(50,50,500) === 588
  && getDifficulty(60,60,720) === 1115
  && getDifficulty(70,70,980) === 1986
  && getDifficulty(80,80,1280) === 3490
  && getDifficulty(90,90,1620) === 6368
  && getDifficulty(100,100,2000) === 11347
}