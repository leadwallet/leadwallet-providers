import allProviders from "./blockchains/providers";

export const getProviders = (config: any = {}) => {
  return allProviders(config);
};
