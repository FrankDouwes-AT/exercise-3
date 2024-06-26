/*
    I always prefer to use the T prefix for types, This stems from an old way to define Interfaces (almost the same thing),
    the benefit in TS, is that it identifies imports/logic that is only there for the compiler, you can mentally skip it
    when doing complex logic (lowers the mental capacity needed to understand modern JS).
*/

export type TClosestValuesParams = {
    array: Array<number>,
    needle: number,
    number: number
}

export type TDistanceItem = {
    index: number,
    value: number,
    distance: number
}