let stack = {};

function isType(value, type)
{
	if(value === undefined && type === undefined)
		return true;
	else if(value === null && type === null)
		return true;
	else
		return value !== undefined && value !== null && value.constructor === type;
}

function upload(e)
{
	e.preventDefault();
	
	for(let i = 0, list = e.dataTransfer.items, len = list.length; i < len; i++)
	{
		if(list[i].kind === 'file')
		{
			let file = list[i].getAsFile();
			let name = file.name;
			let reader = new FileReader();
			reader.readAsText(file, 'UTF-8');
			reader.onload = function() {stack[name.substring(0, name.indexOf('.json'))] = JSON.parse(this.result)};
		}
	}
}

/*
-= Search for exact matches =-
search(null)
search(5)
search("Sample Text")

-= Search using more conditions =-
search({
	"types": ["string", "number", "boolean", "null"]
})
old

search({
	type: "number",
	start: 5,
	end: 10,
	exclude_start: true,
	exclude_end: true
})
Equal to 5 < x < 10.

search({
	type: "string",
	regex: "\\d+: "
})
Searches for strings like "02: ...".

search([
	{
		type: "number"
	},
	{
		type: "string",
		regex: "\\d"
	},
	{
		equals: null
	}
])
Multiple search conditions.
*/
function search(conditions)
{
	// throw errors here with conditions
	
	let paths = {};
	
	for(let filename in stack)
		paths[filename] = searchR(stack[filename], conditions, []);
	
	return paths;
}

function searchR(data, conditions, path)
{
	let paths = [];
	
	if(isType(data, Object))
		for(let key in data)
			paths = paths.concat(searchR(data[key], conditions, path.concat(key)));
	else if(isType(data, Array))
		for(let i = 0; i < data.length; i++)
			paths = paths.concat(searchR(data[i], conditions, path.concat(i)));
	else
	{
		if(!isType(conditions, Object))
		{
			if(data === conditions)
				paths.push(path);
		}
		else
		{
			if('types' in conditions && ((conditions.types.includes('null') && data === null) || conditions.types.includes(typeof data)))
				paths.push(path);
			else if(isType(data, String) && new RegExp(conditions.regex).test(data))
				paths.push(path);
			/*else if(isType(data, Number))
			{
				let cond = true;
				let hasStart = 'start' in conditions;
				let hasEnd = 'end' in conditions;
				
				
				
				//if(hasStart && data)
			}*/
		}
	}
	
	return paths;
}

// beautify function with more options