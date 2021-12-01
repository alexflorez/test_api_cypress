describe('1: PUT request', () => {
    it('save record in server', () => {
        cy.request({
            method: 'PUT', 
            url: "http://localhost:3000/store/john",
            body: {
                name: 'John',
                surname: 'Doe',
            }
        })
        .should((response) => {
            expect(response).property('status').to.equal(201)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
            expect(response.body).to.not.be.null
            expect(response.body).to.not.be.empty
        })       
    })
})

describe('2: GET request', () => {
    it('get record from server', () => {
        cy.request("http://localhost:3000/store/john")
        .should((response) => {
            expect(response).property('status').to.equal(200)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
        })
        .then((response) => {
            expect(response.body).to.not.be.empty
            expect(response.body.name).to.equal("Jane")
            expect(response.body.surname).to.equal("Doe")
        })
    })
})

describe('3: DELETE request', () => {
    it('delete record in server', () => {
        cy.request('DELETE', "http://localhost:3000/store/john")
        .should((response) => {
            expect(response).property('status').to.equal(200)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
            expect(response).property('body').to.not.be.empty
        })
    })
})

describe('4: Read a non valid key', () => {
    it('response is empty', () => {
        cy.request("http://localhost:3000/store/doe")
        .then((response) => {
            expect(response.status).equal(200)  
            expect(response.body).to.be.not.empty
        })
    })
})

describe('5: Create record in public page', () => {
    it('enter and create data', () => {
        cy.visit("http://localhost:3000/test.html")
        cy.get("input[type=text]").eq(0).clear().type("john{enter}")
        cy.get("input[type=text]").eq(1).type("secret{enter}")
        cy.get("input[type=text]").eq(2).type("john@doe.com{enter}")
        cy.get("input[type=text]").eq(3).type("Av. Adventure{enter}")
        cy.get('input[value="Create"]').click()
    })
})

describe('6: Recover record in public page', () => {
    it('recover data from store', () => {
        cy.visit("http://localhost:3000/test.html")
        cy.get("input[type=text]").eq(0).clear().type("john")
        cy.get('input[value="Read"]').click()
        cy.get("input[type=text]").eq(1).should("have.value", "secret")
        cy.get("input[type=text]").eq(2).should("have.value", "john@doe.com")
        cy.get("input[type=text]").eq(3).should("have.value", "Av. Adventure")
    })
})

describe('7: Delete record in public page', () => {
    it('delete data from store', () => {
        cy.visit("http://localhost:3000/test.html")
        cy.get("input[type=text]").eq(0).clear().type("john")
        cy.get('input[value="Delete"]').click()
        cy.get("input[type=text]").eq(0).should("have.value", "")
        cy.get("input[type=text]").eq(1).should("have.value", "")
        cy.get("input[type=text]").eq(2).should("have.value", "")
        cy.get("input[type=text]").eq(3).should("have.value", "")
    })
})

describe('8: Recover non existing record in public page', () => {
    it('not show any data', () => {
        cy.visit("http://localhost:3000/test.html")
        cy.get("input[type=text]").eq(0).clear().type("john")
        cy.get('input[value="Read"]').click()
        cy.get("input[type=text]").eq(0).should("have.value", "")
        cy.get("input[type=text]").eq(1).should("have.value", "")
        cy.get("input[type=text]").eq(2).should("have.value", "")
        cy.get("input[type=text]").eq(3).should("have.value", "")
    })
})
