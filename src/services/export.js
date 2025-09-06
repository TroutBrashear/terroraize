
export function downloadStory(fileName, storyText) {
	const blob = new Blob([storyText], { type: 'text/plain;charset=utf-8' });
	
	const link = document.createElement('a');
	
	link.href = URL.createObjectURL(blob);
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
}