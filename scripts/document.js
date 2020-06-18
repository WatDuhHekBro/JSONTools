"use strict";

const stack = {};
const scheduler = new Scheduler();

const table = {
	node: document.getElementById("files").children[0], // tbody element
	// name: "database.json"
	addRow(name, index)
	{
		let length = this.node.children.length;
		
		if(index < 0 || index > length)
			throw `Index out of bounds! Index ${index} was called, but it must be in the range of 0 to the length of the table (${length}).`;
		
		this.node.insertRow(index);
		
		if(index === undefined)
			index = this.node.children.length-1;
		
		let e = this.node.children[index];
		let file = document.createElement("td");
		let remove = document.createElement("td");
		
		file.innerText = name;
		remove.innerText = '❌';
		remove.width = "5%";
		remove.classList.add("remove");
		remove.onclick = function() {
			let row = this.parentElement;
			delete stack[row.children[0].innerText];
			table.removeRow(row.rowIndex);
		};
		
		e.appendChild(file);
		e.appendChild(remove);
	},
	removeRow(index)
	{
		let length = this.node.children.length;
		
		if(length === 0)
			throw "Redundant call? Function removeRow was called even though the table is empty.";
		
		if(index < 0 || index >= length)
			throw `Index out of bounds! Index ${index} was called, but the length of the table is ${length}.`;
		
		if(index === undefined)
			index = this.node.children.length-1;
		
		this.node.children[index].remove();
	}
};

function upload(e)
{
	e.preventDefault();
	
	for(let i = 0, list = e.dataTransfer.items, len = list.length; i < len; i++)
	{
		if(list[i].kind === "file")
		{
			let file = list[i].getAsFile();
			
			if(file.name.includes(".json"))
			{
				let index = table.node.children.length;
				let tag = file.name.substring(0, file.name.indexOf(".json"));
				table.addRow(tag);
				
				let reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = function() {
					try
					{
						stack[tag] = JSON.parse(this.result);
						table.node.children[index].classList.add("success");
					}
					catch(error)
					{
						table.node.children[index].classList.add("error");
						console.error(error);
					}
				};
			}
		}
	}
}

function download(contents, filename = '')
{
	scheduler.add(() => {
		const dlink = document.createElement("a");
		dlink.download = filename;
		dlink.href = window.URL.createObjectURL(new Blob([contents]));
		dlink.click();
		dlink.remove();
	}, 3000);
}