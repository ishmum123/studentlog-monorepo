import axios from "axios";

describe('API Integration Test', () => {
    it('Check Basic API Authorization Feature', () => {
        const LOGIN_URL = "http://localhost:8080/keycloak"
        const ATTENDANCE_URL = "http://localhost:8080/attendance"
        const username = "teacher"
        const password = "teacher"

        async function login(username, password) {
            let promise = axios.post(LOGIN_URL, null, { params: {
                    username,
                    password
                }})
            return promise.then((response) => response.data.access_token)
        }

        login(username, password)
            .then(access_token => {
                const options = {
                    url: ATTENDANCE_URL,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '
                    },
                    failOnStatusCode: false
                }

                cy.request(options).as('failedResponse')
                cy.get('@failedResponse').should(res =>{
                    cy.expect(res.status.toString()).to.eql("401")
                })

                const optionsSuccess = {
                    url: ATTENDANCE_URL,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + access_token
                    },
                    failOnStatusCode: false
                }

                cy.request(optionsSuccess).as('apiResponse')
                cy.get('@apiResponse').should(res =>{
                    cy.expect(res.status.toString()).to.eql("200")
                })

            })
    })

})