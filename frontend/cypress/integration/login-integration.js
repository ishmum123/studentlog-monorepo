import * as authList from '../data/authList.json';
const getInputByLabel = (label) => {
    return cy
        .contains('label', label)
        .invoke('attr', 'for')
        .then((id) => {
            cy.get('#' + id)
        })
}

describe('Login Integration Test', () => {
    it('Check Basic Login Feature', () => {
        cy.visit(Cypress.env("base_url"))
            .then(
                ()=>{
                    const loginCredentials = authList.users
                    for (let lc of loginCredentials){
                        cy.get('span').contains('Login').click()
                        cy.wait(1000)
                        getInputByLabel("Username or email").type(lc.username)
                        getInputByLabel("Password").type(lc.password)
                        cy.get('form').submit()
                        cy.wait(1000)
                        cy.get('.p-button-icon-only').click()
                    }

                }
            )
    })
})