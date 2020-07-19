const waitFor = (timeMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeMs))

export { waitFor }