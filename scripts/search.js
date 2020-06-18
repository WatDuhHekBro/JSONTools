"use strict";

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
const analyzer = {
	search(conditions)
	{
		// throw errors here with conditions
		
		let paths = {};
		
		for(let filename in stack)
			paths[filename] = this.searchR(stack[filename], conditions, []);
		
		return paths;
	},
	searchR(data, conditions, path)
	{
		let paths = [];
		
		if(this.isType(data, Object))
			for(let key in data)
				paths = paths.concat(this.searchR(data[key], conditions, path.concat(key)));
		else if(this.isType(data, Array))
			for(let i = 0; i < data.length; i++)
				paths = paths.concat(this.searchR(data[i], conditions, path.concat(i)));
		else
		{
			if(!this.isType(conditions, Object))
			{
				if(data === conditions)
					paths.push(path);
			}
			else
			{
				if('types' in conditions && ((conditions.types.includes('null') && data === null) || conditions.types.includes(typeof data)))
					paths.push(path);
				else if(this.isType(data, String) && new RegExp(conditions.regex).test(data))
					paths.push(path);
				/*else if(this.isType(data, Number))
				{
					let cond = true;
					let hasStart = 'start' in conditions;
					let hasEnd = 'end' in conditions;
					
					
					
					//if(hasStart && data)
				}*/
			}
		}
		
		return paths;
	},
	isType(value, type)
	{
		if(value === undefined && type === undefined)
			return true;
		else if(value === null && type === null)
			return true;
		else
			return value !== undefined && value !== null && value.constructor === type;
	}
};