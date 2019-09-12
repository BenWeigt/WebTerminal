(()=>{
	window.launchTerminal = ()=>{
		let terminal = new WebTerminal();
		document.body.appendChild(terminal);
		terminal.addTerminal();
	};

	const MINSIZE = 350;

	class WebTerminal extends HTMLElement {
		constructor() {
			super();
			
			this.attachShadow({mode: 'open'});
			this.shadowRoot.innerHTML = `
				<style>
					div{
						box-sizing: border-box;
						position: relative;
					}

					#grid{
						position: fixed;
						top: 0; bottom: 0; left: 0; right: 0;
						pointer-events: none;
						display: grid;
						grid-template-columns: min-content 1fr min-content;
						grid-template-rows: min-content 1fr min-content;
						grid-template-areas: 
							"l t r"
							"l . r"
							"l b r";
					}
					
					#r, #l, #t, #b {
						overflow: hidden;
					}
					#r, #l {
						resize: horizontal;
					}
					#t, #b {
						resize: vertical;
					}
					#t{
						grid-area: t;
					}
					#r{
						grid-area: r;
					}

					#b{
						grid-area: b;
					}
					#l{
						grid-area: l;
					}

					#t-rsz, #b-rsz, #l-rsz, #r-rsz{
						position: absolute;
						pointer-events: all;
						opacity: 0;
					}
					#t-rsz.active, #b-rsz.active, #l-rsz.active, #r-rsz.active
					{
						position: fixed;
						top: 0; left: 0; width: 100%; height: 100%;
						z-index: 10000000;
					}
					#t-rsz:only-child, #b-rsz:only-child, #l-rsz:only-child, #r-rsz:only-child
					{
						display: none;
					}
					#t-rsz, #b-rsz{
						width: 100%;
						height: 5px;
						cursor: ns-resize;
						left: 0;
					}
					#l-rsz, #r-rsz{
						width: 5px;
						height: 100%;
						cursor: ew-resize;
						top: 0;
					}
					#l-rsz{
						right: 0;
					}
					#r-rsz{
						left: 0;
					}
					#t-rsz{
						bottom: 0;
					}
					#b-rsz{
						top: 0;
					}

					.container{
						pointer-events: all;
						background: #242424;
						color: #909090;
						height: 100%;
						width: 100%;
						display: grid;
						grid-template-columns: 1fr;
						grid-template-rows: auto 1fr;
						grid-template-areas: 
							"t"
							"c";
					}
					.tabs{
						font-size: 22px;
						display: flex;
						align-items: stretch;
						box-sizing: content-box;
						width: 100%;
						height: 32px;
						line-height: 36px;
						background: #333333;
						border-bottom: 1px solid #3d3d3d;
						grid-area: t;
					}
					.tabs > *:hover{
						color: #ccc;
					}
					
					#r .container{
						border-left: 1px solid #525252;
					}
					#b .container{
						border-top: 1px solid #525252;
					}

					.addTerminal{
						cursor: pointer;
						width: 32px;
						text-align: center;
					}

					.tabs .divider{
						width: 0;
						margin: 4px;
						border-right: 1px solid #3d3d3d;
					}


				</style>

				<div id="grid">
					<div id="t">
						<div id="t-rsz"></div>
					</div>
					<div id="r">
						<div id="r-rsz"></div>
					</div>
					<div id="b">
						<div id="b-rsz"></div>
					</div>
					<div id="l">
						<div id="l-rsz"></div>
					</div>
				</div>
			`;
			
			for (const side of ['t', 'r', 'b', 'l']) {
				const rsz = this.shadowRoot.getElementById(side+'-rsz');
				rsz.addEventListener('mousedown', evt=>{
					evt.preventDefault();
					rsz.classList.add('active');

					const vertical = side == 't' || side == 'b';
					const direction = side == 'b' || side == 'r' ? -1 : 1;
					const pageXY = vertical ? 'pageY' : 'pageX';
					const dimension = vertical ? 'height' : 'width';

					const base = rsz.parentNode.getBoundingClientRect()[dimension];
					const from = evt[pageXY];
					let to = from;

					const fnResize = evt=>{
						to = evt[pageXY];
						rsz.parentNode.style[dimension] = Math.max(MINSIZE, base + ((to - from) * direction))  + 'px';
					};
					const fnEnd = ()=>{
						rsz.classList.remove('active');
						window.removeEventListener('mousemove', fnResize, true);
						window.removeEventListener('mouseup', fnEnd, true);
					};
					window.addEventListener('mousemove', fnResize, true);
					window.addEventListener('mouseup', fnEnd, true);
				});
			}
		}

		addTerminal(side) {
			if (!['t', 'l', 'b', 'r'].includes(side))
				side = 'r';
			const nSide = this.shadowRoot.getElementById(side);
			if (!nSide.querySelector('.container')) {
				const container = document.createElement('div');
				container.innerHTML = `
					<div class="tabs">
						<div class="addTerminal">🞤</div>
						<div class="divider"></div>
					</div>
				`;
				container.classList.add('container');
				nSide.prepend(container);
				for (const container of this.shadowRoot.querySelectorAll('.container'))
				{
					const parent = container.parentNode;
					const vertical = parent.id == 't' || parent.id == 'b';
					container.parentNode.style[vertical ? 'height' : 'width'] = MINSIZE + 'px';
				}
			}

			const nContainer = nSide.querySelector('.container');
			
			
		}
	}
	window.customElements.define('web-terminal', WebTerminal);
})();