const express = require("express");
const request = require("supertest")
const index = require("../routes/index");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const prisma = require("../../lib/prisma");

const app = express();
app.use(express.urlencoded({extended: false}));
app.use("/", index);

require("../config/passport")(passport);
app.use(passport.initialize())

app.use("/", index);

let authTokenUser, authTokenAdmin;
let userId, adminId;

beforeEach(async () => {
    await prisma.$transaction([
        prisma.job.deleteMany(),
        prisma.employee.deleteMany(),
        prisma.client.deleteMany(),
    ]);

    const hashpassword = await bcrypt.hash("123", 10);

    const user = await prisma.employee.create({
            data: {
                name: "jamal",
                email: "45@gmail.comk",
                username: "jamal1",
                hashpassword: hashpassword,
                phone: "222-222-2222"
            }
    });

    const admin = await prisma.employee.create({
            data: {
                name: "jamal",
                email: "3423@gmail.com",
                username: "jay2",
                hashpassword: hashpassword,
                phone: "222-222-2222",
                role: "ADMIN"
            }
    });

    const userLogin = await request(app)
    .post("/auth/login")
    .type("form")
    .send({
        username: user.username,
        password: "123"
    });

    const adminLogin = await request(app)
    .post("/auth/login")
    .type("form")
    .send({
        username: admin.username,
        password: "123"
    });
    
    authTokenUser = userLogin.body.token;
    authTokenAdmin = adminLogin.body.token;

    userId = user.id;
    adminId = admin.id;

});

describe("/employee post endpoint for invalid user name input" ,() => {
    test("empty name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Name is required.")
    })
    
    test("invalid length name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "r",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be between 2 and 50 characters.")
    })

    test("invalid characters in name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "543gdfgdfgdf",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid name.")
    })

    test("valid name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})

describe("/employee post endpoint for invalid user email input" ,() => {
    test("empty email user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "dasdsa",
                email: "",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Email is required.")
    })
    
    test("invalid email user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "rdsadsad",
                email: "random",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid email.")
    })

    test("valid email user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })
})

describe("/employee post endpoint for invalid user role input" ,() => {
    test("empty name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "fdfsdf",
                email: "random@gmail.com",
                role: "",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Role is required.")
    })
    
    test("invalid character within role user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "rdsada",
                email: "random@gmail.com",
                role: "4432s",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must only contain letters.")
    })

    test("invalid role user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "gdfgdfg",
                email: "random@gmail.com",
                role: "REGULAR",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid role.")
    })

    test("valid role user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})


describe("/employee post endpoint for invalid user phone input" ,() => {
    test("empty phone user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "dsadasd",
                email: "random@gmail.com",
                role: "USER",
                phone: "",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Phone number is required.")
    })
    
    test("invalid phone number user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "ronalsdas",
                email: "random@gmail.com",
                role: "USER",
                phone: "224343dsada",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid phone number.")
    })

    test("valid name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})

describe("/employee post endpoint for invalid user username input" ,() => {
    test("empty name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "dasdasd",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Username is required.")
    })
    
    test("invalid length username user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "rdsadasd",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "y",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be between 2 and 50 characters.")
    })

    test("invalid characters in username user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "gdfgdf",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yd'/./sdasd.,.,",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must only contain letters and numbers.")
    })

    test("valid name user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101JAmal!2",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})
