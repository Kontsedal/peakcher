import { EventsService } from "../common/services/Events";

setInterval(() => {
  EventsService.emit({
    type: "time",
    payload: { time: Date.now() },
  });
});
