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

describe("/employee post endpoint for invalid user password input" ,() => {
    test("empty password user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "dasdasd",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Password is required.")
    })
    
    test("invalid length password user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "rdsadasd",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("password must contain a lowercase, uppercase, special character, number, and 8 characters long.")
    })

    test("weak password user input", async () => {
        const response = await request(app)
            .post("/employee")
            .type("form")
            .send({
                name: "gdfgdf",
                email: "random@gmail.com",
                role: "USER",
                phone: "2243872222",
                username: "yuhyuh",
                password: "1101J",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("password must contain a lowercase, uppercase, special character, number, and 8 characters long.")
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

describe("/client post endpoint for invalid user name input" ,() => {
    test("empty name user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Name is required.")
    })
    
    test("invalid length name user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "r",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be between 2 and 50 characters.")
    })

    test("invalid characters in name user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "543gdfgdfgdf",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid name.")
    })

    test("valid name user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})

describe("/client post endpoint for invalid user email input" ,() => {
    test("empty email user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Email is required.")
    })
    
    test("invalid email user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gma",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid email.")
    })

    test("valid email user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })
})

describe("/client post endpoint for invalid user phone input" ,() => {
    test("empty phone user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gmail.com",
                phoneNumber: "",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Phone number is required.")
    })
    
    test("invalid phone number user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gmail.com",
                phoneNumber: "334546wef9832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be a valid phone number.")
    })

    test("valid phone number user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})

describe("/client post endpoint for invalid user address input" ,() => {
    test("empty address user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "afasd",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("Address is required.")
    })
    
    test("invalid address user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "rdsadasd",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(400);
            expect(response.body.errorMsg).toEqual("must be between 15 and 50 characters.")
    })

    test("valid name user input", async () => {
        const response = await request(app)
            .post("/client")
            .type("form")
            .send({
                name: "jamal o'brien",
                email: "filler@gmail.com",
                phoneNumber: "3345469832",
                address: "23 S Brokhill New Jersey 34422",
            })
            .set('Authorization', `Bearer ${authTokenAdmin}`)
            expect(response.status).toEqual(200);
    })

})


describe("/job post endpoint for invalid user description input", () => {
    test("empty description user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Description is required.")
    })  

    test("invalid length description user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "3434",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be between 15 and 500 characters.")
    })

    test("valid length description user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})

describe("/job post endpoint for invalid user cost input", () => {
    test("empty cost user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: "",
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Cost is required.")
    })  

    test("invalid data type of cost user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: "r43rr",
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid number.")
    })

    test("valid length description user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})

describe("/job post endpoint for invalid user created date input", () => {
    test("empty created date user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 553453,
            createdAt: "",
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Created Date is required.")
    })  

    test("invalid data type of created date user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 54534,
            createdAt: "07-23-1889",
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid ISO 8601 date.")
    })

    test("valid length description user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})

describe("/job post endpoint for invalid user done date input", () => {
    test("empty done date user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 553453,
            createdAt: createdDate,
            doneAt: "",
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Done Date is required.")
    })  

    test("invalid data type of done date user input", async () => {
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
        const doneDate = new Date();
        
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 54534,
            createdAt: createdDate,
            doneAt: "07-19-2017",
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid ISO 8601 date.")
    })

    test("invalid date of done date user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: createdDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid date that is past created date.")
    })


    test("valid length description user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})

describe("/job post endpoint for invalid user progress input", () => {
    test("empty progress user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 553453,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Progress is required.")
    })  

    test("invalid data type of progress user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 54534,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: 321,
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must only contain letters.")
    })

    test("invalid progress name of progress user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "IDK",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid progress.")
    })


    test("valid progress user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})

describe("/job post endpoint for invalid user employee id input", () => {
    test("empty employee id user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 553453,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "INPROGRESS",
            employeeId: "",
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Employee is required.")
    })  

    test("invalid data type of employee id user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 54534,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "PAUSED",
            employeeId: "employeeId",
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid number.")
    })

    test("non exisitent employeeId user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "PAUSED",
            employeeId: 3431293213,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid employee id.")
    })


    test("valid progress user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})


describe("/job post endpoint for invalid user client id input", () => {
    test("empty client id user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 553453,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "INPROGRESS",
            employeeId: employeeId,
            clientId: "",
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("Client is required.")
    })  

    test("invalid data type of client id user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);
        
        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 54534,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "PAUSED",
            employeeId: employeeId,
            clientId: "clientId",
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)

        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid number.")
    })

    test("non exisitent client id user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "PAUSED",
            employeeId: employeeId,
            clientId: 3431293213,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(400);
        expect(response.body.errorMsg).toEqual("must be a valid client id.")
    })


    test("valid progress user input", async () => {
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
        const doneDate = new Date();
        doneDate.setFullYear(doneDate.getFullYear() + 1);

        const response = await request(app)
        .post("/job")
        .type("form")
        .send({
            desc: "this is a valid description for description",
            costCent: 564344,
            createdAt: createdDate,
            doneAt: doneDate,
            progress: "COMPLETED",
            employeeId: employeeId,
            clientId: clientId,
        })
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        expect(response.status).toEqual(200)
    })
})
