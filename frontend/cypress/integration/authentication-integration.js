import * as data from '../data/auth.json';

const getInputByLabel = (label) => {
    return cy
        .contains('label', label)
        .invoke('attr', 'for')
        .then((id) => {
            cy.get('#' + id)
        })
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function symmetricDifference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem)
        } else {
            _difference.add(elem)
        }
    }
    return _difference
}

function reverseAuthListGeneration({auth, allMenu}){
    let revAuthMap = new Map()
    let specificUserMenuSet = new Set()
    let allMenuSet = new Set()

    for (let elem of allMenu){
        allMenuSet.add(elem)
    }
    for (let listOfAuthentications of auth){
        console.log(listOfAuthentications)
        for (let elem of listOfAuthentications.authList){
            specificUserMenuSet.add(elem)
        }
        let finalSet = symmetricDifference(allMenuSet , intersection(specificUserMenuSet,allMenuSet))
        revAuthMap.set({username: listOfAuthentications.username, password: listOfAuthentications.password}, Array.from(finalSet))
    }
    return revAuthMap;
}

describe('Authentication Integration Test', () => {
    it('Check Basic Authentication Feature', () => {
        cy.visit(Cypress.env("base_url"))
            .then(
                ()=>{
                    const reverseAuth = reverseAuthListGeneration(data)
                    for (let [key, value] of reverseAuth) {
                        cy.get('span').contains('Login').click()
                        cy.wait(1000)
                        getInputByLabel("Username or email").type(key.username)
                        getInputByLabel("Password").type(key.password)

                        cy.get('form').submit()
                        cy.wait(1000)
                        for (let restrictUrl of value) {
                            cy.visit(Cypress.env("base_url") + restrictUrl)
                            cy.wait(1000)
                            cy.location('pathname').should('eq', '/')
                        }
                        cy.get('.p-button-icon-only').click()
                    }
                }
            )
    })
})