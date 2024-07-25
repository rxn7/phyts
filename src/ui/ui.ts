const settingsButton: HTMLImageElement = document.getElementById('settings-button') as HTMLImageElement
settingsButton.addEventListener('click', openSettings)

function openSettings() {
	settingsButton.style.display = 'none';
	alert('ayo')
}
