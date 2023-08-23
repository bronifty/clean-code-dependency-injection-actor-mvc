// observable_test.ts
import { ObservableFactory } from "./observable.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test(
  "Should create an observable value and compute based on another observable",
  async () => {
    const factory = ObservableFactory;

    const obsValue1 = factory.createObservableValue<number>(10);

    let computedValue: number | null = null;
    const obsValue2 = factory.createObservableValue<number>(
      (value: number) => value * 2
    );
    obsValue2.subscribe((current) => {
      computedValue = current;
    });

    obsValue1.subscribe(() => {
      obsValue2.accessor((value: number) => value * 2, obsValue1.accessor());
    });

    obsValue1.accessor(20); // Should trigger recomputation of obsValue2
    assertEquals(computedValue, 40);
  }
);
