interface AlgorithmSteps {
  step1(): void;
  step2(): void;
  step3(): void;
}
class StepImplementation1 implements AlgorithmSteps {
  step1(): void {
    console.log("StepImplementation1: Step 1");
  }
  step2(): void {
    console.log("StepImplementation1: Step 2");
  }
  step3(): void {
    console.log("StepImplementation1: Step 3");
  }
}
class StepImplementation2 implements AlgorithmSteps {
  step1(): void {
    console.log("StepImplementation2: Step 1");
  }
  step2(): void {
    console.log("StepImplementation2: Step 2");
  }
  step3(): void {
    console.log("StepImplementation2: Step 3");
  }
}
class Template {
  private steps: AlgorithmSteps;
  constructor(steps: AlgorithmSteps) {
    this.steps = steps;
  }
  templateMethod(): void {
    this.steps.step1();
    this.steps.step2();
    this.steps.step3();
  }
}
class StepFactory {
  static createStepImplementation1(): AlgorithmSteps {
    return new StepImplementation1();
  }
  static createStepImplementation2(): AlgorithmSteps {
    return new StepImplementation2();
  }
}
const stepImplementation1 = StepFactory.createStepImplementation1();
const template1 = new Template(stepImplementation1);
template1.templateMethod();
const stepImplementation2 = StepFactory.createStepImplementation2();
const template2 = new Template(stepImplementation2);
template2.templateMethod();
