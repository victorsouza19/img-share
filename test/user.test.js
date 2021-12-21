const app = require("../src/app");
let supertest = require('supertest');
let request = supertest(app);

let date = Date.now();
let mainUser = {
  name: "John Doe", 
  email: `${date}@victor.com`, 
  password: "123456"

};

beforeAll(() => {
  return request.post("/users")
    .send(mainUser)
    .then(res => {})
    .catch(err => {console.log(err)});

});

afterAll(() => {
  return request.delete(`/users/${mainUser.email}`)
    .then(res => {})
    .catch(err => {console.log(err)});

});

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

        return request.delete(`/users/${user.email}`).then(() => {
        }).catch(err => { console.log({deleteErr: {err}}) });

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

    return request.post("/users").send(mainUser).then(res => {
      expect(res.statusCode).toEqual(400);
      expect(res.body.err).toEqual('E-mail already exists.');

    }).catch(err => {
        throw new Error(err);

    });
  });

});

describe("User authenticate", () => {

  it("Should be return a token when logging in", () => {
    return request.post("/auth")
    .send({email: mainUser.email, password: mainUser.password})
    .then(res => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
      
    }).catch(err => {
      throw new Error(err);

    });
  });

  it("Should not allow unregistered users to login", () => {
    return request.post("/auth")
    .send({email: "randommail@mail.com", password: "654321"})
    .then(res => {
      expect(res.statusCode).toEqual(403);
      expect(res.body.err.email).toEqual("E-mail not found.");
      
    }).catch(err => {
      throw new Error(err);

    });
  });

  it("Should not login users whose password is wrong", () => {
    return request.post("/auth")
    .send({email: mainUser.email, password: "654321"})
    .then(res => {
      expect(res.statusCode).toEqual(403);
      expect(res.body.err.password).toEqual("Wrong password.");
      
    }).catch(err => {
      throw new Error(err);

    });
  });
});