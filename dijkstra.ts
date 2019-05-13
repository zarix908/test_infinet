interface Road {
  from: number;
  to: number;
  time: number;
}

interface Neighbour {
  cross_number: number;
  time: number;
}

function setNeighbours(
  roads: Road[],
  neighbours: Map<number, Neighbour[]>,
  minTimes: Map<number, number>
) {
  for (const road of roads) {
    if (!neighbours.has(road.from)) {
      neighbours.set(road.from, []);
    }

    minTimes.set(road.from, Infinity);
    minTimes.set(road.to, Infinity);

    // @ts-ignore
    neighbours.get(road.from).push({ cross_number: road.to, time: road.time });
  }
}

function setMinTimes(
  current: number,
  neighbours: Map<number, Neighbour[]>,
  minTimes: Map<number, number>,
  visited: Map<number, boolean>,
  parents: Map<number, number>
) {
  const currentNeighbours = neighbours.get(current);

  if (currentNeighbours === undefined) {
    return;
  }

  for (const { cross_number, time } of currentNeighbours) {
    if (visited.has(cross_number)) {
      continue;
    }
    // @ts-ignore
    const timeToNeighbour = minTimes.get(current) + time;

    // @ts-ignore
    if (timeToNeighbour < minTimes.get(cross_number)) {
      minTimes.set(cross_number, timeToNeighbour);
      parents.set(cross_number, current);
    }
  }
}

function chooseMinTimeCross(
  current: number,
  minTimes: Map<number, number>,
  visited: Map<number, boolean>
): number {
  let minTimeCross = null;
  let minTime = Infinity;

  // @ts-ignore
  for (const crossNumber of minTimes.keys()) {
    if (visited.has(crossNumber)) {
      continue;
    }

    const time = minTimes.get(crossNumber);

    // @ts-ignore
    if (time < minTime) {
      // @ts-ignore
      minTime = time;
      minTimeCross = crossNumber;
    }
  }

  if (minTimeCross === null) {
    throw Error();
  }

  visited.set(minTimeCross, true);
  return minTimeCross;
}

function buildPath(parents: Map<number, number>, finish: number) {
  let current = finish;
  const path = [];

  while (current !== -1) {
    path.push(current);
    // @ts-ignore
    current = parents.get(current);
  }

  return path.reverse();
}

export function navigate(roads: Road[], start: number, finish: number) {
  const neighbours = new Map();
  const minTimes = new Map();
  const parents = new Map();
  setNeighbours(roads, neighbours, minTimes);

  const visited = new Map();

  let current = start;
  minTimes.set(current, 0);
  visited.set(current, true);
  parents.set(current, -1);

  while (current !== finish) {
    setMinTimes(current, neighbours, minTimes, visited, parents);
    current = chooseMinTimeCross(current, minTimes, visited);
  }

  return { path: buildPath(parents, finish), time: minTimes.get(finish) };
}
