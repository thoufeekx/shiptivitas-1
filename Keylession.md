# On your notepad or document:
## Create a Component Map:
1. List all imports in App.js
2. Draw arrows to show parent → child relationships
3. Note what props are passed between components

## Ask Key Questions:
Where is the state managed?
How does data flow?
What triggers component updates?

## Use Visual Markers:
App (state: selectedTab)
├── Navigation (props: onClick, selectedTab)
└── Content
    ├── HomeTab (no props)
    └── Board (manages client data)
        └── Swimlane (props: clients)
            └── Card (props: id, name, status)

## Follow Data Flow:
State Changes → Parent Component → Child Props → Re-render

explain again from user approach like what happens when user click the shipping request button in navigation explain with parent to child tranfer and child to parent transfer