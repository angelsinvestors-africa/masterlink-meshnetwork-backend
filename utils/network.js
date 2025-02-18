/**
 * optimizeConnections
 * Inapokea orodha ya connection objects kutoka kwa native modules na
 * inafanya sorting kulingana na priority.
 */
export const optimizeConnections = (connections) => {
    return connections.sort((a, b) => b.priority - a.priority);
  };
  