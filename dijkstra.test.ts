import { navigate } from "../../src/model/dijkstra";

describe("dijkstra should", () => {
  it("find path in oriented graph", () => {
    const roads = [
      { from: 0, to: 2, time: 5 },
      { from: 1, to: 0, time: 1 },
      { from: 2, to: 1, time: 5 }
    ];

    const result = navigate(roads, 0, 1);

    expect(result).toEqual({ path: [0, 2, 1], time: 10 });
  });

  it("not be simplicity greedy", () => {
    const roads = [
      { from: 0, to: 1, time: 2 },
      { from: 0, to: 2, time: 10 },
      { from: 1, to: 3, time: 100 },
      { from: 2, to: 3, time: 10 }
    ];

    const result = navigate(roads, 0, 3);

    expect(result).toEqual({ path: [0, 2, 3], time: 20 });
  });

  it("work correctly when isolated nodes exist", () => {
    const roads = [
      { from: 8, to: 4, time: 3 },
      { from: 8, to: 10, time: 3 },
      { from: 8, to: 7, time: 11 },
      { from: 4, to: 5, time: 7 },
      { from: 5, to: 6, time: 7 },
      { from: 6, to: 9, time: 11 },
      { from: 9, to: 1, time: 11 },
      { from: 1, to: 5, time: 5 },
      { from: 6, to: 7, time: 11 },
      { from: 8, to: 7, time: 11 },
      { from: 7, to: 9, time: 11 }
    ];

    const result = navigate(roads, 8, 9);

    expect(result).toEqual({ path: [8, 7, 9], time: 22 });
  });

  it("work correctly 1", () => {
    const roads = [
      { from: 0, to: 1, time: 7 },
      { from: 0, to: 2, time: 9 },
      { from: 0, to: 5, time: 14 },
      { from: 2, to: 5, time: 2 },
      { from: 2, to: 3, time: 11 },
      { from: 5, to: 0, time: 14 },
      { from: 5, to: 2, time: 2 },
      { from: 5, to: 4, time: 9 },
      { from: 4, to: 5, time: 9 },
      { from: 4, to: 3, time: 6 },
      { from: 3, to: 4, time: 6 },
      { from: 3, to: 2, time: 11 },
      { from: 3, to: 1, time: 15 },
      { from: 1, to: 0, time: 7 },
      { from: 1, to: 3, time: 15 },
      { from: 1, to: 2, time: 10 },
      { from: 2, to: 1, time: 10 },
      { from: 2, to: 0, time: 9 }
    ];

    const result = navigate(roads, 0, 4);

    expect(result).toEqual({ path: [0, 2, 5, 4], time: 20 });
  });

  it("work correctly 2", () => {
    const roads = [
      { from: 0, to: 1, time: 5 },
      { from: 0, to: 2, time: 10 },
      { from: 1, to: 2, time: 10 },
      { from: 1, to: 3, time: 2 },
      { from: 2, to: 3, time: 2 },
      { from: 2, to: 4, time: 5 },
      { from: 3, to: 2, time: 2 },
      { from: 3, to: 4, time: 10 }
    ];

    const result = navigate(roads, 0, 4);

    expect(result).toEqual({ path: [0, 1, 3, 2, 4], time: 14 });
  });
});
