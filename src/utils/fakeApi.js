const fakeApi = {
  changeReadStatus: () => new Promise((resolve) => setTimeout(resolve, 300)),
  logVisit: (_userData) => new Promise((resolve) => setTimeout(resolve, 300)),
};

export default fakeApi;
