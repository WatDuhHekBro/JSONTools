# JSONTools
JSONTools is a program I made mostly for myself. It handles and analyzes JSON files in bulk.

## Features
- Batch JSON uploading and downloading
- JSON beautifier (personal use)
- JSON searching

# Specifications
- Separate each feature into its own independent script.
	- `scheduler.js` creates a class where you can dynamically schedule tasks which will be executed one by one.
	- `document.js` handles all tasks related to the document.
	- `beautify.js` provides the custom JSON stringifier.
	- `search.js` provides search tools to find a list of paths based on search conditions you provide.

# Beautifier Schematic
```
{} [] -3.25 "text" true/false null

{
	"key":
	{
		...
	},
	"key":
	[
		...
	],
	"key": {},
	"key": [],
	"key": [1,2,3,4,5],
	"key": ...,
	"key": ...,
	...
}

[
	{
		...
	},
	[
		...
	],
	{},
	[],
	[1,2,3,4,5],
	...
]
```

# Potential Features
- JSZip integration, useful for batch handling.
- Copy singular, paste singular (terminal, add entry to stack), download batch, upload batch.
- Maybe provide more options for the beautifier for the batch downloading?
- Search for keys (including regex)