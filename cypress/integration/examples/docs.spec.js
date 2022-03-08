describe('Docs page tests', () => {
  it('Loads the docs page and snapshots', () => {
    cy.visit('/docs')
    cy.percySnapshot()
  })
})
