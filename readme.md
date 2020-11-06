## XFST script editor

Edit and run XFST scripts, using a server side `xfst` binary.

Read [more about XFST][01] or check out the [live demo][02].

#### Try it out
Install `npm` and a PHP server. Place the XFST binary appropriate for your  
system in the `src` folder. You can download XFST from [here][03].

The project uses [CodeMirror][04] as the script editor, with its [Simple Mode Addon][05].

```shell
npm install
npm install -D webpack webpack-cli

# add CodeMirror Simple Mode manually
mkdir -p node_modules/codemirror/mode/simple
curl https://codemirror.net/addon/mode/simple.js > node_modules/codemirror/mode/simple/simple.js

npm run dev
cd dist
chmod +x xfst
php -S localhost:5000
```

To run the edited script, press the Run button or Ctrl+Enter.

[01]: https://sites.google.com/a/utcompling.com/icl-f11/home/xfst-tutorial
[02]: http://users.itk.ppke.hu/~szipe11/xfst/
[03]: https://web.stanford.edu/~laurik/.book2software/
[04]: https://codemirror.net/
[05]: https://codemirror.net/demo/simplemode.html