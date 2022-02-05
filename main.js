var nt = document.getElementById("nt");
var tb = document.getElementById("tb");
var noTabs = 0;
var currentTab = 0;
var TabContent = [];
function changeTab(tabA) {
    textarea.value =  TabContent[tabA-1];
    currentTab = tabA-1;
    output.srcdoc = TabContent[tabA-1];
    console.log(TabContent);
    console.log(tabA-1);
    console.log(currentTab);
}
nt.addEventListener('click', function(){
    noTabs++;
    console.log(noTabs);
    var button = document.createElement("button");
    var one =  noTabs+1;
    button.innerHTML = 'Tab' + one ;
    button.setAttribute('onclick', "changeTab("+one+")");
    TabContent.push("");
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
function swapStyleSheet(sheet){
	document.getElementById('pagestyle').setAttribute('href', sheet);
}
let output = document.getElementById('output');
let textarea = document.getElementById('text');
function evalate() {
    var lines = textarea.innerHTML.split("\n");
    var result = [];
    var i = 0;
    console.log(lines);
    while (i < lines.length ) {
        if (lines[i].indexOf("+") != -1 || lines[i].indexOf("-") != -1 || lines[i].indexOf("*") != -1 || lines[i].indexOf("/") != -1){
            try {
                result.push(eval(lines[i]));
            }
            catch(err) {
                result.push(lines[i]);
            }
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
//var data = evalate();
//output.innerHTML = data;
textarea.addEventListener('input', function(){
    var data = evalate();
    var restore = saveCaretPosition(this)
    Prism.highlightElement(this);
    console.log(data);
    TabContent[currentTab] = data;
    output.srcdoc = data;
    restore();
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
function saveCaretPosition(context){
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    range.setStart(  context, 0 );
    var len = range.toString().length;

    return function restore(){
        var pos = getTextNodeAtPosition(context, len);
        selection.removeAllRanges();
        var range = new Range();
        range.setStart(pos.node ,pos.position);
        selection.addRange(range);

    }
}

function getTextNodeAtPosition(root, index){
    const NODE_TYPE = NodeFilter.SHOW_TEXT;
    var treeWalker = document.createTreeWalker(root, NODE_TYPE, function next(elem) {
        if(index > elem.textContent.length){
            index -= elem.textContent.length;
            return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT;
    });
    var c = treeWalker.nextNode();
    return {
        node: c? c: root,
        position: index
    };
}
