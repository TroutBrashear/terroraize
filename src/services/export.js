
export function downloadStory(fileName, storyText) {
	const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
	
	const link = document.createElement('a');
	
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
}