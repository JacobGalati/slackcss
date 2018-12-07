// run Slack app with inspector
// In Terminal:
// export SLACK_DEVELOPER_MENU=true
// open /Applications/Slack.app


// In  slack.app/Contents/Resources/app.asar.unpacked/src/static/ssb-interop.js paste to end of file.



// First make sure the wrapper app is loaded
document.addEventListener("DOMContentLoaded", function() {

   // Then get its webviews
  let webviews = document.querySelectorAll(".TeamView webview");

  // Fetch our CSS in parallel ahead of time
  const cssPath = 'https://raw.githubusercontent.com/JacobGalati/slackcss/master/slack-default.css';
  //use slack-dark.css for dark theme
  let cssPromise = fetch(cssPath).then(response => response.text());
  console.log(cssPromise)
  let customCustomCSS = `
  :root {
    --primary: #09F;
    --text: #CCC;
    --background: #222;
    --background-elevated: #383838;
    --background-hover: #383838;
  }
  `

   // Insert a style tag into the wrapper view
   cssPromise.then(css => {
      let s = document.createElement('style');
      s.type = 'text/css';
      s.innerHTML = css + customCustomCSS;
      document.head.appendChild(s);
   });

   // Wait for each webview to load
   webviews.forEach(webview => {
      webview.addEventListener('ipc-message', message => {
         if (message.channel == 'didFinishLoading')
            // Finally add the CSS into the webview
            cssPromise.then(css => {
               let script = `
                     let s = document.createElement('style');
                     s.type = 'text/css';
                     s.id = 'slack-custom-css';
                     s.innerHTML = \`${css + customCustomCSS}\`;
                     document.head.appendChild(s);
                     `
               webview.executeJavaScript(script);
            })
      });
   });
});