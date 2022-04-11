//Vars
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
    var i = 2;
    while (i < localStorage.getItem("noTabs")) {
        var button = document.createElement("button");
        button.innerHTML = 'Tab ' + i;
        button.setAttribute('onclick', "changeTab("+i+")");
        button.setAttribute('id', lasttab+1);
        document.getElementById("tb").appendChild(button);
        i+=1
        lasttab+=1;
    }
    lasttab = localStorage.getItem("currenttab");
    document.getElementById("0").setAttribute('class', 'none')
    document.getElementById(localStorage.getItem('currenttab')).setAttribute('class', 'button-highlight')
    noTabs = localStorage.getItem("noTabs")-2;
}
if (localStorage.getItem("tabs") != null){ 
    var TabContent = localStorage.getItem("tabs").split(",");
    appendTabs();
}
else {var TabContent = []}
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
    localStorage.setItem('currenttab', currentTab);
}
nt.addEventListener('click', function(){
    noTabs++;
    var button = document.createElement("button");
    var one = noTabs +1;
    button.innerHTML = 'Tab ' + one ;
    button.setAttribute('onclick', "changeTab("+one+")");
    button.setAttribute('id', noTabs);  
    document.getElementById("tb").appendChild(button);
});
//Ink Script and Results

function handleInkScript(code, result) {
    let cc = "";
    let inString = false;
    let full = "";
    for(char in code) {
        cc = char;
        if(cc="\"") {
          if(inString == true) {
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
        var i= 3;
        while (i < parsedCode.length) {
            ISVars.push(parsedCode[i]);
            i++;
        }
    }
        else {
            if (ISVars.includes(parsedCode[0])) {
                result.push(ISVars[ISVars.indexOf(parsedCode[0])+1]);
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
output.srcdoc = data;
textarea.addEventListener('input', function(){
    data = evalate();
    TabContent[currentTab] = textarea.value;
    output.srcdoc = data;
});
