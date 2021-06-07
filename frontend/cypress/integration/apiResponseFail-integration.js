import * as apiList from '../data/apiList.json';

describe('API Integration Fail Test', () => {
    it('Check Basic API Authorization Feature', () => {
        const apis = apiList.apis
        apis.forEach(item=>{
            const options = item.options
            cy.log('Testing for API ' + options.url)
            cy.request(options).as('failedResponse')
            cy.get('@failedResponse').then(res =>{
                cy.expect(res.status.toString()).to.eql("401")
            })
        })
    })
})