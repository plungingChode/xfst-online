const CodeMirror = require("../node_modules/codemirror/lib/codemirror");
const simple = require("../node_modules/codemirror/mode/simple/simple");
import "../node_modules/codemirror/keymap/sublime.js";
import "../node_modules/codemirror/lib/codemirror.css";
import "./ambiance.css";
import "./index.css";  
import "./xfst.php";
import "./xfst";

const sampleScript = `define Nm[ N -> m || _ p ];
define pm[ p -> m || m _ ];

regex [ Nm .o. pm ];

apply down
kaNpat
kammat`

CodeMirror.defineSimpleMode("xfst", {
    start: [
        {regex: /\bdefine|regex\b/, token: "keyword"},
        {regex: /(^|[^\.])#.*/, token: "comment"},
        {regex: /\.#\.|\.o\.|@|_|->|\|\|/, token: "operator"},
        {regex: /\bapply (down|up)\b/, token: "atom"}
    ]
});

let persist;

const tgl_quiet = document.getElementById("toggle-quiet");
const tgl_autorun = document.getElementById("toggle-autorun");
const output = document.getElementById("script-output");
const input = document.getElementById("script-input");
const editor = CodeMirror(input, 
    {
        lineNumbers: true,
        lineWrapping: true,
        keyMap: "sublime",
        theme: "ambiance",
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "xfst"
    });

async function xfst() {
    const fd = new FormData();
    fd.append("input", editor.getValue());

    if (tgl_quiet.checked) 
        fd.append("quiet", 1);

    const resp = await fetch("xfst.php", { method: "POST", body: fd });
    const text = await resp.text();

    let lines = text.split("\n");
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
}

document.addEventListener("keydown", e => {
    if (e.ctrlKey && (e.key === "s" || e.key === "Enter")) {
        xfst();
        saveLocal();
        e.preventDefault();
        return;
    }
})

tgl_quiet.addEventListener("change", e => { 
    persist["quiet"] = e.target.value;
    localStorage.setItem("quiet", e.target.value);
    xfst();
});
tgl_autorun.addEventListener("change", e => {
    persist["autorun"] = e.target.value;
    localStorage.setItem("autorun", e.target.value);
});
document.getElementById("run").addEventListener("click", e => { 
    output.innerHTML = "";
    setTimeout(xfst, 100);
});

document.getElementById("fload").addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (function(f) {
        return function(e) {
            editor.setValue(e.target.result);
            xfst();
        }
    })(file);
    reader.readAsText(file);
})

function saveLocal() {
    localStorage.setItem("script", editor.getValue());
    console.log("saved");
}

let autosave = null;
let autorun = null;
CodeMirror.on(editor, "change", () => {
    clearTimeout(autosave);
    autosave = setTimeout(saveLocal, 1000);

    if (persist["autorun"]) {
        clearTimeout(autorun);
        autorun = setTimeout(xfst, 1000);
    }
});

window.addEventListener("load", () => {
    persist = {
        "script": localStorage.getItem("script"),
        "quiet": localStorage.getItem("quiet") || false,
        "autorun": localStorage.getItem("autorun") || true
    }

    if (persist["script"] === null) 
        persist["script"] = sampleScript;

    editor.setValue(persist["script"]);
    tgl_autorun.value = persist["autorun"];
    tgl_quiet.value = persist["quiet"];
    setEditorSize();
    xfst();
})

// // TODO: add download option
// document.getElementById("fsave").addEventListener("change", e => {
//     var element = document.createElement('a');
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent("asdsad"));
//     element.setAttribute('download', "filename.txt");
  
//     element.style.display = 'none';
//     document.body.appendChild(element);
  
//     element.click();
  
//     document.body.removeChild(element);
// })

function setEditorSize() {
    input.style.height = output.offsetHeight + "px";
}

window.addEventListener("resize", () => {
    setEditorSize();
})
