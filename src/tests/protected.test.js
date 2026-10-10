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

describe("access protected route /employee" ,() => {
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

    test("PUT /employee route allow admin access" , async () => {
        const response = await request(app)
        .put(`/employee/${userId}`)
        .type("form")
        .send({
            name: "random name",
            email: "",
            phone: "",
            role: "",
            username: "",
            password: ""
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("PUT /employee route allow user access on same id" , async () => {
        const response = await request(app)
        .put(`/employee/${userId}`)
        .type("form")
        .send({
            name: "random name",
            email: "",
            phone: "",
            role: "",
            username: "",
            password: ""
        })
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });


    test("PUT /employee route not allow user access" , async () => {
        const response = await request(app)
        .put(`/employee/${adminId}`)
        .type("form")
        .send({
            name: "random name",
            email: "",
            phone: "",
            role: "",
            username: "",
            password: ""
        })
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

});

describe("access protected route /client" ,() => {
    test("GET /client route allow admin access" , async () => {
        const response = await request(app)
        .get("/client")
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("GET /client route allow regular user access" , async () => {
        const response = await request(app)
        .get("/client")
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });

    test("GET /client/:id route allow admin access on any id" , async () => {
        const response = await request(app)
        .get(`/client/${userId}`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("GET /client/:id route allow regular user access on any id" , async () => {
        const response = await request(app)
        .get(`/client/${userId}`)
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });

    test("POST /client route allow admin access" , async () => {
        const response = await request(app)
        .post("/client")
        .type("form")
        .send({
            name: "jamal hersldsad",
            email: "filler@gmail",
            phone: "334-546-9832",
            address: "23 S Brokhill New Jersey 34422",
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("POST /client route allow regular user access" , async () => {
        const response = await request(app)
        .post("/client")
        .type("form")
        .send({
            name: "jamal hersldsad",
            email: "filler@gmail",
            phone: "334-546-9832",
            address: "23 S Brokhill New Jersey 34422",
        })
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });

    test("DELETE /client route allow admin access" , async () => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });

        const response = await request(app)
        .delete("/client")
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("DELETE /client route not allow regular user access" , async () => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });
        
        const response = await request(app)
        .delete("/client")
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

    test("DELETE /client/:id route allow admin access on any id" , async () => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });
        
        const response = await request(app)
        .delete(`/client/${clients[1].id}`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("DELETE /client/:id route not allow regular user access on any id" , async () => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });
        
        const response = await request(app)
        .delete(`/client/${clients[0].id}`)
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(403);
    });

    test("PUT /client/:id route allow admin access on any id" , async () => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });
        
        const response = await request(app)
        .put(`/client/${clients[1].id}`)
        .type("form")
        .send({
            name: "random name",
            email: "45@mail.com",
            phoneNumber: "342-675-8796",
            address: "56 ur dasd"
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("PUT /client/:id allow regular user access on any id" , async () => {
        const clients = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
                {name: "jamal hersym", email: "example3@gmail.com",phoneNumber: "223-243-7686", address: "biriths columia", },
            ]
        });
        
        const response = await request(app)
        .put(`/client/${clients[0].id}`)
        .type("form")
        .send({
            name: "random name",
            email: "45@mail.com",
            phoneNumber: "342-675-8796",
            address: "56 ur dasd"
        })
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });




});


describe("access protected route /job" , () => {
    test("GET /job route allow admin access", async () => {
        const response = await request(app)
        .get("/job")
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("GET /job route allow regular user access", async () => {
        const response = await request(app)
        .get("/job")
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });

    test("GET /job/:id route allow admin access on any id", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: adminId,
                    clientId: createClient[1].id
                }
            ]
        })
        
        
        const response = await request(app)
        .get(`/job/${createJobs[1].id}`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200);
    });

    test("GET /job/:id route allow regular user access", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })
        
    
        const response = await request(app)
        .get(`/job/${createJobs[0].id}`)
        .set('Authorization', `Bearer ${authTokenUser}`)
        expect(response.status).toEqual(200);
    });

    test("POST /job route allow admin access", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
            data: [
                {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
            ]
        });
        
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });

        const employeeId = createEmployee[0].id;
        const clientId = createClient[0].id;
        const createdDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "filler description for a job that doesnt exist",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: createdDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(200);
    })

    test("POST /job route allow regular user access", async () => {
        const createEmployee = await prisma.employee.createManyAndReturn({
            data: [
                {
                    name: "James Anderson",
                    email: "james.anderson@example.com",
                    role: "USER",
                    phone: "555-0101",
                    username: "janderson",
                    hashpassword: "$2b$10$dummyHashJames001",
                },
                {
                    name: "Maria Rodriguez",
                    email: "maria.rodriguez@example.com",
                    role: "USER",
                    phone: "555-0102",
                    username: "mrodriguez",
                    hashpassword: "$2b$10$dummyHashMaria002",
                },
            ]
        });
        
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });

        const employeeId = createEmployee[0].id;
        const clientId = createClient[0].id;
        const createdDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "filler description for a job that doesnt exist",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: createdDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenUser}`)

        expect(response.status).toEqual(200);
    })

    test("DELETE /job route allow admin access", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .delete("/job")
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(200);
    })

    test("DELETE /job route not allow admin access", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .delete("/job")
        .set('Authorization', `Bearer ${authTokenUser}`)

        expect(response.status).toEqual(403);
    })

    test("DELETE /job/:id route allow admin access on any id", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .delete(`/job/${createJobs[1].id}`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(200);
    })

    test("DELETE /job/:id route allow user access on same id ", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .delete(`/job/${createJobs[1].id}`)
        .set('Authorization', `Bearer ${authTokenUser}`)

        expect(response.status).toEqual(200);
    })


    test("DELETE /job/:id route not allow user access on any id", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .delete(`/job/${createJobs[0].id}`)
        .set('Authorization', `Bearer ${authTokenUser}`)

        expect(response.status).toEqual(403);
    })

    test("PUT /job/:id route allow admin access on any id", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .put(`/job/${createJobs[1].id}`)
        .type("form")
        .send({
            desc: "updated random message one",
            costCent: 123456,
            createdAt: currDate,
            doneAt: currDate,
            progress: "PENDING",
            employeeId: adminId,
            clientId: createClient[1].id
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(200);
    })

    test("PUT /job/:id route allow user access on same id ", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .put(`/job/${createJobs[1].id}`)
        .type("form")
        .send({
            desc: "updated random message one",
            costCent: 123456,
            createdAt: currDate,
            doneAt: currDate,
            progress: "PENDING",
            employeeId: adminId,
            clientId: createClient[1].id
        })
        .set('Authorization', `Bearer ${authTokenUser}`)

        expect(response.status).toEqual(200);
    })


    test("PUT /job/:id route not allow user access on any id", async () => {
        const createClient = await prisma.client.createManyAndReturn({
            data: [
                {name: "jay brown", email: "example1@gmail.com",phoneNumber: "223-223-2222", address: "2112 N asd adas Illinois", },
                {name: "smtih rowe", email: "example2@gmail.com",phoneNumber: "253-123-2552", address: "7657 South lansingh", },
            ]
        });
        const currDate = new Date();
        
        const createJobs = await prisma.job.createManyAndReturn({
            data: [
                {
                    desc: "random message one",
                    costCent: 234123,
                    createdAt: currDate,
                    doneAt: currDate,
                    progress: "PAUSED",
                    employeeId: adminId,
                    clientId: createClient[0].id
                },
                {
                    desc: "random message two",
                    costCent: 321643,
                    doneAt: currDate,
                    createdAt: currDate,
                    progress: "COMPLETED",
                    employeeId: userId,
                    clientId: createClient[1].id
                }
            ]
        })

        const response = await request(app)
        .put(`/job/${createJobs[0].id}`)
        .type("form")
        .send({
            desc: "updated random message one",
            costCent: 123456,
            createdAt: currDate,
            doneAt: currDate,
            progress: "PENDING",
            employeeId: adminId,
            clientId: createClient[1].id
        })
        .set('Authorization', `Bearer ${authTokenUser}`)

        expect(response.status).toEqual(403);
    })




})