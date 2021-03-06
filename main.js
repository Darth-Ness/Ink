//Vars
var closedTab = false;
var nt = document.getElementById("nt");
var noTabs = 0;
var currentTab = 0;
var lasttab = 0;
let output = document.getElementById('output');
let textarea = document.getElementById('text');
var ISVars = [];
var data = evalate()
var tokens = ["%var"]
    //Tabs

function appendTabs() {
    var i = 1;
    while (i < localStorage.getItem("noTabs")) {
        var button = document.createElement("button");
        var one = i + 1;
        button.innerHTML = 'Tab ' + one;
        button.setAttribute('onclick', "changeTab(" + one + ")");
        button.setAttribute('id', lasttab + 1);
        document.getElementById("tb").appendChild(button);
        i += 1
        lasttab += 1;
    }
    noTabs = localStorage.getItem("noTabs") - 1;
}
if (localStorage.getItem("tabs") != null) {
    var TabContent = localStorage.getItem("tabs").split(",");
    appendTabs();
} else { var TabContent = [] }

function changeTab(tabA) {
    var code = document.querySelector("code");
    code.innerHTML = TabContent[tabA - 1];
    textarea.value = TabContent[tabA - 1];
    if (closedTab == false) {document.getElementById(lasttab).setAttribute('class', 'none');}
    currentTab = tabA - 1;
    lasttab = currentTab;
    document.getElementById(currentTab).setAttribute('class', 'bgRed');
    output.srcdoc = evalate();
    localStorage.setItem('tabs', TabContent);
    localStorage.setItem('noTabs', TabContent.length);
    localStorage.setItem('currenttab', currentTab);
}
nt.addEventListener('click', function() {
    noTabs++;
    var button = document.createElement("button");
    var one = noTabs + 2;
    button.innerHTML = 'Tab ' + one;
    button.setAttribute('onclick', "changeTab(" + one + ")");
    button.setAttribute('id', noTabs);
    button.setAttribute('style', 'margin-right: 0')
    document.getElementById("tb").appendChild(button);
    document.getElementById('tb').appendChild(document.createElement("br"));
});
document.getElementById("closeTab").addEventListener('click', function() { 
    if (noTabs < 1) {
        return;
    }
    document.getElementById(currentTab).remove(); 
    closedTab = true;
})

//Ink Script and Results

function handleInkScript(code, result) {
    let cc = "";
    let inString = false;
    let full = "";
    for (char in code) {
        cc = char;
        if (cc = "\"") {
            if (inString == true) {
                inString = true;
            } else {
                inString = false;
            }
            if (inString == false) {
                full = full + cc;
            }
            if (full in tokens)
                parsedCode.push(full)
        }
    }
    if (parsedCode[0] == "%var") {
        ISVars.push("%" + parsedCode[1]);
        var i = 3;
        while (i < parsedCode.length) {
            ISVars.push(parsedCode[i]);
            i++;
        }
    } else {
        if (ISVars.includes(parsedCode[0])) {
            result.push(ISVars[ISVars.indexOf(parsedCode[0]) + 1]);
        }
    }
}

function evalate() {
    var lines = textarea.value.split("\n");
    ISVars.length = 0;
    var result = [];
    var i = 0;
    while (i < lines.length) {
        if (lines[i][0] != '%') {
            if (lines[i].indexOf("+") != -1 || lines[i].indexOf("-") != -1 || lines[i].indexOf("*") != -1 || lines[i].indexOf("/") != -1) {
                try { result.push(eval(lines[i])); } catch (err) { result.push(lines[i]); }
            } else { result.push(lines[i]); }

        } else {
            handleInkScript(lines[i], result);
        }
        i++;
    }
    var resultS = result.toString();;
    if (resultS.indexOf("<html>") == -1 && resultS.indexOf("<style>") == -1 && resultS.indexOf("<script>") == -1) {
        return result.join("\n").replaceAll("\n", "<br>");
    } else { return result.join("\n").replaceAll("\n", ""); }
}
output.srcdoc = data;
textarea.addEventListener('input', function() {
    data = evalate();
    var spaceCounter = data.split(' ').length;
    document.getElementById('wordCounter').innerHTML = spaceCounter;
    TabContent[currentTab] = textarea.value;
    output.srcdoc = data;
});
var checkbox = document.getElementById("checkbox");
checkbox.addEventListener('click', function() {
    if (checkbox.checked == true) {
        output.style = "position: absolute;left:80;height:94%;width:93%;background:#fff !important;border:none;display: default";
    }    
    if (checkbox.checked == false) {
        output.style = "display: none";
    }
})
// if user agent contains electron, set use_electron to true
var use_electron = navigator.userAgent.indexOf('Electron') > -1;
console.log(use_electron);
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
        output.srcdoc = line.join('\n')


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
