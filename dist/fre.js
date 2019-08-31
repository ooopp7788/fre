"use strict";function h(e,t){let n=t||{},r=n.key||null,o=[];for(let e=2;e<arguments.length;e++){let t=arguments[e];null===t||!0===t||!1===t||(t.pop||"object"==typeof t?o.push(t):"function"==typeof t?o=t:o.push({type:"text",props:{nodeValue:t}}))}return n.children=o,{type:e,props:n,key:r}}const arrayfy=e=>e?Array.isArray(e)?e:[e]:[],isSame=(e,t)=>e.type===t.type,isNew=(e,t)=>n=>"children"!==n&&"key"!==n&&e[n]!==t[n];function hashfy(e){let t={},n=0,r=0;return arrayfy(e).forEach(e=>{e.pop?(e.forEach(e=>{let o=((e||{}).props||{}).key;o?t["."+n+"."+o]=e:(t["."+n+"."+r]=e)&&r++}),n++):(t["."+n]=e)&&n++}),t}function merge(e,t){let n={};for(const t in e)n[t]=e[t];for(const e in t)n[e]=t[e];return n}const defer=requestAnimationFrame||setTimeout,isFn=e=>"function"==typeof e;function updateProperty(e,t,n,r){if("style"===t)for(key in r){let n=r&&r[key]?r[key]:"";e[t][key]=n}else"o"===t[0]&&"n"===t[1]?(t=t.slice(2).toLowerCase(),n&&e.removeEventListener(t,n),e.addEventListener(t,r)):e.setAttribute(t,r)}function updateElement(e,t,n){Object.keys(n).filter(isNew(t,n)).forEach(r=>{"value"===r||"nodeValue"===r?e[r]=n[r]:updateProperty(e,r,t[r],n[r])})}function createElement(e){const t="text"===e.type?document.createTextNode(""):document.createElement(e.type);return updateElement(t,[],e.props),t}let cursor=0;function update(e,t,n){const r=this?this:getWIP();n=t?t(r.state[e],n):n,r.state[e]=n,scheduleWork(r)}function resetCursor(){cursor=0}function useState(e){return useReducer(null,e)}function useReducer(e,t){let n=getWIP();if(!n)return[t,o];let r="$"+cursor,o=update.bind(n,r,e);cursor++;let s=n.state||{};return r in s?[s[r],o]:(n.state[r]=t,[t,o])}function useEffect(e,t){let n=getWIP();if(!n)return;let r="$"+cursor;cursor++,n.effect=n.effect||{},n.effect[r]=useCallback(e,t)}function useCallback(e,t){return useMemo(()=>e,t)}function useMemo(e,t){let n=getWIP();if(n){let r=!t||(n.oldInputs||[]).some((e,n)=>t[n]!==e);if(!t||t.length||n.isMounted||(r=!0,n.isMounted=!0),n.oldInputs=t,r)return e()}}function createContext(e={}){let t={};return{context:e,update:e=>{for(let n in t)t[n](e)},subscribe:(e,n)=>{n in t||(t[n]=e)},set:t}}function useContext(e){const[t,n]=useState(e.context),r=getWIP().type.name;return e.subscribe(n,r),[t,e.update]}const options={},FPS=1e3/60,[HOST,HOOK,ROOT,PLACE,UPDATE,DELETE]=[0,1,2,3,4,5];let updateQueue=[],nextWork=null,pendingCommit=null,currentFiber=null,once=!0;function render(e,t){scheduleWork({tag:ROOT,base:t,props:{children:e}})}function scheduleWork(e){updateQueue.push(e),nextWork||(nextWork=updateQueue.shift(),defer(workLoop))}function workLoop(e=0){if(e&&performance.now()-e>FPS)defer(workLoop);else{const e=performance.now();(nextWork=performWork(nextWork))?workLoop(e):options.commitWork?options.commitWork(pendingCommit):commitWork(pendingCommit)}}function performWork(e){if(e.tag==HOOK?updateHOOK(e):updateHost(e),e.child)return e.child;for(;e;){if(completeWork(e),e.sibling)return e.sibling;e=e.parent}}function updateHost(e){options.end||e.base||(e.base=createElement(e));let t=e.parent||{};e.insertPoint=t.oldPoint,t.oldPoint=e,reconcileChildren(e,e.props.children)}function updateHOOK(e){e.props=e.props||{},e.state=e.state||{},currentFiber=e,resetCursor();const t=e.type(e.props);reconcileChildren(e,t),currentFiber.patches=e.patches}function fiberize(e,t){return t.children=hashfy(e,t.children)}function reconcileChildren(e,t){const n=e.children,r=fiberize(t,e);let o={};for(let t in n){let s=r[t],c=n[t];s&&isSame(s,c)?o[t]=c:(c.patchTag=DELETE,e.patches.push(c))}let s=null,c=null;for(let t in r){let n=r[t],i=o[t];i?(c=createFiber(i,{patchTag:UPDATE}),options.end||(n.patchTag=UPDATE),(n=merge(c,n)).alternate=c,i.key&&(n.patchTag=PLACE)):n=createFiber(n,{patchTag:PLACE}),r[t]=n,n.parent=e,s?s.sibling=n:(e.child=n,n.oldPoint=null),s=n}s&&(s.sibling=null)}function createFiber(e,t){return t.tag=isFn(e.type)?HOOK:HOST,e.props=e.props,merge(e,t)}function completeWork(e){!options.end&&e.parent?e.parent.patches=(e.parent.patches||[]).concat(e.patches||[],e.patchTag?[e]:[]):pendingCommit=e}function commitWork(e){e.patches.forEach(e=>{commit(e);const t=e.effect;if(e.effect)for(const e in t)t[e]()}),once=!1,nextWork=null,pendingCommit=null}function commit(e){let t=e.parent;for(;t.tag==HOOK;)t=t.parent;const n=t.base;let r=e.base||e.child.base;if(t.patches=e.patches=[],e.parent.tag!=ROOT)switch(e.patchTag){case UPDATE:updateElement(r,e.alternate.props,e.props);break;case DELETE:n.removeChild(r);break;default:const t=e.insertPoint;let o=t?t.base:null,s=o?o.nextSibling:n.firstChild;if(s==r)return;if(null===s&&r===n.lastChild)return;once&&(s=null),n.insertBefore(r,s)}}function getWIP(){return currentFiber||null}exports.createContext=createContext,exports.createElement=h,exports.h=h,exports.options=options,exports.render=render,exports.scheduleWork=scheduleWork,exports.useCallback=useCallback,exports.useContext=useContext,exports.useEffect=useEffect,exports.useMemo=useMemo,exports.useReducer=useReducer,exports.useState=useState;
//# sourceMappingURL=fre.js.map