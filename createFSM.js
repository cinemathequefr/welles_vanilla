/**
 * createFSM
 * 2025-10-24
 * @param {object} states Enhanced state definition with actions
 * @param {string?} initialState État initial
 * @returns {object} FSM instance
 */
export default function createFSM(states, initialState = "initial") {
  return {
    states: states,
    currentState: initialState,
    timeoutId: null, // Track the timeout for autotransitions

    async send(event) {
      const currentStateConfig = this.states[this.currentState];
      if (
        currentStateConfig &&
        currentStateConfig.on &&
        currentStateConfig.on[event]
      ) {
        const transition = currentStateConfig.on[event];
        const prevState = this.currentState;

        // Handle string target or object with target + action
        let newState, action;
        if (typeof transition === "string") {
          newState = transition;
        } else {
          newState = transition.target;
          action = transition.action;
        }

        // Execute onExit action
        if (currentStateConfig.onExit) {
          await currentStateConfig.onExit(prevState, newState, event);
        }

        // Execute transition action (handle async)
        if (action) {
          await action(prevState, newState, event);
        }

        this.currentState = newState;

        // Clear any existing autotransition timeout
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }

        // Execute onEnter action and handle autotransition
        const newStateConfig = this.states[newState];
        if (newStateConfig) {
          if (newStateConfig.onEnter) {
            await newStateConfig.onEnter(prevState, newState, event);
          }

          // Schedule autotransition if delay is defined
          if (
            newStateConfig.delay &&
            newStateConfig.on &&
            newStateConfig.on[""]
          ) {
            this.timeoutId = setTimeout(() => {
              this.send("");
            }, newStateConfig.delay);
          }
        }

        return this.currentState;
      }
      return this.currentState;
    },

    // ...existing methods...
    getState: function () {
      return this.currentState;
    },

    is: function (state) {
      return this.currentState === state;
    },

    reset: function () {
      // Clear any existing autotransition timeout
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.currentState = initialState;
      return this.currentState;
    },
  };
}
