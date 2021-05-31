import * as authList from '../data/authList.json';
import * as menuList from '../data/menuList.json';

const getInputByLabel = (label) => {
    return cy
        .contains('label', label)
        .invoke('attr', 'for')
        .then((id) => {
            cy.get('#' + id)
        })
}
describe('Authentication Integration Test', () => {
    it('Check Basic Authentication Feature', () => {
        cy.visit(Cypress.env("base_url"))
            .then(
                ()=>{
                    const users = authList.users
                    const urls = menuList.urls

                    users.forEach(item => {
                        cy.get('span').contains('Login').click()
                        cy.wait(1000)
                        getInputByLabel("Username or email").type(item.username)
                        getInputByLabel("Password").type(item.password)
                        cy.get('form').submit()
                        cy.wait(1000)
                        const restrictedURLs = urls.filter(url =>  !url.roles.includes(item.role))
                        restrictedURLs.forEach(restrictedURL => {
                            cy.visit(Cypress.env("base_url") + restrictedURL.url)
                            cy.wait(1000)
                            cy.location('pathname').should('eq', '/')
                        })
                        cy.get('.p-button-icon-only').click()
                    })
                }
            )
    })
})