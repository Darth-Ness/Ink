//Vars
var closedTab = false;
var nt = document.getElementById("nt");
var noTabs = 0;
var currentTab = 0;
let outputEditor = document.getElementById('output');
let textarea = document.getElementById('text');
var data = evalate()
//Tabs

function appendTabs() {
    var i = 0;
    currentTab = localStorage.getItem("currenttab")
    while (i < localStorage.getItem("noTabs")) {
        var button = document.createElement("button");
        var one = i + 1;
        button.innerHTML = 'Tab ' + one;
        button.setAttribute('onclick', "changeTab(" + one + ")");
        button.setAttribute('class', "bgRed");
        document.getElementById("tb").appendChild(button);
        document.getElementById('tb').append(document.createElement("br"), document.createElement("br"));
        i += 1
    }
    noTabs = localStorage.getItem("noTabs");
}
if (localStorage.getItem("tabs") != null) {
    var TabContent = localStorage.getItem("tabs").replaceAll("%commma%", ",").split("%end%");
    appendTabs();
} else { var TabContent = [] }

function changeTab(tabA) {
    var code = document.querySelector("code");
    code.innerHTML = TabContent[tabA - 1];
    textarea.value = TabContent[tabA - 1];
    currentTab = tabA - 1;
    outputEditor.srcdoc = evalate();
}
nt.addEventListener('click', function() {
    noTabs++;
    var button = document.createElement("button");
    button.innerHTML = 'Tab ' + noTabs;
    button.setAttribute('onclick', "changeTab(" + noTabs + ")");
    button.setAttribute('id', noTabs-1);
    button.setAttribute('class', 'bgRed')
    document.getElementById("tb").appendChild(button);
    document.getElementById('tb').append(document.createElement("br"), document.createElement("br"));
});
document.getElementById("closeTab").addEventListener('click', function() { 
    if (noTabs < 1) { return; }
    document.getElementById(currentTab).remove(); 
    closedTab = true;
})

//Results


function evalate() {
    console.log(noTabs)
    console.log(currentTab)
    var lines = textarea.value.split("\n");
    var result = [];
    var i = 0;
    while (i < lines.length) {
        if (lines[i].indexOf("+") != -1 || lines[i].indexOf("-") != -1 || lines[i].indexOf("*") != -1 || lines[i].indexOf("/") != -1) {
            try { result.push(eval(lines[i])); } catch (err) { result.push(lines[i]); }
        } else { result.push(lines[i]); }
        i++;
    }
    var resultS = result.toString();
    if (resultS.indexOf("<html>") == -1 && resultS.indexOf("<style>") == -1 && resultS.indexOf("<script>") == -1) {
        return result.join("\n").replaceAll("\n", "<br>");
    } else { return result.join("\n").replaceAll("\n", ""); }
}
outputEditor.srcdoc = data;
textarea.addEventListener('input', function() {
    data = evalate();
    var spaceCounter = data.split(' ').length;
    document.getElementById('wordCounter').innerHTML = spaceCounter;
    TabContent[currentTab] = textarea.value;
    outputEditor.srcdoc = data;
});
var checkbox = document.getElementById("checkbox");
checkbox.addEventListener('click', function() {
    if (checkbox.checked == true) {
        outputEditor.style = "position: absolute;left:80;height:94%;width:93%;background:#fff !important;border:none;display: default";
        textarea.style = "display: none";
        var code = document.querySelector("code");
        code.style = "display: none";
    }    
    if (checkbox.checked == false) {
        outputEditor.style = "display: none";
        textarea.style = "display: default;caret-color: rgb(248, 248, 242); font: inherit; font-synthesis: inherit; font-palette: inherit; tab-size: inherit; padding-left: 53.2px;";
        var code = document.querySelector("code");
        code.style = "display: default";
    }
})
// if user agent contains electron, set use_electron to true
var use_electron = navigator.userAgent.indexOf('Electron') > -1;
console.log(use_electron);

//File Management
// The difference between the save function and the saveProject function is
// The save function saves the project to your computer, while the saveProject saves it to local storage
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

function loadFile() {
let input = document.getElementById('upload');
input.addEventListener('change', () => {
    let files = input.files;
    if (files.length == 0) return;
    const file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split("<br>");
        textarea.value = lines.join('\n');
        var code = document.querySelector("code");
        code.innerHTML = lines.join('\n')
        outputEditor.srcdoc = lines.join('\n')
    };

    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
});
}
function upload() {
	var upload = document.createElement('input');
	upload.setAttribute('type', 'file');
	upload.style.display = 'none';
    upload.id = "upload";
	document.body.appendChild(upload);
	upload.click();
	loadFile();
	document.body.removeChild(upload);
}
function saveProject() {
    replaceCommas();
    localStorage.setItem('tabs', TabContent);
    localStorage.setItem('noTabs', TabContent.length);
    localStorage.setItem('currenttab', currentTab);

}
//Fixes bug where everytime you insert a comma inside your project it splits it into mutiple tabs.
function replaceCommas() {
    var i = 0;
    while (i < TabContent.length-1 || i == TabContent.length-1) { 
        TabContent[i].replaceAll(",", "%comma%"); 
        if (TabContent[i].indexOf("%end%") != -1) {
            TabContent[i] += "%end%";
        }
        i++; 
    }
}
window.addEventListener("blur", () => {
    saveProject();
});
