const app = require("../src/app");
supertest = require('supertest'),
request = supertest(app);

test("A aplicação deve responder na porta 3131", () => {

  return request.get("/").then(res => {
    let status = res.statusCode;
    expect(status).toEqual(200);

  }).catch(err => {
    fail(err);

  });
  
});