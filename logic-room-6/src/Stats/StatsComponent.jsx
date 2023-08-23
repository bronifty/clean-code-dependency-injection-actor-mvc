import React from "react";
import StatsPresenter from "./StatsPresenter";

const StatsComponent = () => {
  const statsPresenter = new StatsPresenter();
  const [vm, setVm] = React.useState("");
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    statsPresenter.load((vm) => {
      setVm(vm);
    });
    statsPresenter.getTotal((total) => setTotal(total));
  }, []);
  return (
    <div>
      <h5>Last Added Book (ui)</h5>
      <div>{vm}</div>
      <h5>Total Books</h5>
      <div>{total}</div>
    </div>
  );
};

export default StatsComponent;
