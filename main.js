var nt = document.getElementById("nt");
var tb = document.getElementById("tb");
var noTabs = 0;
var currentTab = 0;
var lasttab = 0
var TabContent = ["hello there"];
function changeTab(tabA) {
    var pre = document.querySelector("pre");
    textarea.value = TabContent[tabA-1];
    pre.innerText =  TabContent[tabA-1];
    document.getElementById(lasttab).setAttribute('class', 'none');  
    currentTab = tabA-1;
    console.log(currentTab);
    lasttab = currentTab;
    document.getElementById(currentTab).setAttribute('class', 'button-highlight');  
    output.srcdoc = evalate(); 
}
nt.addEventListener('click', function(){
    noTabs++;
    var button = document.createElement("button");
    var one =  noTabs+1;
    button.innerHTML = 'Tab' + one ;
    button.setAttribute('onclick', "changeTab("+one+")");
    button.setAttribute('id', noTabs);  
    TabContent.push("hello there");
    tb.appendChild(button);
});
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
function swapStyleSheet(sheet){document.getElementById('pagestyle').setAttribute('href', sheet);}
let output = document.getElementById('output');
let textarea = document.getElementById('text');
function evalate() {
    var lines = textarea.value.split("\n");
    var result = [];
    var i = 0;
    console.log(lines);
    while (i < lines.length ) {
        if (lines[i].indexOf("+") != -1 || lines[i].indexOf("-") != -1 || lines[i].indexOf("*") != -1 || lines[i].indexOf("/") != -1){
            try {result.push(eval(lines[i]));}
            catch(err) {result.push(lines[i]);}
        }
        else {result.push(lines[i]);}
        i++;
    }
    var resultS = result.toString();;
    if (resultS.indexOf("<html>") == -1 && resultS.indexOf("<style>")  == -1 && resultS.indexOf("<script>") == -1) {
        return result.join("\n").replaceAll("\n", "<br>");
    }
    else {return result.join("\n").replaceAll("\n", "");}  
}
var data = evalate();
output.srcdoc = data;
textarea.addEventListener('input', function(){
    var data = evalate();
    var pre = document.querySelector("pre");
    pre.innerHTML = textarea.value;
    Prism.highlightElement(textarea);
    console.log(currentTab);
    console.log(TabContent);
    TabContent[currentTab] = textarea.value;
    output.srcdoc = data;
});
var theme = document.getElementById("theme");
window.onload = function(){theme.selectedIndex = "3";}  
theme.addEventListener('change', function(){swapStyleSheet("https://aquacss.darth-ness.repl.co/themes/" + theme.value + ".css");});
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
