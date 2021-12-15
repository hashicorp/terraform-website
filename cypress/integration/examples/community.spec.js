describe('Community page tests', () => {
  it('Loads the community page and snapshots', () => {
    cy.visit('/community')
    cy.percySnapshot()
  })
})
