var nt = document.getElementById("nt");
var tb = document.getElementById("tb");
var noTabs = 2;
var currentTab = 1;
var TabContent = [""];
nt.addEventListener('click', function(){
    var button = document.createElement("button");
    button.innerHTML = 'Tab' + noTabs;
    button.setAttribute('onclick', 'changeTab(noTabs - 1)');
    noTabs++;
    TabContent.push("");
    tb.appendChild(button);
});
function changeTab(tabA) {
    textarea.value =  TabContent[tabA-1];
    currentTab = tabA-1;
    output.srcdoc = TabContent[tabA-1];
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
function swapStyleSheet(sheet){
	document.getElementById('pagestyle').setAttribute('href', sheet);
}
let output = document.getElementById('output');
let textarea = document.querySelector('textarea');
function evalate() {
    var lines = textarea.value.split("\n");
    var result = [];
    var i = 0;
    while (i < lines.length ) {
        if (lines[i].indexOf("+") != -1 || lines[i].indexOf("-") != -1 || lines[i].indexOf("*") != -1 || lines[i].indexOf("/") != -1 && lines[lines[i].indexOf("/")-1] == "<") {
            result.push(eval(lines[i]));
        }
        else {result.push(lines[i]);}
        i++;
    }
    var resultS = result.toString();;
    if (resultS.indexOf("<html>") == -1 && resultS.indexOf("<style>")  == -1 && resultS.indexOf("<script>") == -1) {
        return result.join("\n").replaceAll("\n", "<br>");
    }
    else {
        return result.join("\n").replaceAll("\n", "");
    }  
}
var data = evalate();
output.innerHTML = data;
textarea.addEventListener('input', function(){
    var data = evalate();
    console.log(data);
    TabContent[currentTab] = data;
    output.srcdoc = data;
});
var theme = document.getElementById("theme");
window.onload = function(){  
theme.selectedIndex = "3";  
}  
theme.addEventListener('change', function(){
    swapStyleSheet("https://aquacss.darth-ness.repl.co/themes/" + theme.value + ".css");
});
function loadFile() {
let input = document.querySelector('input');
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
function upload() {
	var upload = document.createElement('input');
	upload.setAttribute('type', 'file');
	upload.style.display = 'none';
	document.body.appendChild(upload);
	upload.click();
	loadFile();
	document.body.removeChild(upload);
}
