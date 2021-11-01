---
layout: "cloud"
page_title: "Variable Sets - API Docs - Terraform Cloud and Terraform Enterprise"
---

# Variable Sets API

This set of APIs covers create, update, list, delete, and some specialized operations.

Viewing Variable Sets requires access to the owning organization. Destructive actions require organization admin status or workspace management permissions.


## Create a Variable Set
`POST organizations/:organization_name/varsets`

Example Payload:
```json
{:data=>
  {
    :type=>"varsets",
    :attributes=>{
      :name=>"varset-7f7b6783",
      :description=>"Full of vars and such for mass reuse",
      :is_global=>false
    },
    :relationships=>{
      :workspaces=>{
        !! Sending an empty workspaces list is an explicit declaration to unassign from all workspaces
        :data=>[
          {
            :id=>"ws-z6YvbWEYoE168kpq",
            :type=>"workspaces"
          },
          ...
        ]
      },
      :vars=>{
        :data=>[
          {
            :type=>"vars",
            :attributes=>{
              :key=>"c2e4612d993c18e42ef30405ea7d0e9ae",
              :value=>"8676328808c5bf56ac5c8c0def3b7071",
              :category=>"terraform"
            }
          },
          ...
        ]
      }
    }
  }
}
```

responds with JSON representation of the save Variable Set (see list Variable Set section for example)

## Update a Variable Set
`PATCH varsets/:external_id`

rsponds with JSON representation of the save Variable Set (see list Variable Set section for example)

## Delete a Variable Set
`PUT/PATCH varsets/:external_id`

on success, responds with no content

## List Variable Set
`GET organizations/:organization_name/varsets`

or

`GET workspaces/:workspace_external_id/varsets`

or

`GET varsets/:external_id` #same response sans pagination and listing

example payload
```json
{:data=>
  [
    {:id=>"varset-mio9UUFyFMjU33S4",
      :type=>"varsets",
      :attributes=> {
         :name=>"varset-b7af6a77",
         :description=>"Full of vars and such for mass reuse",
         :"is-global"=>false,
         :"updated-at"=>"2021-10-29T17:15:56.722Z",
         :"var-count"=> 5,
         :"workspace-count"=>2
      },
      :relationships=>{
        :organization=>{
         :data=>{:id=>"organization_1", :type=>"organizations"}
        },
        :vars=>{
          :data=>[
           {:id=>"var-abcd12345", :type=>"vars"},
           {:id=>"var-abcd12346", :type=>"vars"},
           {:id=>"var-abcd12347", :type=>"vars"},
           {:id=>"var-abcd12348", :type=>"vars"},
           {:id=>"var-abcd12349", :type=>"vars"}
          ]
        },
        :workspaces=>{
          :data=>[
           {:id=>"ws-abcd12345", :type=>"workspaces"},
           {:id=>"ws-abcd12346", :type=>"workspaces"}
          ]
        }
      }
    },
    {:id=>"varset-l1k3j41nf24jas",
      ... 
    },
    ...
  ],
  :links=>{
    :self=>"<page URL>",
    :first=>"<page URL>",
    :prev=>nil,
    :next=>nil,
    :last=>"<page URL>"}
```

## Relationships

### Variables

## Add Variable
`POST varsets/:varset_external_id/relationships/vars`


## Update a Variable in a Variable Set
`PATCH varsets/:varset_external_id/relationships/vars/:external_id`

```json
{:data=>{
  :type=>"vars",
  :attributes=>{
    :key=>"g6e45ae7564a17e81ef62fd1c7fa86138",
    :value=>"61e400d5ccffb3782f215344481e6c82",
    :description=>"cheeeese",
    :sensitive=>false,
    :category=>"terraform",
    :hcl=>false
  }
}
```

On success responds with data for saved variable

## Delete a Variable in a Variable Set
`DELETEvarsets/:varset_external_id/relationships/vars/:external_id`

on success, responds with deleted variable content

# List Variables
`GET varsets/:varset_external_id/relationships/vars`

example response
```json
{:data=>[
    {
      :id=>"var-134r1k34nj5kjn",
      :type=>"vars",
      :attributes=>{
        :key=>"F115037558b045dd82da40b089e5db745",
        :value=>"1754288480dfd3060e2c37890422905f",
        :sensitive=>false,
        :category=>"terraform",
        :hcl=>false,
        :"created-at"=>"2021-10-29T18:54:29.379Z",
        :description=>nil
      },
      :relationships=>{
        :varset=>{
          :data=>{
            :id=>"varset-992UMULdeDuebi1x",
            :type=>"varsets"},
          :links=>{:related=>"/api/v2/varsets/1"}
        }
      },
      :links=>{:self=>"/api/v2/vars/var-BEPU9NjPVCiCfrXj"}
    }
  }],
  :links=>{
    :self=>"<page URL>",
    :first=>"<page URL>",
    :prev=>nil,
    :next=>nil,
    :last=>"<page URL>"}
}
```

### Workspaces

## Assign Variable Set to Workspaces
`POST varsets/:varset_external_id/relationships/workspaces`

payload
```json
{:data=>[
    {
      :type=>"workspaces",
      :id=>"ws-YwfuBJZkdai4xj9w"
    },
    ...
  ]
}
```

on success, responds with no content

## Unassign Variable Set from Workspaces
`DELETE varsets/:varset_external_id/relationships/workspaces`

payload
```json
{:data=>[
    {
      :type=>"workspaces",
      :id=>"ws-YwfuBJZkdai4xj9w"
    },
    ...
  ]
}
```

on success, responds with no content
