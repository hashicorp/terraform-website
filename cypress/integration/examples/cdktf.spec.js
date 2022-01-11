describe('CDKTF page tests', () => {
  it('Loads the CDKTF page and snapshots', () => {
    cy.visit('/cdktf')
    cy.percySnapshot()
  })
})
