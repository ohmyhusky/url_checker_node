export function select(arr: Array<[string, number]>): [string, number] {
  const length = arr.length;
  if (length === 1) {
    return arr[0];
  }
  if (length <= 5) {
    // group is small enough to get mid number in one round
    for (let index = 1; index < length; index++) {
      const compare = arr[index];
      let insertPoint = index;
      for (let i = 0; i < index; i++) {
        if (arr[i][1] > compare[1]) {
          insertPoint = i;
          break;
        }
      }
      if (insertPoint !== index) {
        for (let i = index; i > insertPoint; i--) {
          arr[i] = arr[i - 1];
        }
        arr[insertPoint] = compare;
      }
    }
    if (length === 2) {
      // js number....
      return arr[0];
    }
    return arr[Math.floor(length / 2)];
  }

  const midSize = Math.ceil(length / 5);
  const midArray = new Array<[string, number]>(midSize);
  let midIndex = 0;

  for (let startPoint = 0; startPoint < length; startPoint += 5) {
    let endPoint = startPoint + 5;
    if (endPoint > length) {
      endPoint = length;
    }

    // do insert sort instead of built-in sort since the scale <= 5
    for (let index = startPoint + 1; index < endPoint; index++) {
      const compare = arr[index];
      let insertPoint = index;
      for (let i = startPoint; i < index; i++) {
        if (arr[i][1] > compare[1]) {
          insertPoint = i;
          break;
        }
      }
      if (insertPoint !== index) {
        for (let i = index; i > insertPoint; i--) {
          arr[i] = arr[i - 1];
        }
        arr[insertPoint] = compare;
      }
    }

    midArray[midIndex++] =
      arr[startPoint + Math.floor((endPoint - startPoint) / 2)];
  }

  return select(midArray);
}

// "top n", O(n)
// for equivalent value record, randomly pick some (unless there are more requirements provided)
export function top(
  arr: Array<[string, number]>,
  topNo: number
): Array<[string, number]> {
  if (arr.length < 5) {
    // small scale, not worth to split into smaller group
    for (let index = 1; index < arr.length; index++) {
      const compare = arr[index];
      let insertPoint = -1;
      for (let i = 0; i < index && insertPoint === -1; i++) {
        if (arr[i][1] > compare[1]) {
          insertPoint = i;
          break;
        }
      }
      if (insertPoint !== index && insertPoint !== -1) {
        for (let i = index; i > insertPoint; i--) {
          arr[i] = arr[i - 1];
        }
        arr[insertPoint] = compare;
      }
    }

    const result = new Array<[string, number]>(topNo);
    for (let i = topNo - 1, j = arr.length - 1; i >= 0; i--, j--) {
      result[i] = arr[j];
    }
    return result;
  }

  // incase all items are equal, use arr.length
  const lessTmp = new Array<[string, number]>(arr.length);
  let lIndex = 0;

  const greaterTmp = new Array<[string, number]>(arr.length);
  let gIndex = 0;

  const equalTmp = new Array<[string, number]>(arr.length);
  let eIndex = 0;

  const mid = select(arr);

  for (let i = 0; i < arr.length; i++) {
    if (arr[i][1] < mid[1]) {
      lessTmp[lIndex++] = arr[i];
    } else if (arr[i][1] === mid[1]) {
      equalTmp[eIndex++] = arr[i];
    } else {
      greaterTmp[gIndex++] = arr[i];
    }
  }

  if (gIndex === topNo) {
    const greater = new Array<[string, number]>(gIndex);
    for (let i = 0; i < gIndex; i++) {
      greater[i] = greaterTmp[i];
    }
    return greater;
  }

  if (gIndex === topNo - 1) {
    const greater = new Array<[string, number]>(topNo);
    for (let i = 0; i < gIndex; i++) {
      greater[i] = greaterTmp[i];
    }
    greater[gIndex] = mid;
    return greater;
  }

  if (gIndex > topNo) {
    const greater = new Array<[string, number]>(gIndex);
    for (let i = 0; i < gIndex; i++) {
      greater[i] = greaterTmp[i];
    }
    return top(greater, topNo);
  }

  const result = new Array<[string, number]>(topNo);
  for (let i = 0; i < gIndex; i++) {
    result[i] = greaterTmp[i];
  }

  for (let i = gIndex, j = 0; i < topNo && j < eIndex; i++, j++) {
    result[i] = equalTmp[j];
    if (i === topNo - 1) {
      return result;
    }
  }

  // the greater and equal are still not enough
  const greaterAndEqual = gIndex + eIndex;
  const gap = topNo - greaterAndEqual;

  const less = new Array<[string, number]>(lIndex);
  for (let i = 0; i < lIndex; i++) {
    less[i] = lessTmp[i];
  }

  const topOfRest = top(less, gap);
  for (let i = 0; i < topOfRest.length; i++) {
    result[greaterAndEqual + i] = topOfRest[i];
  }

  return result;
}
