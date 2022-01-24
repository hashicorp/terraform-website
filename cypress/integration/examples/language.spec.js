describe('Configuration Language page tests', () => {
  it('Loads the Configuration Language page and snapshots', () => {
    cy.visit('/language')
    cy.percySnapshot()
  })
})
