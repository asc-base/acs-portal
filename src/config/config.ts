interface IRuntimeConfig {
  apiUrl: string;
}

let runtimeConfig: IRuntimeConfig | null = null;

export const getRuntimeConfig = async (): Promise<IRuntimeConfig> => {
  if (runtimeConfig) {
    return runtimeConfig;
  }

  const res = await fetch("/api/config", { cache: "no-store" });
  runtimeConfig = await res.json();
  return runtimeConfig!;
};
