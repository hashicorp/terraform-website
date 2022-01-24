describe('Terraform Cloud Agents page tests', () => {
  it('Loads the Terraform Cloud Agents page and snapshots', () => {
    cy.visit('/cloud-docs/agents')
    cy.percySnapshot()
  })
})
