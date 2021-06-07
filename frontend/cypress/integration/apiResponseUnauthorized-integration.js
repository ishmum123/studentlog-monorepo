import * as authList from '../data/authList.json';
import * as apiList from '../data/apiList.json';

describe('API Integration Test', () => {
    it('Check Basic API Authorization Feature', () => {
        const apis = apiList.apis
        const users = authList.users
        const LOGIN_URL = "http://localhost:8080/keycloak"
        apis.forEach(item=>{
            const unAuthenticatedUsers = users.filter(userList=> !item.roles.includes(userList.role))
            unAuthenticatedUsers.forEach(unAuthenticatedUser => {
                const loginOptions = {
                    url: LOGIN_URL,
                    method: "POST",
                    qs: {
                        "username": unAuthenticatedUser.username,
                        "password": unAuthenticatedUser.password
                    },
                    failOnStatusCode:false
                }
                cy.request(loginOptions).then(res => {
                    const options = item.options
                    options.headers.Authorization = 'Bearer ' + res.body.access_token
                    cy.log('Testing for API ' + options.url + ' user: ' + unAuthenticatedUser.username)
                    cy.request(options).as('apiResponse')
                    cy.get('@apiResponse').then(res =>{
                        cy.expect(res.status.toString()).to.eql("401")
                    })
                })
            })
        })
    })
})