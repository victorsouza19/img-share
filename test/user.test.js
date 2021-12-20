const app = require("../src/app");
let supertest = require('supertest');
let request = supertest(app);

describe("User register", () => {
  
  it("Should be create a user sucessfuly", () => {

    let time = Date.now();
    let email = `${time}@mail.com`
    let user = {
      name: "Victor",
      email,
      password: "123456"
    }

    return request.post("/users")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(email);

      }).catch(err => {
        throw new Error(err);

      })
  });

  it("Should not allow users to enter empty fields", () => {

    let user = {
      name: "",
      email: "",
      password: ""
    }

    return request.post("/users")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.err).toEqual('Invalid fields.');

      }).catch(err => {
        throw new Error(err);

      })
  });

  it("Should not allow users to enter a e-mail that already exists", () => {
    let time = Date.now();
    let email = `${time}@mail.com`
    let user = {
      name: "Victor",
      email,
      password: "123456"
    }

    return request.post("/users")
      .send(user)
      .then(res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(email);

        return request.post("/users").send(user).then(res => {
          expect(res.statusCode).toEqual(400);
          expect(res.body.err).toEqual('E-mail already exists.');

        }).catch(err => {
          throw new Error(err);

        });

      }).catch(err => {
        throw new Error(err);

      })
  });

});