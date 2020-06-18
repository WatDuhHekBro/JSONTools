"use strict";

/// Disclaimer: Beauty standards are highly subjective, especially in programming. This is not meant to serve as or replace legal or medical advice. If you think you need such help, contact a lawyer or doctor respectively.
const beautifier = {
	settings:
	{
		compress: false,
		ascii: false,
		debug: true
	},
	// Call this function
	stringify(data)
	{
		let text = this.settings.compress ? JSON.stringify(data) : this.beautify(data);
		
		if(this.settings.debug)
		{
			try
			{
				JSON.parse(text);
			}
			catch(error)
			{
				console.error(error);
				throw "There was an error with the beautifier.";
			}
		}
		
		if(this.settings.ascii)
			text = text.replace(/[\u007F-\uFFFF]/g, c => {return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).substr(-4)});
		
		return text;
	},
	/**
	 * @arguments: JSON, Tabs, Indent
	 * @return: String
	 */
	// Internal recursive function
	beautify(data, height = 0, fromObject = false)
	{
		let output = '';
		
		if(data !== null && data.constructor === Object)
		{
			if(Object.keys(data).length === 0)
				output += JSON.stringify(data);
			else
			{
				let indent = fromObject ? '\n' + this.tabs(height) : '';
				output += indent + '{\n';
				let index = 1;
				
				for(let key in data)
				{
					let comma = (index++ === Object.keys(data).length) ? '' : ',';
					output += this.tabs(height+1) + this.beautify(key) + (!this.isExpansive(data[key]) ? ': ' : ':') + this.beautify(data[key], height+1, true) + comma + '\n';
				}
				
				output += this.tabs(height) + '}';
			}
		}
		else if(data !== null && data.constructor === Array)
		{
			if(data.length === 0 || this.isSimpleArray(data))
				output += JSON.stringify(data);
			else
			{
				let indent = fromObject ? '\n' + this.tabs(height) : '';
				output += indent + '[\n';
				
				for(let i = 0; i < data.length; i++)
				{
					let comma = (i === data.length-1) ? '' : ',';
					output += this.tabs(height+1) + this.beautify(data[i], height+1) + comma + '\n';
				}
				
				output += this.tabs(height) + ']';
			}
		}
		else
			output += JSON.stringify(data);
		
		return output;
	},
	// [1,2,3,4,5], not ["a",{},"c",4]. ["one","two","three"] is a simple array but is not included within this scope.
	isSimpleArray(array)
	{
		for(const value of array)
			if(value && value.constructor !== Number)
				return false;
		return true;
	},
	// Does the object/array have anything inside it?
	isExpansive(data)
	{
		if(data !== null && data.constructor === Object)
			return Object.keys(data).length !== 0;
		else if(data !== null && data.constructor === Array)
			return data.length !== 0 && !this.isSimpleArray(data);
		else
			return false;
	},
	tabs(amount = 0)
	{
		let output = '';
		
		while(amount-- > 0)
			output += '\t';
		
		return output;
	}
};