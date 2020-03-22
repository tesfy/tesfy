import Testy from "./Testy";

describe("Testy", () => {
  test("1", () => {
    const testy = new Testy();

    testy.hello();

    expect(true).toBeTruthy();
  });
});
