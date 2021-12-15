describe('Home page tests', () => {
  it('Loads the home page and snapshots', () => {
    cy.visit('/')
    cy.percySnapshot()
  })
})
