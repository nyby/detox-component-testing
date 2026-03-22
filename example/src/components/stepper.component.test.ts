import { by, element, expect } from "detox";
import { mount, spy, expectSpy } from "@nyby/detox-component-testing/test";

describe("Stepper", () => {
  it("renders with default count of 0", async () => {
    await mount("Stepper");
    await expect(element(by.id("counter"))).toHaveText("0");
  });

  it("renders with initial prop", async () => {
    await mount("Stepper", { initial: 5 });
    await expect(element(by.id("counter"))).toHaveText("5");
  });

  it("increments the count", async () => {
    await mount("Stepper", { initial: 0 });
    await element(by.id("increment")).tap();
    await expect(element(by.id("counter"))).toHaveText("1");
  });

  it("decrements the count", async () => {
    await mount("Stepper", { initial: 10 });
    await element(by.id("decrement")).tap();
    await expect(element(by.id("counter"))).toHaveText("9");
  });

  it("calls onChange with the new count", async () => {
    await mount("Stepper", { initial: 0, onChange: spy("onChange") });
    await element(by.id("increment")).tap();
    await expectSpy("onChange").toHaveBeenCalled();
    await expectSpy("onChange").toHaveBeenCalledTimes(1);
    await expectSpy("onChange").lastCalledWith(1);
  });

  it("calls onChange on each interaction", async () => {
    await mount("Stepper", { initial: 5, onChange: spy("onChange") });
    await expect(element(by.id("counter"))).toHaveText("5");
    await element(by.id("increment")).tap();
    await expect(element(by.id("counter"))).toHaveText("6");
    await element(by.id("increment")).tap();
    await expect(element(by.id("counter"))).toHaveText("7");
    await element(by.id("decrement")).tap();
    await expect(element(by.id("counter"))).toHaveText("6");
    await expectSpy("onChange").toHaveBeenCalledTimes(3);
    await expectSpy("onChange").lastCalledWith(6);
  });
});
