var nt = document.getElementById("nt");
var tb = document.getElementById("tb");
var noTabs = 0;
var currentTab = 0;
var lasttab = 0
function appendTabs() {
    var i = 2;
    while (i < localStorage.getItem("noTabs")) {
        var button = document.createElement("button");
        button.innerHTML = 'Tab' + i;
        button.setAttribute('onclick', "changeTab("+i+")");
        button.setAttribute('id', lasttab+1);
        tb.appendChild(button);
        i+=1
        lasttab+=1;
    }
}
if (localStorage.getItem("tabs") != null){ 
    var TabContent = localStorage.getItem("tabs").split(",");
    appendTabs();
}
else {
    var TabContent = ["hello there"]
}
function changeTab(tabA) {
    var code = document.querySelector("code");
    code.textContent =  TabContent[tabA-1];
    textarea.value = TabContent[tabA-1];
    document.getElementById(lasttab).setAttribute('class', 'none');  
    currentTab = tabA-1;
    lasttab = currentTab;
    document.getElementById(currentTab).setAttribute('class', 'button-highlight');  
    output.srcdoc = evalate(); 
    localStorage.setItem('tabs', TabContent);
    localStorage.setItem('noTabs', TabContent.length);
}
nt.addEventListener('click', function(){
    noTabs++;
    var button = document.createElement("button");
    var one =  noTabs+1;
    button.innerHTML = 'Tab' + one ;
    button.setAttribute('onclick', "changeTab("+one+")");
    button.setAttribute('id', noTabs);  
    console.log(TabContent);
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
var ISVars = [];
function handleInkScript(code, result) {
    parsedCode = code.split(" ");
    console.log(parsedCode);
    if (parsedCode[0] == "%var") {
        ISVars.push("%" + parsedCode[1]);        
        var i= 3;
        while (i < parsedCode.length) {
            ISVars.push(parsedCode[i]);
            console.log(parsedCode[i])
            i++;
        }
    }
        else {
            console.log(ISVars)
            if (ISVars.includes(parsedCode[0])) {
                result.push(ISVars[ISVars.indexOf(parsedCode[0])+1]);
                console.log(result)
            }
        }
    
}
function evalate() {
    var lines = textarea.value.split("\n");
    ISVars.length = 0;
    var result = [];
    var i = 0;
    while (i < lines.length ) {
        if (lines[i][0] != '%') {
            if (lines[i].indexOf("+") != -1 || lines[i].indexOf("-") != -1 || lines[i].indexOf("*") != -1 || lines[i].indexOf("/") != -1){
                try {result.push(eval(lines[i]));}
                catch(err) {result.push(lines[i]);}
            }
            else {result.push(lines[i]);}
            
        }
        else {
            handleInkScript(lines[i], result);
        }
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
