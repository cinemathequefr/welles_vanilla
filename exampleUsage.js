import createFSM from "./createFSM.js";

const states = {
  idle: {
    on: {
      START: "working",
    },
    onEnter: (prevState, newState) => {
      console.log(`Entered ${newState} from ${prevState}`);
    },
  },
  working: {
    on: {
      FINISH: "done",
    },
    delay: 3000, // Autotransition after 3 seconds
    on: {
      "": "done", // Autotransition target
    },
    onEnter: (prevState, newState) => {
      console.log(`Entered ${newState} from ${prevState}`);
    },
  },
  done: {
    onEnter: (prevState, newState) => {
      console.log(`Entered ${newState} from ${prevState}`);
    },
  },
};

const fsm = createFSM(states, "idle");

(async () => {
  console.log(`Initial state: ${fsm.getState()}`);
  await fsm.send("START"); // Transition to "working"
  console.log(`Current state: ${fsm.getState()}`);

  // Wait for the autotransition to "done"
  setTimeout(() => {
    console.log(`Final state: ${fsm.getState()}`);
  }, 4000);
})();
