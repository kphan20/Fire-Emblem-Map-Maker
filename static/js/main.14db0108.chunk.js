(this.webpackJsonpmap_maker=this.webpackJsonpmap_maker||[]).push([[0],{19:function(t,e,n){},20:function(t,e,n){},26:function(t,e,n){},27:function(t,e,n){"use strict";n.r(e),e.default=n.p+"static/media/Sacae1.0b274fdb.png"},29:function(t,e,n){"use strict";n.r(e);var r=n(0),o=n.n(r),c=n(8),a=n.n(c),i=(n(19),n(3)),s=(n(20),n(4)),l=n(1),u=16,d=512,f=function(t){return Object(l.jsx)("div",{className:"cell",style:t})},b=function(t){return t%32*u*2},j=function(t){return 2*(496-Math.floor(t/32)*u)},h=Object(s.b)({name:"hotbar",initialState:{items:[]},reducers:{add:function(t,e){e.payload<0||(t.items.length<8&&!t.items.includes(e.payload)?t.items.push(e.payload):console.error("Hotbar size exceeded"))},deleteItem:function(t,e){t.items.splice(e.payload,1)},clear:function(t){t.items=[]}}}),p=h.actions,m=p.add,g=(p.deleteItem,p.clear),v=function(t){return t.hotbar.items},O=h.reducer,x=n(7),w=function(){return Object(x.b)()},y=x.c,C=Object(s.b)({name:"tileset",initialState:{selectedTile:-1,selectedX:"",selectedY:""},reducers:{select:function(t,e){t.selectedTile=e.payload}}}),k=C.actions.select,E=function(t){return t.tileset.selectedTile},M=C.reducer;function N(){for(var t=y(v),e=w(),n=t.map((function(t){var n={backgroundPositionX:"-".concat(b(t),"px"),backgroundPositionY:"-".concat(j(t),"px")};return Object(l.jsx)("div",{className:"hotbarCell",onClick:function(){e(k(t))},style:n})}));n.length<8;)n.push(Object(l.jsx)("div",{className:"hotbarEmpty"}));return Object(l.jsx)("div",{id:"hotbar",className:"absolute",children:n})}n(26);function T(){var t=[],e=w();return function(){for(var n=function(n){for(var r=function(r){var o={top:"".concat((d-n-u)/d*100,"%"),right:"".concat((d-r-u)/d*100,"%"),width:"".concat(u,"px"),height:"".concat(u,"px"),margin:"none"};t.push(Object(l.jsx)("div",{className:"tilesetSelection",style:o,onClick:function(){e(k(r/u+n/u*d/u))}}))},o=0;o<d;o+=u)r(o)},r=0;r<d;r+=u)n(r)}(),Object(l.jsxs)("div",{id:"tilesetContainer",children:[t,Object(l.jsx)("img",{src:n(27).default,alt:"tilesetImage"})]})}var R=n(2),L=n(5),P={grid:function(t,e){for(var n=[],r=0;r<t*e;r++)n.push(f());return n}(3,3),rows:3,cols:3,dragFill:!1},S=Object(s.b)({name:"mapCanvas",initialState:P,reducers:{changeGridTile:function(t,e){var n=Object(L.a)(t.grid);return n[e.payload.id]=f(e.payload.style),Object(R.a)(Object(R.a)({},t),{},{grid:n})},addBottomRow:function(t){for(var e=Object(L.a)(t.grid),n=0;n<t.cols;n++)e.push(f());return Object(R.a)(Object(R.a)({},t),{},{grid:e,rows:t.rows+1})},addTopRow:function(t){var e=Array(t.cols).fill(f());return Object(R.a)(Object(R.a)({},t),{},{grid:e.concat(t.grid),rows:t.rows+1})},addRightCol:function(t){for(var e=Object(L.a)(t.grid),n=1;n<t.rows;n++)e.splice(n*(t.cols+1)-1,0,f());return e.push(f()),Object(R.a)(Object(R.a)({},t),{},{grid:e,cols:t.cols+1})},addLeftCol:function(t){for(var e=Object(L.a)(t.grid),n=0;n<t.rows;n++)e.splice(n*(t.cols+1),0,f());return Object(R.a)(Object(R.a)({},t),{},{grid:e,cols:t.cols+1})},deleteRow:function(t){var e=t.grid.slice(0,t.grid.length-t.cols);return Object(R.a)(Object(R.a)({},t),{},{grid:e,rows:t.rows-1})},deleteCol:function(t){for(var e=Object(L.a)(t.grid),n=e.length-1;n>=0;n-=t.cols)e.splice(n,1);return Object(R.a)(Object(R.a)({},t),{},{grid:e,cols:t.cols-1})},toggleDragFill:function(t){return Object(R.a)(Object(R.a)({},t),{},{dragFill:!t.dragFill})}}}),I=S.actions,Y=I.changeGridTile,F=I.addBottomRow,X=I.addTopRow,B=I.addLeftCol,A=I.addRightCol,D=I.deleteRow,V=I.deleteCol,z=I.toggleDragFill,J=function(t){return t.mapCanvas.grid},W=function(t){return t.mapCanvas.rows},G=function(t){return t.mapCanvas.cols},H=function(t){return t.mapCanvas.dragFill},_=S.reducer;function $(){var t=Object(r.useRef)(null),e=w(),n=y(W),o=y(G),c=y(J),a=y(H),s=y(E),d=Object(r.useState)(),f=Object(i.a)(d,2),h=f[0],p=f[1],m=Object(r.useState)(),g=Object(i.a)(m,2),v=g[0],O=g[1];Object(r.useEffect)((function(){p("-".concat(b(s),"px")),O("-".concat(j(s),"px"))}),[s]);var x=Object(r.useState)(1),C=Object(i.a)(x,2),k=C[0],M=C[1];Object(r.useEffect)((function(){var r=t.current;r.style.setProperty("--rows","".concat(n)),r.style.setProperty("--columns","".concat(o)),r.style.setProperty("--tilesize","".concat(32,"px"));var c=[0,0],i=[0,0],l=[0,0],d=!1,f=!1,b=0,j=0,p=0,m=0,g=r.getBoundingClientRect(),O=function(t,e,n){return n<t?t:n>e?e:n},x=function(t){c=l=[t.clientX-r.offsetLeft,t.clientY-r.offsetTop],i=[t.clientX-g.x,t.clientY-g.y],d=!0;var e=parseInt(r.style.getPropertyValue("--columns")),n=parseInt(r.style.getPropertyValue("--rows")),o=window.visualViewport.width-2*e*u,a=window.visualViewport.height-2*n*u,s=u*(k-1),f=e*s,h=n*s,v=o>=0?1:-1,O=o-v*f;p=Math.min(v*f,O),m=Math.max(v*f,O),O=a-(v=a>=0?1:-1)*h,b=Math.min(v*h,O),j=Math.max(v*h,O)},w=function(t){if(d){c=[t.clientX-r.offsetLeft,t.clientY-r.offsetTop];var e=r.offsetLeft,n=r.offsetTop,o=c[0]-l[0],i=c[1]-l[1];e+=o,n+=i,function(t,e){return Math.pow(t,2)+Math.pow(e,2)>.01}(o,i)&&(f=!0),a||(e=O(p,m,e),n=O(b,j,n),r.style.left="".concat(e,"px"),r.style.top="".concat(n,"px"))}},y=function(t){if(d){if(d=!1,f){if(a)for(var c=Math.floor(i[0]/(32*k)),l=Math.floor(i[1]/(32*k)),u=Math.floor((t.clientX-g.x)/(32*k)),b=Math.floor((t.clientY-g.y)/(32*k)),j={backgroundPositionX:h,backgroundPositionY:v},p=Math.min(c,u);p<=Math.max(c,u);p++)for(var m=Math.min(l,b);m<=Math.max(l,b)&&!(m>n-1||p>o-1);m++)e(Y({id:m*o+p,style:j}))}else if(s>-1){var O=r.getBoundingClientRect(),x=t.clientX-O.x,w=t.clientY-O.y;x=Math.floor(x/(32*k)),w=Math.floor(w/(32*k)),e(Y({id:w*o+x,style:{backgroundPositionX:h,backgroundPositionY:v}}))}f=!1}},C=function(t){t.preventDefault();var e=k;e+=-.01*t.deltaY,e=Math.min(Math.max(1,e),4),r.style.transform="scale(".concat(e,")"),M(e)};return r.addEventListener("mousedown",x),r.addEventListener("mousemove",w),r.addEventListener("mouseup",y),r.addEventListener("wheel",C),window.addEventListener("mouseup",y),function(){r.removeEventListener("mousedown",x),r.removeEventListener("mousemove",w),r.removeEventListener("mouseup",y),r.removeEventListener("wheel",C),window.removeEventListener("mouseup",y)}}),[h,v,n,o,k,a]);return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)("div",{id:"container",className:"absolute",ref:t,children:c}),Object(l.jsx)("button",{id:"recenter",className:"absolute",onClick:function(){var e=t.current,n=e.offsetWidth,r=n<window.visualViewport.width?"calc(50vw - ".concat(n/2,"px)"):"0px";e.style.left=r;var o=e.offsetHeight,c=o<window.visualViewport.height?"calc(50vh - ".concat(o/2,"px)"):"0px";e.style.top=c},children:"Recenter Map"})]})}var q=n(13),K=n.n(q),Q=n(14);function U(){var t=w(),e=y(J),n=y(W),o=y(G),c=function(t){for(var e=[],r=[],c=0;c<n;c++){for(var a=0;a<o;a++)r.push(t[c*o+a]);e.push(r),r=[]}e.reverse();var i=[];return e.forEach((function(t){t.forEach((function(t){i.push(t)}))})),i},a=function(t){return parseInt(t.substring(0,t.length-2))},s=function(){var t=Object(Q.a)(K.a.mark((function t(){var r,i,s,l,f,b;return K.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=c(e),i=[],s=0;case 3:if(!(s<r.length)){t.next=15;break}l=r[s].props.style,t.prev=5,i.push((j=a(l.backgroundPositionX),h=a(l.backgroundPositionY),-j/32+(h/2+d-u)/u*32)),t.next=12;break;case 9:return t.prev=9,t.t0=t.catch(5),t.abrupt("return");case 12:s++,t.next=3;break;case 15:return f={rows:n,cols:o,mapData:i},t.next=18,fetch("http://127.0.0.1:3000",{mode:"cors",method:"POST",body:JSON.stringify(f)});case 18:return b=t.sent,console.log(b),t.abrupt("return",b);case 21:case"end":return t.stop()}var j,h}),t,null,[[5,9]])})));return function(){return t.apply(this,arguments)}}(),f=Object(r.useState)(n),b=Object(i.a)(f,2),j=b[0],h=b[1],p=Object(r.useState)(o),m=Object(i.a)(p,2),g=m[0],v=m[1];Object(r.useEffect)((function(){h(n),v(o)}),[n,o]);return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsxs)("div",{id:"gridEditors",className:"absolute",children:[Object(l.jsx)("button",{id:"addBottomRow",className:"gridEditor",onClick:function(){return t(F())},children:"Add Bottom row"}),Object(l.jsx)("button",{id:"addTopRow",className:"gridEditor",onClick:function(){return t(X())},children:"Add Top Row"}),Object(l.jsx)("button",{id:"addRightCol",className:"gridEditor",onClick:function(){return t(A())},children:"Add Right Col"}),Object(l.jsx)("button",{id:"addLeftCol",className:"gridEditor",onClick:function(){return t(B())},children:"Add Left Col"}),Object(l.jsx)("button",{id:"submit",className:"gridEditor",onClick:s,children:"Submit"}),Object(l.jsx)("button",{id:"toggleDragFill",className:"gridEditor",onClick:function(){return t(z())},children:"Drag Fill"})]}),Object(l.jsxs)("div",{id:"sizeInput",className:"absolute",children:[Object(l.jsx)("span",{children:"Rows:"}),Object(l.jsx)("input",{id:"rowChange",className:"gridEditor",type:"number",min:"0",max:"50",value:j,onChange:function(t){return h(parseInt(t.currentTarget.value))},onBlur:function(e){return function(e){if(e)if(n<e)for(var r=0;r<e-n;r++)t(F());else if(n>e)for(var o=n;o>e;o--)t(D())}(parseInt(e.currentTarget.value))}}),Object(l.jsx)("br",{}),Object(l.jsx)("span",{children:"Columns:"}),Object(l.jsx)("input",{id:"colsChange",className:"gridEditor",type:"number",min:"0",max:"50",value:g,onChange:function(t){return v(parseInt(t.currentTarget.value))},onBlur:function(e){return function(e){if(e)if(o<e)for(var n=0;n<e-o;n++)t(A());else if(o>e)for(var r=o;r>e;r--)t(V())}(parseInt(e.currentTarget.value))}})]})]})}function Z(){var t=Object(r.useState)(!0),e=Object(i.a)(t,2),n=e[0],o=e[1],c=w(),a=y(E),s={height:"".concat(32),width:"".concat(32),backgroundPositionX:"-".concat(b(a),"px"),backgroundPositionY:"-".concat(j(a),"px")};return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsxs)("div",{id:"tileset",className:"absolute",children:[Object(l.jsx)("button",{id:"toggleTileset",onClick:function(){return o(!n)},children:n?">":"<"}),n&&Object(l.jsx)(T,{})]}),Object(l.jsx)(U,{}),Object(l.jsx)($,{}),Object(l.jsxs)("div",{id:"hotbarOptions",className:"absolute",children:[Object(l.jsx)("button",{id:"hotbarAdd",onClick:function(){return c(m(a))},children:"Add selected to hotbar"}),Object(l.jsx)("button",{id:"hotbarClear",onClick:function(){return c(g())},children:"Clear"})]}),Object(l.jsx)("div",{id:"selectedTile",className:"absolute",style:s}),Object(l.jsx)(N,{})]})}var tt=Object(s.a)({reducer:{hotbar:O,tileset:M,mapCanvas:_}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(Object(l.jsx)(o.a.StrictMode,{children:Object(l.jsx)(x.a,{store:tt,children:Object(l.jsx)(Z,{})})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[29,1,2]]]);
//# sourceMappingURL=main.14db0108.chunk.js.map