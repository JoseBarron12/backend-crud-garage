const express = require("express");
const request = require("supertest");
const index = require("../routes/index");
const prisma = require("../../lib/prisma");
const bcrypt = require("bcryptjs");
const passport = require("passport")

const app = express();
app.use(express.urlencoded({extended: false}));

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

describe("access protected routes w/ varying token", () => {
    test("initial GET request w/ token", async () => {
        const response = await request(app)
        .get("/job")
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
    });

    test("initial GET request w/o token", async () => {
        const response = await request(app)
        .get("/job")
        expect(response.status).toEqual(401);
    });
});

describe("access protected route /employee " , () => {
    test("GET /employee route allow admin access" , async () => {
        const response = await request(app)
        .get("/employee")
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("GET /employee route not allow regular user access" , async () => {
        const response = await request(app)
        .get("/employee")
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

    test("GET /employee/:id route allow admin access on any id" , async () => {
        const response = await request(app)
        .get(`/employee/${userId}`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("GET /employee route allow regular user access on same id" , async () => {
        const response = await request(app)
        .get(`/employee/${userId}`)
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });

    test("GET /employee route not allow regular user access on any id" , async () => {
        const response = await request(app)
        .get(`/employee/${adminId}`)
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

    test("POST /employee route allow admin access" , async () => {
        const response = await request(app)
        .post("/employee")
        .type("form")
        .send({
            name: "random name",
            email: "random@gmail.com",
            role: "USER",
            phone: "224-387-2222",
            username: "yuhyuh",
            password: "56347",
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    })

    test("POST /employee route not allow user access" , async () => {
        const response = await request(app)
        .post("/employee")
        .type("form")
        .send({
            name: "random33 name",
            email: "random@33242gmail.com",
            role: "USER",
            phone: "224-387-2222",
            username: "yu332h332432yuh",
            password: "532236347",
        })
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

    test("DELETE /employee route allow admin access" , async () => {
        const response = await request(app)
        .delete("/employee")
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    })

    test("DELETE /employee route not allow user access" , async () => {
        const response = await request(app)
        .delete("/employee")
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

    test("DELETE /employee/:id route allow admin access" , async () => {
        const response = await request(app)
        .delete(`/employee/${userId}`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    })

    test("DELETE /employee/:id route not allow user access" , async () => {
        const response = await request(app)
        .delete(`/employee/${userId}`)
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });




});