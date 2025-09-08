

export function textColor(provColor) {
	let r = parseInt(provColor.slice(1,3), 16);
	let g = parseInt(provColor.slice(3,5), 16);
	let b = parseInt(provColor.slice(5,7), 16);
	
	let lumin = 0.299 * r + 0.587 * g + 0.114 * b;
	
	if(lumin > 128)
	{
		return '#000000';
	}
	
	return '#ffffff';
}