import httpGateway from "../Shared/HttpGateway";
import TestHarness2 from "../TestTools/BookAdderTestHarness";
import StatsPresenter from "../Stats/StatsPresenter";

describe("add book", () => {
  it("should call api", async () => {
    // jest.clearAllMocks();
    const testHarness = new TestHarness2();
    await testHarness.init(() => {});
    await testHarness.addBook();
    console.log(httpGateway.post.mock.calls);

    expect(httpGateway.post).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/nathan.j.morton@gmail.com/books",
      {
        author: "Isaac Asimov",
        name: "I, Robot",
        ownerId: "nathan.j.morton@gmail.com"
      }
    );
  });
  it("should load and reload books", async () => {
    // jest.clearAllMocks();
    let vm = null;
    const testHarness = new TestHarness2();
    await testHarness.init((data) => {
      vm = data;
    });

    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/nathan.j.morton@gmail.com/books"
    );
    expect(vm.length).toBe(3);

    await testHarness.addBook();
    expect(httpGateway.post).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/nathan.j.morton@gmail.com/books",
      {
        author: "Isaac Asimov",
        name: "I, Robot",
        ownerId: "nathan.j.morton@gmail.com"
      }
    );
    expect(vm.length).toBe(4);
    expect(vm[3].name).toBe("I, Robot");
  });

  it("should show stats", async () => {
    // jest.clearAllMocks();
    let statsVm = null;
    let totalVm = null;
    const testHarness = new TestHarness2();
    await testHarness.init(() => {});
    let statsPresenter = new StatsPresenter();
    await statsPresenter.load((data) => (statsVm = data));
    await statsPresenter.getTotal((data) => (totalVm = data));
    await testHarness.addBook();
    expect(statsVm).toBe("I, Robot");
    expect(totalVm).toBe(4);
  });

  it("should filter public books", async () => {
    let vm = null;
    const testHarness = new TestHarness2();
    await testHarness.init((data) => {
      vm = data;
    });

    // anchor
    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/nathan.j.morton@gmail.com/books"
    );
    expect(vm.length).toBe(3);

    // pivot
    await testHarness.filterBooks();
    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/nathan.j.morton@gmail.com/allbooks"
    );
    expect(vm.length).toBe(5);
  });

  it("should sort private books", async () => {
    let vm = null;
    const testHarness = new TestHarness2();
    await testHarness.init((data) => {
      vm = data;
    });
    console.log(httpGateway.get.mock.calls);

    // anchor
    expect(httpGateway.get).toHaveBeenCalledWith(
      "https://api.logicroom.co/api/nathan.j.morton@gmail.com/books"
    );
    expect(vm.length).toBe(3);
    expect(vm[0].name).toBe("Wind in the willows");

    // pivot
    await testHarness.sortBooks();

    // assert
    expect(vm.length).toBe(3);
    expect(vm[0].name).toBe("I, Robot");
  });
});
