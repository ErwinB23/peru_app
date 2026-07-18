export const createResponse = () => {
  const response = {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };

  return response;
};

export const createRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  files: undefined,
  file: undefined,
  ...overrides
});
