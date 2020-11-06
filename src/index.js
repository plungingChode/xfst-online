const CodeMirror = require("../node_modules/codemirror/lib/codemirror");
const simple = require("../node_modules/codemirror/mode/simple/simple");
import "../node_modules/codemirror/lib/codemirror.css";
import "./ambiance.css";
import "./index.css";  
import "./xfst.php";
import "./xfst";

const sampleScript = `define Nm[
	N -> m || _ p 
];

define pm[ 
	p -> m || m _ 
];

regex [
	Nm .o. pm
];

apply down

kaNpat
kammat`

CodeMirror.defineSimpleMode("xfst", {
    start: [
        {regex: /\bdefine|regex\b/, token: "keyword"},
        {regex: /#[^\\.].*/, token: "comment"},
        {regex: /\.#\.|\.o\.|@|_|->|\|\|/, token: "operator"},
        {regex: /\bapply (down|up)\b/, token: "atom"}
    ]
});

const left = document.getElementById("leftSide");
const quiet = document.getElementById("qSwitchCheck");
const output = document.getElementById("xfstOutput");
const editor = CodeMirror(
    document.getElementById("xfstInput"), 
    {
        lineNumbers: true,
        lineWrapping: true,
        theme: "ambiance",
        mode: "xfst",
        extraKeys: {
            "[": autocompleteBrackets,
        }
    });

function autocompleteBrackets() {
    const start = editor.getCursor(true);
    editor.replaceSelection("[]", start);

    start.ch += 1;
    editor.setCursor(start);
}

async function xfst() {
    const fd = new FormData();
    fd.append("input", editor.getValue());

    if (quiet.checked) {
        fd.append("quiet", 1);
    }

    const resp = await fetch("xfst.php", { method: "POST", body: fd });
    const text = await resp.text();
    
    fetch("xfst.php", {
        method: "POST",
        body: fd
    })
    .then(d => d.text())
    .then(txt =>  {
        let lines = txt.split("\n");
        lines = lines.map(l => {
            if (l.startsWith("***")) {
                return `<span class="xfst-err">${l}"</span>`;
            }
            else if (l.startsWith("Defined")) {
                return `<span class="xfst-def">${l}</span>`;
            }
            else if (l !== "bye.") {
                return l;
            }
        })
        output.innerHTML = lines.join("\n");
    });
}

document.addEventListener("keydown", e => {
    if (e.ctrlKey && (e.key === "s" || e.key === "Enter")) {
        xfst();
        e.preventDefault();
        return;
    }
})

quiet.addEventListener("change", e => xfst());
document.getElementById("run").addEventListener("click", e => xfst());

document.getElementById("fload").addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (function(f) {
        return function(e) {
            editor.setValue(e.target.result)
        }
    })(file);
    reader.readAsText(file);
})

// TODO: add download option
// document.getElementById("fsave").addEventListener("change", e => {
//     var element = document.createElement('a');
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent("asdsad"));
//     element.setAttribute('download', "filename.txt");
  
//     element.style.display = 'none';
//     document.body.appendChild(element);
  
//     element.click();
  
//     document.body.removeChild(element);
// })

// FIXME: fix left & right side sizing
function setEditorSize() {
    if (window.innerWidth < 1201) {
        left.style.height = window.innerHeight / 2 - 20 + "px";
    }
    else {
        left.style.height = document.body.offsetHeight - 115 + "px";
    }
}

window.addEventListener("resize", () => {
    setEditorSize();
    console.log(window.innerHeight / 2);
    console.log(window.innerWidth);
})

setEditorSize();
editor.setValue(sampleScript);
xfst();