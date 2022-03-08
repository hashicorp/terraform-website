describe('Terraform Integration Program page tests', () => {
  it('Loads the Terraform Integration Program page and snapshots', () => {
    cy.visit('/docs/partnerships')
    cy.percySnapshot()
  })
})
