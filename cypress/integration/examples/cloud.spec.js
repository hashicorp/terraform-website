describe('Cloud page tests', () => {
  it('Loads the Cloud page and snapshots', () => {
    cy.visit('/cloud')
    cy.percySnapshot()
  })

  it('loads the cloud/how-it-works page and snapshots', () => {
    cy.visit('/cloud/how-it-works')
    cy.percySnapshot()
  })
})
