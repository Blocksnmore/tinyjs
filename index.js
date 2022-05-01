Tiny.postRender(() => {
	hljs.highlightAll();
	for (const code of document.getElementsByTagName("code")) {
		hljs.lineNumbersBlock(code);
	}
});

// window.onfocus = () => {
// 	location.reload();
// };

Tiny.bulkSet({
	tech: "Web Development",
	year: new Date().getFullYear(),

	// JS Examples
	codesample1: /*javascript*/`
<div>
  <span t>Welcome to $\{sitename}!</span>
</div>
	`.trim(),

	codesample2: /*javascript*/`
Tiny.set("sitename", "TinyJS");
Tiny.bulkSet({
	library: "Tiny",
	language: "JavaScript",
})
	`.trim(),

	codesample3: /*javascript*/`
<div>
  <p t>$\{input}</p>
  <input 
    type="text" 
    t-bind="input" 
    t-bind:fallback="Type something here!" 
  />
</div>
	`.trim(),

	link: "https://github.com/blocksnmore/tinyjs",
});
