describe('Make a request to API', () => {
    it('Visit API', () => {
        // Arrange - setup initial app state
        /// - visit a web page
        /// - query for an element
        // Act - take an action
        /// - interact with that element
        // Assert - make an assertion
        /// - make an asertion about page content
        // cy.visit("http://localhost:5000/")
        cy.request("http://localhost:5000/")
    })
})

describe('PUT request', () => {
    it('save record in server', () => {
        cy.request('PUT', "http://localhost:5000/store/john")
        .then((response) => {
            let body = JSON.parse(response.body);
            expect(response.status).to.eq(201)
        })       
    })
})

describe('GET request', () => {
    it('get record from server', () => {
        cy.request("http://localhost:5000/store/john")
    })
})

describe('DELETE request', () => {
    it('delete record in server', () => {
        cy.request('DELETE', "http://localhost:5000/store/john")
    })
})

describe('Read a non valid key', () => {
    it('response is empty', () => {
        cy.request("http://localhost:5000/store/doe")
    })
})
