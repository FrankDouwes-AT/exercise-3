import type {TClosestValuesParams, TDistanceItem} from "~/utils/find-closest-values/types";

/*
  Typescript compatible version of Exercise 2.
*/
export default function findClosestValues(data: TClosestValuesParams): Array<number> {

  if (!data.array || !data.array.length || !data.needle || !data.number) {
    console.warn('Missing some required parameters for findClosestValues().')
    return []
  }

  data.needle = Math.trunc(data.needle)
  data.number = Math.trunc(data.number)
  data.array = data.array.map((x) => Math.trunc(x));

  const _closestValues: Array<TDistanceItem> = data.array.map((value, index): TDistanceItem => {
    return {
      index,
      value,
      distance: Math.abs(value - data.needle)
    }
  })

  _closestValues.sort((a, b) => a.distance - b.distance)

  const _slicedClosestValues: Array<TDistanceItem> = _closestValues.splice(0, data.number)

  _slicedClosestValues.sort((a, b) => a.value - b.value)

  return _slicedClosestValues.map((value) => value.value)
}
