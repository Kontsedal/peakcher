import { EventsService } from "../common/services/Events";
import { getStore } from "../common/store";
import { slice } from "../common/store/slice";

setInterval(() => {
  EventsService.emit({
    type: "time",
    payload: { time: Date.now() },
  });
}, 1000);

const store = getStore(true);
store.subscribe(() => {
  console.log(store.getState());
});
setInterval(() => {
  store.dispatch(slice.actions.increment(1));
}, 1000);
