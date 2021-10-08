describe('Make a request to API', () => {
    it('Visit API', () => {
        // Arrange - setup initial app state
        /// - visit a web page
        /// - query for an element
        // Act - take an action
        /// - interact with that element
        // Assert - make an assertion
        /// - make an asertion about page content
        cy.request("http://localhost:5000/")
        .should((response) => {
            expect(response).property('status').to.equal(200)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
            expect(response).property('body').to.not.be.empty
        })
    })
})

describe('PUT request', () => {
    it('save record in server', () => {
        cy.request({
            method: 'PUT', 
            url: "http://localhost:5000/store/john",
            body: {
                name: 'john',
                surname: 'doe',
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

describe('GET request', () => {
    it('get record from server', () => {
        cy.request("http://localhost:5000/store/john")
        .should((response) => {
            expect(response).property('status').to.equal(200)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
        })
        .then((response) => {
            expect(response.status).equal(200)  
            expect(response.body).to.not.be.empty
            expect(response.body.name).to.equal("john")
            expect(response.body.surname).to.equal("doe")
        })
    })
})

describe('DELETE request', () => {
    it('delete record in server', () => {
        cy.request('DELETE', "http://localhost:5000/store/john")
        .should((response) => {
            expect(response).property('status').to.equal(200)
            expect(response).to.have.property('headers')
            expect(response).to.have.property('duration')
            expect(response).property('body').to.not.be.empty
        })
    })
})

describe('Read a non valid key', () => {
    it('response is empty', () => {
        cy.request("http://localhost:5000/store/doe")
        .then((response) => {
            expect(response.status).equal(200)  
            expect(response.body).to.be.empty
        })
    })
})
