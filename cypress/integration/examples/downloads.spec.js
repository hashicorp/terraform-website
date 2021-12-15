describe('Download page tests', () => {
  it('Loads the downloads page and snapshots', () => {
    cy.visit('/downloads')
    cy.percySnapshot()
  })
})
