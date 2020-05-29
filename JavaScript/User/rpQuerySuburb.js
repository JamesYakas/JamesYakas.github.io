Backendless.serverURL="https://api.backendless.com",Backendless.initApp("073669A8-CCB7-2AED-FFEC-841A4CE5F400","FAFDE171-5308-49CF-9980-AA89E4F28F0C");var suburb=localStorage.getItem("usersSuburb"),initialSearch=!0,_typeOfSpecial=["Drink"],masterEstablishments=[],masterMarkers=[],filteredMarkers=[],useFilteredMarkers=!1,lat=0,lng=0,state="filtered-list";function pageOnLoad(){if(!initialSearch){useFilteredMarkers=!1,$("#daysOfWeekFilter").val("");var e=document.getElementById("daysOfWeekFilter");e.options[0]=new Option("Any",""),e.options[0].disabled=!0,document.getElementById("timePeriodStartFilter").selectedIndex="0",document.getElementById("timePeriodEndFilter").selectedIndex="16",$("#specialCategoryFilter").val("");var t=document.getElementById("specialCategoryFilter");t.options[0]=new Option("Any",""),t.options[0].disabled=!0;l=0;var s=Backendless.DataQueryBuilder.create();return s.setRelated(["establishmentSpecials"]),s.setWhereClause("Suburb = '"+suburb+"'"),Backendless.Data.of("Establishment").find(s).then(function(e){document.getElementById("rpList").innerHTML="";for(var t=["Drink"],s=e.reduce((e,s)=>{const a=s.establishmentSpecials.filter(e=>t.includes(e.Type_Of_Special));return a.length>0?[...e,{...s,establishmentSpecials:a}]:e},[]),a=0;a<s.length;a++)if(s[a].establishmentSpecials.length>0){sortEstablishmentSpecials(s,a),document.getElementById("rpList").innerHTML+='<div class="establishment-wrapper"  data-id="'+s[a].objectId+'" id="viewEstablishmentPage"><img class="rpImage" src="'+s[a].Image+'"><br><span class="est-name">'+s[a].Name+'</span><hr class="est-name-underline"></div>',document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\'  class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><tbody id="myTable'+s[a].objectId+'"></tbody></table></div>';for(var i=0;i<s[a].establishmentSpecials.length;i++){var n=document.getElementById("myTable"+s[a].objectId);addRowTopSpecial(n,'<img class="cocktail-small-img" src="images/cocktail-yellow.png">'+s[a].establishmentSpecials[i].Description,s[a].establishmentSpecials[i].objectId),addRowBottom(n,'<img class="time-img" src="images/clock-small.png"><div class="time-period">'+tConvert(s[a].establishmentSpecials[i].Start_Time)+" - "+tConvert(s[a].establishmentSpecials[i].End_Time)+"</div>",'<img class="calander-img" src="images/calander-small.png"><div class="daysAbbreviated">'+daysAbbreviated(s,a,i)+"</div>",s[a].establishmentSpecials[i].objectId),l++}document.getElementById("rpList").innerHTML+='<div class="est-line-break"></div>'}var r=document.getElementById("cusineTypeFilter");$("#cusineTypeFilter").empty();var o=[],c=0,d=e.length,m=0;for(c=0;c<d;c++){var p=!1;for(m=0;m<e[c].establishmentSpecials.length;m++)if("Food"==e[c].establishmentSpecials[m].Type_Of_Special){p=!0;break}if(1==p){if(e[c].Cuisine_Type.includes(", "))for(var b=e[c].Cuisine_Type.split(", "),g=0,u=b.length;g<u;g++)o.push(b[g]);else o.push(e[c].Cuisine_Type);0}}var h=o.filter(onlyUnique);h.sort();var y,f=1,S=0,v=h.length;for(S=0;S<v;S++)r.options[0]=new Option("Any",""),r.options[0].disabled=!0,r.options[f]=new Option(h[S],h[S]),f++;drinkFoodVisuals("drink"),_typeOfSpecial=["Drink"],masterEstablishments=e,document.getElementById("rpNumOfSpecialsFound").innerHTML="Found '"+l+"' matching Drink specials",y=e.length>0?e[0].Postcode:"No results",document.getElementById("displaySuburb").innerHTML='<span class="display-suburb">'+suburb+", "+y+"</span>","block"==document.getElementById("rpGoogleMap").style.display&&(document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("rpbtnList").style.backgroundColor="#E63594",document.getElementById("rpBtnMap").style.backgroundColor="#d9d9d9"),document.getElementById("cusineTypeFilter").disabled=!0,$("select").formSelect(),console.log("1. Populate list")}).then(()=>{var e,t=suburb;return e=null!=masterEstablishments[0]?"https://maps.googleapis.com/maps/api/geocode/json?components=country:"+masterEstablishments[0].Country:"https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU",axios.get(e,{params:{address:t,key:"AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI"}}).then(function(e){lat=e.data.results[0].geometry.location.lat,lng=e.data.results[0].geometry.location.lng,console.log("2. Get suburb coords")}).then(()=>{console.log("3. Start map markers creation");for(var e=0;e<masterEstablishments.length;e++)if(masterEstablishments[e].establishmentSpecials.length>0){console.log("4.1 Start creating a single marker");masterMarkers.push({coords:{lat:masterEstablishments[e].Location.y,lng:masterEstablishments[e].Location.x},iconImage:"images/restaurant.png",content:masterEstablishments[e].Name+"<br>"+masterEstablishments[e].Cuisine_Type+"<br>"+masterEstablishments[e].Address+"<br>",Name:masterEstablishments[e].Name,Address:masterEstablishments[e].Address,Cuisine_Type:masterEstablishments[e].Cuisine_Type,establishmentSpecials:masterEstablishments[e].establishmentSpecials,objectId:masterEstablishments[e].objectId}),console.log("4.2 Finish creating a single marker")}console.log("5. Finish map markers creation")}).then(()=>{console.log("6. Initialize map")})}).catch(function(e){})}var a=sessionStorage.getItem("suburbResults");a=JSON.parse(a),document.getElementById("rpList").innerHTML="";for(var l=0,i=["Drink"],n=a.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>i.includes(e.Type_Of_Special));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]),r=0;r<n.length;r++)if(n[r].establishmentSpecials.length>0){sortEstablishmentSpecials(n,r),document.getElementById("rpList").innerHTML+='<div class="establishment-wrapper"  data-id="'+n[r].objectId+'" id="viewEstablishmentPage"><img class="rpImage" src="'+n[r].Image+'"><br><span class="est-name">'+n[r].Name+'</span><hr class="est-name-underline"></div>',document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\' class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><tbody id="myTable'+n[r].objectId+'"></tbody></table></div>';for(var o=0;o<n[r].establishmentSpecials.length;o++){var c=document.getElementById("myTable"+n[r].objectId);addRowTopSpecial(c,'<img class="cocktail-small-img" src="images/cocktail-yellow.png">'+n[r].establishmentSpecials[o].Description,n[r].establishmentSpecials[o].objectId),addRowBottom(c,'<img class="time-img" src="images/clock-small.png"><div class="time-period">'+tConvert(n[r].establishmentSpecials[o].Start_Time)+" - "+tConvert(n[r].establishmentSpecials[o].End_Time)+"</div>",'<img class="calander-img" src="images/calander-small.png"><div class="daysAbbreviated">'+daysAbbreviated(n,r,o)+"</div>",n[r].establishmentSpecials[o].objectId),l++}document.getElementById("rpList").innerHTML+='<div class="est-line-break"></div>'}var d=document.getElementById("cusineTypeFilter");$("#cusineTypeFilter").empty();var m=[],p=0,b=a.length,g=0;for(p=0;p<b;p++){var u=!1;for(g=0;g<a[p].establishmentSpecials.length;g++)if("Food"==a[p].establishmentSpecials[g].Type_Of_Special){u=!0;break}if(1==u){if(a[p].Cuisine_Type.includes(", "))for(var h=a[p].Cuisine_Type.split(", "),y=0,f=h.length;y<f;y++)m.push(h[y]);else m.push(a[p].Cuisine_Type);0}}var S=m.filter(onlyUnique);S.sort();var v,k=1,E=0,I=S.length;for(E=0;E<I;E++)d.options[0]=new Option("Any",""),d.options[0].disabled=!0,d.options[k]=new Option(S[E],S[E]),k++;masterEstablishments=a,v=n.length>0?n[0].Postcode:"No results",document.getElementById("displaySuburb").innerHTML='<span class="display-suburb">'+suburb+", "+v+"</span>",console.log("1. Populate list"),document.getElementById("rpNumOfSpecialsFound").innerHTML="Found '"+l+"' matching Drink specials",document.getElementById("rpbtnList").style.backgroundColor="#E63594";var T=document.querySelectorAll("select");if(M.FormSelect.init(T),console.log("State: "+state),initialSearch){var B,_=suburb;return B=null!=masterEstablishments[0]?"https://maps.googleapis.com/maps/api/geocode/json?components=country:"+masterEstablishments[0].Country:"https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU",axios.get(B,{params:{address:_,key:"AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI"}}).then(function(e){lat=e.data.results[0].geometry.location.lat,lng=e.data.results[0].geometry.location.lng,console.log("2. Get suburb coords")}).then(()=>{console.log("3. Start map markers creation");for(var e=0;e<masterEstablishments.length;e++){if(masterEstablishments[e].establishmentSpecials.length>0){var t,s=0,a=masterEstablishments[e].establishmentSpecials.length;for(s=0;s<a;s++)"Drink"==masterEstablishments[e].establishmentSpecials[s].Type_Of_Special&&(t+=masterEstablishments[e].establishmentSpecials[s].Description+"<br>");console.log("4.1 Start creating a single marker");masterMarkers.push({coords:{lat:masterEstablishments[e].Location.coordinates[1],lng:masterEstablishments[e].Location.coordinates[0]},iconImage:"images/restaurant.png",content:masterEstablishments[e].Name+"<br>"+masterEstablishments[e].Cuisine_Type+"<br>"+masterEstablishments[e].Address+"<br>"+t,Name:masterEstablishments[e].Name,Address:masterEstablishments[e].Address,Cuisine_Type:masterEstablishments[e].Cuisine_Type,establishmentSpecials:masterEstablishments[e].establishmentSpecials,objectId:masterEstablishments[e].objectId}),console.log("4.2 Finish creating a single marker")}t=""}console.log("5. Finish map markers creation")}).catch(function(e){}).then(()=>{console.log("6. Initialize map")})}}function initMap(){console.log("7. Map Initialization started");var e={zoom:13,center:{lat:lat,lng:lng}};console.log("8. Start print markers"),console.log("9. End print markers");var t,s=new google.maps.Map(document.getElementById("rpGoogleMap"),e);if(console.log("Running first time"),console.log("10. Map created"),console.log("10.1 clear markers"),console.log(useFilteredMarkers),0==useFilteredMarkers)for(var a=0;a<masterMarkers.length;a++)l(masterMarkers[a]);else for(a=0;a<filteredMarkers.length;a++)l(filteredMarkers[a]);function l(e){var a=new google.maps.Marker({position:e.coords,map:s,Name:e.Name,Address:e.Address,Cuisine_Type:e.Cusine_Type,establishmentSpecials:e.establishmentSpecials,objectId:e.objectId});if(e.iconImage&&a.setIcon(e.iconImage),e.content){var l=new google.maps.InfoWindow({content:e.content});a.addListener("click",function(){t&&t.close(),l.open(s,a),t=l})}}console.log("11. Markers added")}function setMapOnAll(e){for(var t=0;t<filteredMarkers.length;t++)filteredMarkers[t].setMap(e)}function clearMarkers(){setMapOnAll(null),filteredMarkers=[]}function deleteMarkers(){for(var e=0;e<filteredMarkers.length;e++)filteredMarkers[e].setMap(null);filteredMarkers=[]}function daysOfWeekFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function timePeriodFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function specialCategoryFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function cusineTypeFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function establishmentTypeFilter(){state="filtered-list",console.log("State: "+state),applyFilters()}function typeOfSpecialFilterDrink(){drinkFoodVisuals("drink"),document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("cusineTypeFilter").disabled=!0,$("select").formSelect(),_typeOfSpecial=["Drink"],state="filtered-list",console.log("State: "+state),applyFilters()}function typeOfSpecialFilterFood(){drinkFoodVisuals("food"),document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("cusineTypeFilter").disabled=!1,$("select").formSelect(),_typeOfSpecial=["Food"],state="filtered-list",console.log("State: "+state),applyFilters()}function applyFilters(){for(var e=$("#daysOfWeekFilter").val(),t=$("#timePeriodStartFilter").val(),s=$("#timePeriodEndFilter").val(),a=$("#specialCategoryFilter").val(),l=$("#cusineTypeFilter").val(),i=_typeOfSpecial,n=masterEstablishments,r=[],o=0;o<n.length;o++)for(var c=0;c<n[o].establishmentSpecials.length;c++){var d=[];if(n[o].establishmentSpecials[c].Days_Of_Week.includes(", "))for(var m=n[o].establishmentSpecials[c].Days_Of_Week.split(", "),p=0,b=m.length;p<b;p++)d.push(m[p]);else d.push(n[o].establishmentSpecials[c].Days_Of_Week);for(var g=0;g<e.length;g++)1==d.includes(e[g])&&r.push(n[o].establishmentSpecials[c].objectId)}e.length>=1&&r.length>=0&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>r.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var u=60*t.substring(0,2)+ +t.substring(3,5),h=60*s.substring(0,2)+ +s.substring(3,5),y=[];for(o=0;o<n.length;o++)for(c=0;c<n[o].establishmentSpecials.length;c++){var f=n[o].establishmentSpecials[c].Start_Time,S=n[o].establishmentSpecials[c].End_Time;f=60*f.substring(0,2)+ +f.substring(3,5),(S=60*S.substring(0,2)+ +S.substring(3,5))>u&&f<h&&u<h&&y.push(n[o].establishmentSpecials[c].objectId)}if(y.length>=0&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>y.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),a.length>=1&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>a.includes(e.Category));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),"Food"==_typeOfSpecial[0]){var v=[];for(o=0;o<n.length;o++){var k=[];if(n[o].Cuisine_Type.includes(", ")){var E=n[o].Cuisine_Type.split(", ");for(p=0,b=E.length;p<b;p++)k.push(E[p])}else k.push(n[o].Cuisine_Type);for(g=0;g<l.length;g++)1==k.includes(l[g])&&v.push(n[o].objectId)}l.length>=1&&(n=n.filter(e=>v.includes(e.objectId)))}i.length>=1&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>i.includes(e.Type_Of_Special));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var I=0;if("establishment-page-map"!=state){document.getElementById("rpList").innerHTML="";for(o=0;o<n.length;o++){sortEstablishmentSpecials(n,o),document.getElementById("rpList").innerHTML+='<div class="establishment-wrapper"  data-id="'+n[o].objectId+'" id="viewEstablishmentPage"><img class="rpImage" src="'+n[o].Image+'"><br><span class="est-name">'+n[o].Name+'</span><hr class="est-name-underline"></div>',document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\' class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><tbody id="myTable'+n[o].objectId+'"></tbody></table></div>';for(c=0;c<n[o].establishmentSpecials.length;c++){var M=document.getElementById("myTable"+n[o].objectId);addRowTopSpecial(M,("Drink"==_typeOfSpecial[0]?'<img class="cocktail-small-img" src="images/cocktail-yellow.png">':'<img class="hamburger-small-img" src="images/burger-black.png">')+n[o].establishmentSpecials[c].Description,n[o].establishmentSpecials[c].objectId),addRowBottom(M,'<img class="time-img" src="images/clock-small.png"><div class="time-period">'+tConvert(n[o].establishmentSpecials[c].Start_Time)+" - "+tConvert(n[o].establishmentSpecials[c].End_Time)+"</div>",'<img class="calander-img" src="images/calander-small.png"><div class="daysAbbreviated">'+daysAbbreviated(n,o,c)+"</div>",n[o].establishmentSpecials[c].objectId),I++}document.getElementById("rpList").innerHTML+='<div class="est-line-break"></div>'}document.getElementById("rpNumOfSpecialsFound").innerHTML="Found '"+I+"' matching "+_typeOfSpecial[0]+" specials"}if("block"==document.getElementById("rpGoogleMap").style.display){console.log("Map displayed"),useFilteredMarkers=!0,filteredMarkers=masterMarkers;var T=[];for(o=0;o<filteredMarkers.length;o++)for(c=0;c<filteredMarkers[o].establishmentSpecials.length;c++){var B=[];if(filteredMarkers[o].establishmentSpecials[c].Days_Of_Week.includes(", ")){var _=filteredMarkers[o].establishmentSpecials[c].Days_Of_Week.split(", ");for(p=0,b=_.length;p<b;p++)B.push(_[p])}else B.push(filteredMarkers[o].establishmentSpecials[c].Days_Of_Week);for(g=0;g<e.length;g++)1==B.includes(e[g])&&T.push(filteredMarkers[o].establishmentSpecials[c].objectId)}e.length>=1&&T.length>=0&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>T.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var C=60*t.substring(0,2)+ +t.substring(3,5),F=60*s.substring(0,2)+ +s.substring(3,5),L=[];for(o=0;o<filteredMarkers.length;o++)for(c=0;c<filteredMarkers[o].establishmentSpecials.length;c++){var O=filteredMarkers[o].establishmentSpecials[c].Start_Time,w=filteredMarkers[o].establishmentSpecials[c].End_Time;O=60*O.substring(0,2)+ +O.substring(3,5),(w=60*w.substring(0,2)+ +w.substring(3,5))>C&&O<F&&L.push(filteredMarkers[o].establishmentSpecials[c].objectId)}if(L.length>=0&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>L.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),a.length>=1&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>a.includes(e.Category));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),"Food"==_typeOfSpecial[0]){var j=[];for(o=0;o<filteredMarkers.length;o++){var A=[];if(filteredMarkers[o].Cuisine_Type.includes(", ")){var D=filteredMarkers[o].Cuisine_Type.split(", ");for(p=0,b=D.length;p<b;p++)A.push(D[p])}else A.push(filteredMarkers[o].Cuisine_Type);for(g=0;g<l.length;g++)1==A.includes(l[g])&&j.push(filteredMarkers[o].objectId)}l.length>=1&&(filteredMarkers=filteredMarkers.filter(e=>j.includes(e.objectId)))}i.length>=1&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>i.includes(e.Type_Of_Special));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var H=0,N=filteredMarkers.length;for(H=0;H<N;H++){var R="<b>"+filteredMarkers[H].Name+"</b><br>"+filteredMarkers[H].Cuisine_Type+"<br>"+filteredMarkers[H].Address+"<br><br>";sortEstablishmentSpecials(filteredMarkers,H);var W="",G=0,P=filteredMarkers[H].establishmentSpecials.length;for(G=0;G<P;G++)W+=filteredMarkers[H].establishmentSpecials[G].Description+"<br>"+tConvert(filteredMarkers[H].establishmentSpecials[G].Start_Time)+" - "+tConvert(filteredMarkers[H].establishmentSpecials[G].End_Time)+'<br><span class="dowMarker">'+daysAbbreviated(filteredMarkers,H,G)+"</span><br><br>";filteredMarkers[H].content=R+W}if("establishment-page-map"==state){console.log("State: Display establishment map marker");var z=function(e,t,s){for(var a=0,l=null;a<s&&-1!==l;)l=e.indexOf(t,l+1),a++;return l}((filteredMarkers=filteredMarkers.filter(e=>e.content.includes(document.getElementById("rpNumOfSpecialsFound").innerHTML)))[0].content,"<br>",3);filteredMarkers[0].content=[filteredMarkers[0].content.slice(0,z),"<br><br><b><i>Specials matching your search criteria</i></b>",filteredMarkers[0].content.slice(z)].join("");for(var U=[],x=0,V=filteredMarkers[0].establishmentSpecials.length;x<V;x++)U.push(filteredMarkers[0].establishmentSpecials[x].objectId);var q=masterMarkers,X=(q=q.filter(e=>e.content.includes(document.getElementById("rpNumOfSpecialsFound").innerHTML)))[0].establishmentSpecials.filter(e=>!U.includes(e.objectId));sortSpecials(X);var J="",Q=0,K=X.length;if(K>0){for(;Q<K;Q++)J+=X[Q].Description+"<br>"+tConvert(X[Q].Start_Time)+" - "+tConvert(X[Q].End_Time)+'<br><span class="dowMarker">'+daysAbbreviated(X,void 0,Q)+"</span><br><br>";filteredMarkers[0].content+="<b><i>Other specials on offer</i></b><br><br>"+J}}initMap()}document.getElementById("rpbtnList").style.backgroundColor="#E63594",document.getElementById("rpBtnMap").style.backgroundColor="#d9d9d9"}function btnShowList(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block","Drink"!=_typeOfSpecial[0]&&(document.getElementById("cusineTypeFilter").disabled=!1,$("select").formSelect()),"establishment-page-map"==state?(state="establishment-page",console.log("State: "+state)):"establishment-page"==state?(state="filtered-list",console.log("State: "+state),applyFilters()):(state="filtered-list")&&console.log("State: "+state),document.getElementById("rpbtnList").style.backgroundColor="#E63594",document.getElementById("rpBtnMap").style.backgroundColor="#d9d9d9"}function btnShowMap(){document.getElementById("rpList").style.display="none",document.getElementById("rpGoogleMap").style.display="block","filtered-list"==state&&(state="filtered-list-map",console.log("State: "+state)),"establishment-page"==state&&(state="establishment-page-map",console.log("State: "+state)),applyFilters(),document.getElementById("rpbtnList").style.backgroundColor="#d9d9d9",document.getElementById("rpBtnMap").style.backgroundColor="#E63594"}function onlyUnique(e,t,s){return s.indexOf(e)===t}function addCellTopSpecial(e,t){var s=document.createElement("td");s.innerHTML=t,s.colSpan=2,s.classList.add("cellTopSpecialCSS"),e.appendChild(s)}function addRowTopSpecial(e,t,s){var a=document.createElement("tr");a.id=s,addCellTopSpecial(a,t),e.appendChild(a)}function addCellTop(e,t){var s=document.createElement("td");s.innerHTML=t,s.colSpan=2,s.classList.add("cellTopCSS"),e.appendChild(s)}function addRowTop(e,t,s){var a=document.createElement("tr");a.id=s,addCellTop(a,t),e.appendChild(a)}function addCellBottom(e,t){var s=document.createElement("td");s.innerHTML=t,s.classList.add("cellBottomCSS"),e.appendChild(s)}function addRowBottom(e,t,s,a){var l=document.createElement("tr");l.id=a,addCellBottom(l,t),addCellBottom(l,s),e.appendChild(l)}function research(){initialSearch=!1,suburb=document.getElementById("researchInput").value,localStorage.setItem("usersSuburb",suburb),masterEstablishments=[],masterMarkers=[],state="filtered-list",console.log("State: "+state),pageOnLoad()}function tConvert(e){return(e=e.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/)||[e]).length>1&&((e=e.slice(1))[5]=+e[0]<12?" AM":" PM",e[0]=+e[0]%12||12),e.join("")}function setMapOnAll(e){for(var t=0;t<filteredMarkers.length;t++)console.log(filteredMarkers[t].coords.lat),filteredMarkers.setMap(e)}function drinkFoodVisuals(e){"food"==e?(document.getElementById("tab-food-img").src="images/burger-yellow.png",document.getElementById("tabFood").style.backgroundColor="#E63594",document.getElementById("tab-drink-img").src="images/cocktail-white.png",document.getElementById("tabDrink").style.backgroundColor="#888F91"):"drink"==e&&(document.getElementById("tab-food-img").src="images/burger-white.png",document.getElementById("tabFood").style.backgroundColor="#888F91",document.getElementById("tab-drink-img").src="images/cocktail-yellow.png",document.getElementById("tabDrink").style.backgroundColor="#E63594")}function sortEstablishmentSpecials(e,t){e[t].establishmentSpecials.sort(function(e,t){return e.Start_Time.localeCompare(t.Start_Time)||e.End_Time.localeCompare(t.End_Time)||e.Description.localeCompare(t.Description)})}function sortSpecials(e){e.sort(function(e,t){return e.Start_Time.localeCompare(t.Start_Time)||e.End_Time.localeCompare(t.End_Time)||e.Description.localeCompare(t.Description)})}function daysAbbreviated(e,t,s){var a=[];a=void 0===t?e[s].Days_Of_Week.split(", "):e[t].establishmentSpecials[s].Days_Of_Week.split(", ");for(var l="M",i="T",n="W",r="T",o="F",c="S",d="S",m=0;m<a.length;m++)"Monday"==a[m]?l=l.fontcolor("#E63594"):"Tuesday"==a[m]?i=i.fontcolor("#E63594"):"Wednesday"==a[m]?n=n.fontcolor("#E63594"):"Thursday"==a[m]?r=r.fontcolor("#E63594"):"Friday"==a[m]?o=o.fontcolor("#E63594"):"Saturday"==a[m]?c=c.fontcolor("#E63594"):"Sunday"==a[m]&&(d=d.fontcolor("#E63594"));return l+i+n+r+o+c+d}document.addEventListener("DOMContentLoaded",function(){pageOnLoad()}),$(document).on("click","#viewEstablishmentPage",function(){document.getElementById("nav-bar").scrollIntoView();for(var e=$(this).attr("data-id"),t=document.getElementById("myTable"+e),s=0,a=masterEstablishments.length;s<a;s++)if(e==masterEstablishments[s].objectId){document.getElementById("rpList").innerHTML='<div class="establishment-wrapper"><img class="rpImage" src="'+masterEstablishments[s].Image+'"><br><span class="est-name">'+masterEstablishments[s].Name+'</span><hr class="est-name-underline"><br><br><br><div class="est-details"><div class="est-detail">'+masterEstablishments[s].Cuisine_Type+"</div>"+masterEstablishments[s].Address+"<br>"+masterEstablishments[s].Suburb+", "+masterEstablishments[s].Postcode+"<br>Google buisness link<br>Website link<br></div></div>",document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\' class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><tbody id="myTable'+s+'"></tbody></table></div>';for(var l=[],i=0,n=t.rows.length;i<n;i++)l.push(t.rows[i].id),i++;var r=[],o=masterEstablishments[s],c=[],d=0,m=o.establishmentSpecials.length;for(d=0;d<m;d++)c.push(o.establishmentSpecials[d]);var p=c,b=[];sortSpecials(b=c.filter(e=>!l.includes(e.objectId))),sortSpecials(r=p.filter(e=>l.includes(e.objectId)));for(var g=0,u=b.length;g<u;g++)b[g].otherSpecials=void 0;b.length>0&&(b[0].otherSpecials="yes");var h;h=r.concat(b);for(var y=0;y<h.length;y++){var f,S=document.getElementById("myTable"+s);f="Drink"==h[y].Type_Of_Special?'<img class="cocktail-small-img" src="images/cocktail-yellow.png">':'<img class="hamburger-small-img" src="images/burger-black.png">',0==y?(addRowTop(S,"Specials matching your search criteria",h[y].objectId),addRowTopSpecial(S,f+h[y].Description,h[y].objectId),addRowBottom(S,'<img class="time-img" src="images/clock-small.png"><div class="time-period">'+tConvert(h[y].Start_Time)+" - "+tConvert(h[y].End_Time)+"</div>",'<img class="calander-img" src="images/calander-small.png"><div class="daysAbbreviated">'+daysAbbreviated(h,void 0,y)+"</div>",h[y].objectId)):"yes"==h[y].otherSpecials?(console.log(h[y].Description),addRowTop(S,"Other specials on offer",h[y].objectId),addRowTopSpecial(S,f+h[y].Description,h[y].objectId),addRowBottom(S,'<img class="time-img" src="images/clock-small.png"><div class="time-period">'+tConvert(h[y].Start_Time)+" - "+tConvert(h[y].End_Time)+"</div>",'<img class="calander-img" src="images/calander-small.png"><div class="daysAbbreviated">'+daysAbbreviated(h,void 0,y)+"</div>",h[y].objectId)):(addRowTopSpecial(S,f+h[y].Description,h[y].objectId),addRowBottom(S,'<img class="time-img" src="images/clock-small.png"><div class="time-period">'+tConvert(h[y].Start_Time)+" - "+tConvert(h[y].End_Time)+"</div>",'<img class="calander-img" src="images/calander-small.png"><div class="daysAbbreviated">'+daysAbbreviated(h,void 0,y)+"</div>",h[y].objectId))}document.getElementById("rpNumOfSpecialsFound").innerHTML=masterEstablishments[s].Name,document.getElementById("rpList").innerHTML+='<div class="est-line-break"></div>'}state="establishment-page",console.log("State: "+state)});