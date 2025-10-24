/**
 * createFSM
 * 2025-10-24
 * @param {object} states Objet de définition de la machine : { state_from1: { event_name1: "state-to1", event_name2: "state_to2" } }.
 * @param {string?} initialState État initial
 * @returns {object} send(event_name) : émet un événement, getState() : obtient l'état actuel, ...
 */

export default function createFSM(states, initialState = "initial") {
  return {
    // Machine definition
    states: states,

    // Current state
    currentState: initialState,

    // Event handler
    send: function (event) {
      const transitions = this.states[this.currentState];
      if (transitions && transitions[event]) {
        const newState = transitions[event];
        this.currentState = newState;
        return this.currentState;
      } else {
        return this.currentState;
      }
    },

    // Get current state
    getState: function () {
      return this.currentState;
    },

    // Check if in specific state
    is: function (state) {
      return this.currentState === state;
    },

    // Reset to initial state
    reset: function () {
      this.currentState = initialState;
      return this.currentState;
    },
  };
}
