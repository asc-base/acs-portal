type AsyncResult<T> = {
  data: T | null;
  err: Error | null;
};

// Generic helper function to handle async/await errors
export async function to<T>(promise: Promise<T>): Promise<AsyncResult<T>> {
  try {
    const data = await promise;
    return { data, err: null };
  } catch (err) {
    return {
      data: null,
      err: err instanceof Error ? err : new Error("Unknown error"),
    };
  }
}
