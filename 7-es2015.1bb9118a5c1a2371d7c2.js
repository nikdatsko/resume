(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{j4bZ:function(n,t,l){"use strict";l.r(t);var o=l("8Y7J");class e{}var i=l("pMnS"),c=l("SVse");class u{constructor(n){this.portfolioService=n,this.projects=[]}ngOnInit(){this.portfolioService.getProjects().subscribe(n=>this.projects=n)}onImgLoad(n){n.loaded=!0}onImgError(n){n.fail=!0}}var r=l("IheW");const a=(()=>{class n{constructor(n){this.http=n}getProjects(){return this.http.get("/assets/data/projects.json")}}return n.ngInjectableDef=o.Fb({factory:function(){return new n(o.Jb(r.c))},token:n,providedIn:"root"}),n})();var s=o.lb({encapsulation:0,styles:[['.projects[_ngcontent-%COMP%]{list-style:none}.projects[_ngcontent-%COMP%]:after{content:"";display:table;clear:both}.projects[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{float:left;width:20%}@media (max-width:600px){.projects[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{width:33.3333%}}.item[_ngcontent-%COMP%]{position:relative;height:0;padding-bottom:100%}.item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:absolute;top:0;left:0;bottom:0;right:0;padding:5px;white-space:nowrap;text-align:center;font:0/0 a;color:#afafaf;-webkit-transform:scale(0);transform:scale(0);transition:-webkit-transform .2s ease-in-out;transition:transform .2s ease-in-out;transition:transform .2s ease-in-out,-webkit-transform .2s ease-in-out}.item[_ngcontent-%COMP%]   a.loaded[_ngcontent-%COMP%]{-webkit-transform:scale(1);transform:scale(1)}.item[_ngcontent-%COMP%]   a.light[_ngcontent-%COMP%]{background:#afafaf}.item[_ngcontent-%COMP%]   a.full[_ngcontent-%COMP%]{padding:0}.item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:before, .item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{display:inline-block;vertical-align:middle}.item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:before{content:"";height:100%}.item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{font:13px/normal sans-serif;white-space:normal}.item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-width:100%}']],data:{}});function p(n){return o.Db(0,[(n()(),o.nb(0,0,null,null,0,"img",[],[[8,"src",4]],[[null,"load"],[null,"error"]],function(n,t,l){var o=!0,e=n.component;return"load"===t&&(o=!1!==e.onImgLoad(n.parent.context.$implicit)&&o),"error"===t&&(o=!1!==e.onImgError(n.parent.context.$implicit)&&o),o},null,null))],null,function(n,t){n(t,0,0,o.pb(1,"http://projects.niklenburg.com/",t.parent.context.$implicit.title,"/img/logo.png"))})}function g(n){return o.Db(0,[(n()(),o.nb(0,0,null,null,1,"span",[],null,null,null,null,null)),(n()(),o.Bb(1,null,["",""]))],null,function(n,t){n(t,1,0,t.parent.context.$implicit.title)})}function f(n){return o.Db(0,[(n()(),o.nb(0,0,null,null,6,"li",[],null,null,null,null,null)),(n()(),o.nb(1,0,null,null,5,"div",[["class","item"]],null,null,null,null,null)),(n()(),o.nb(2,0,null,null,4,"a",[["target","_blank"]],[[8,"href",4],[8,"title",0],[2,"light",null],[2,"full",null],[2,"loaded",null]],null,null,null,null)),(n()(),o.cb(16777216,null,null,1,null,p)),o.mb(4,16384,null,0,c.k,[o.M,o.J],{ngIf:[0,"ngIf"]},null),(n()(),o.cb(16777216,null,null,1,null,g)),o.mb(6,16384,null,0,c.k,[o.M,o.J],{ngIf:[0,"ngIf"]},null)],function(n,t){n(t,4,0,!t.context.$implicit.fail),n(t,6,0,t.context.$implicit.fail)},function(n,t){n(t,2,0,o.pb(1,"http://projects.niklenburg.com/",t.context.$implicit.title,"/"),o.pb(1,"projects.niklenburg.com/",t.context.$implicit.title,""),t.context.$implicit.light,t.context.$implicit.full,t.context.$implicit.loaded||t.context.$implicit.fail)})}function b(n){return o.Db(0,[(n()(),o.nb(0,0,null,null,2,"ul",[["class","projects"]],null,null,null,null,null)),(n()(),o.cb(16777216,null,null,1,null,f)),o.mb(2,278528,null,0,c.j,[o.M,o.J,o.q],{ngForOf:[0,"ngForOf"]},null)],function(n,t){n(t,2,0,t.component.projects)},null)}function m(n){return o.Db(0,[(n()(),o.nb(0,0,null,null,1,"app-portfolio",[],null,null,null,b,s)),o.mb(1,114688,null,0,u,[a],null,null)],function(n,t){n(t,1,0)},null)}var d=o.jb("app-portfolio",u,m,{},{},[]),M=l("iInd");class O{}l.d(t,"PortfolioModuleNgFactory",function(){return P});var P=o.kb(e,[],function(n){return o.ub([o.vb(512,o.j,o.X,[[8,[i.a,d]],[3,o.j],o.v]),o.vb(4608,c.m,c.l,[o.s,[2,c.s]]),o.vb(1073742336,c.c,c.c,[]),o.vb(1073742336,M.q,M.q,[[2,M.w],[2,M.o]]),o.vb(1073742336,O,O,[]),o.vb(1073742336,e,e,[]),o.vb(1024,M.m,function(){return[[{path:"",component:u}]]},[])])})}}]);