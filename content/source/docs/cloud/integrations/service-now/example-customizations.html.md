---
layout: "cloud"
page_title: "Example Customizations - ServiceNow Service Catalog Integration - Terraform Cloud and Terraform Enterprise"
description: |-
  Example customizations for the ServiceNow Service Catalog Integration.
---

# Example Customizations

## Creating a Catalog Item with Pinned Variables

This example use case creates a Terraform catalog item for resources that limits user input to certain variables.

### Create Service Catalog Item

1. Enter the ServiceNow Studio.
1. Click "Create Application File" to raise a dialog box of options.
1. In the dialog, navigate to the "Service Catalog" section, select "Catalog Item", and click the "Create" button.
1. Name the new catalog item. (The rest of this example assumes an item named `Example With Pinned Variables`.)
1. Select Catalogs: "Terraform Catalog" > Select Categories: "Terraform Resources".
1. Add any other descriptions you may want.
1. Click "Submit".

![screenshot: ServiceNow integration create catalog item](./images/service-now-create-catalog-item.png)

### Create Variable Set

1. Click "Create Application File" to raise a dialog box of options.
1. In the dialog, navigate to the "Service Catalog" section, select "Variable Set", and click the "Create" button.
1. Name your variable set. (The rest of this example assumes a set named `Example Pinned Variables`, with a default "Internal Name" of `example_pinned_variables`.)
1. Click "Submit".
1. Under the "Variables" tab click "New".
    1. Create your variable:
    1. In this example we will create a field called `tf_var_pet_name_length` that will be for a Terraform variable that determines the number of words to use for the pet server name.
        - Question: `Pet Name Length`
        - Name: `tf_var_pet_name_length`
        - `tf_var_` tells the Terraform ServiceNow SDK that this is a Terraform variable.
    1. Repeat variable creation as necessary for your use case.
    1. Click "Submit".

![screenshot: ServiceNow integration create catalog item](./images/service-now-create-var-set.png)

### Add Variable Set to Catalog Item

1. Go back to your Catalog Item.
1. Under the "Variable Sets" tab, click "New".
1. Search for and select the variable set you created (`Example Pinned Variables`).
1. Click "Submit".

### Create Flow

This example uses the "Provision Resources With Vars" flow, which is an example of flows with actions, included with the integration.

In the ServiceNow Studio:

1. Navigate to "Flow Designer" > "Flows" > "Provision Resources With Vars".
   1. This will be flow that can be used as an example.
1. Create a new flow by selecting "New" in Flow Designer
1. Name it "Example Flow" and click "submit"
1. Edit your example flow
   1. Trigger: Service Catalog
   1. 1st Action: Get Catalog Variables
      1. Drag "Requested Item Record" to "Submitted Request" field
      1. Template Catalog Item: This should be your example catalog item created above
      1. Catalog Variables: Move all of your variables to "Selected" side
      1. Select "Done" to finish this action
   1. Add another action and select the "Terraform Create Workspace with Var"
      1. Using the Flow "Provision Resources With Vars" as an example:
      1. Move the variables from the "Data" options on the right of the flow designer to match the example flow
      1. Select "Done" to save this flow
1. Click "Save" then "Activate" to enable your flow

### Set The Workflow for Catalog Item

In the ServiceNow Studio:

1. Select the "Example with Pinned Variables" catalog item. ("Service Catalog" > "Catalog Item" > "Example With Pinned Variables")
1. Select the "Process Engine" tab.
1. Set the "Flow" field by searching for the "Example Pinned Variables" flow and clicking "Update".

### Test the Catalog Item

The new item should be available in the Terraform Service Catalog. Once the new catalog item is confirmed to work, you can customize as needed.
