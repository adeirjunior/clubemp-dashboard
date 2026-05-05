const env = {
  BACKEND_API_URL: process.env.BACKEND_API_URL ?? "",
  BACKEND_ALLOW_SELF_SIGNED_TLS:
    process.env.BACKEND_ALLOW_SELF_SIGNED_TLS ?? "",
  MARKETING_APP_URL: process.env.MARKETING_APP_URL ?? "",
};

export default env;
