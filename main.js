while (1) {
    document.getElementById("output").innerHTML = document.getElementById("text").value;
    yield;
}
function save() {
    var fileName = prompt("Enter a name for your document.");
    var download = document.createElement('a');
    download.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(document.getElementById("text").value.replaceAll("\n", "<br>")));
    download.setAttribute('download', fileName + ".html");

    download.style.display = 'none';
    document.body.appendChild(download);

    download.click();

    document.body.removeChild(download);
}
var isEdit = true;
function loadFile() {
let input = document.querySelector('input')
let textarea = document.querySelector('textarea')
input.addEventListener('change', () => {
    let files = input.files;
    if (files.length == 0) return;
    const file = files[0];
  
    let reader = new FileReader();
  
    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split("<br>");
        textarea.value = lines.join('\n');
  
    };
  
    reader.onerror = (e) => alert(e.target.error.name);
  
    reader.readAsText(file);
});
}
document.addEventListener("keydown", function (event) {
	if (event.ctrlKey && event.key == "e"){
	document.getElementById("text").focus();}
	if (event.ctrlKey && event.key == "y") {
		update();
	}
});
function upload() {
	var upload = document.createElement('input');
	upload.setAttribute('type', 'file');
	upload.style.display = 'none';
	document.body.appendChild(upload);
	upload.click();
	loadFile();
	document.body.removeChild(upload);
}
function shortcuts() {
	window.alert("Focus Document - Ctrl + E\nSwitch Mode - Ctrl + Y");
}
