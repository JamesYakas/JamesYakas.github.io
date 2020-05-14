Backendless.serverURL="https://api.backendless.com",Backendless.initApp("073669A8-CCB7-2AED-FFEC-841A4CE5F400","FAFDE171-5308-49CF-9980-AA89E4F28F0C");var suburb=localStorage.getItem("usersSuburb"),initialSearch=!0,_typeOfSpecial=["Drink"],masterEstablishments=[],masterMarkers=[],filteredMarkers=[],useFilteredMarkers=!1,lat=0,lng=0,state="filtered-list";function pageOnLoad(){var e=document.querySelectorAll(".collapsible");if(M.Collapsible.init(e),!initialSearch){useFilteredMarkers=!1,document.getElementById("tabDrink").classList.add("active"),$("#daysOfWeekFilter").val(""),document.getElementById("timePeriodStartFilter").selectedIndex="0",document.getElementById("timePeriodEndFilter").selectedIndex="16",$("#specialCategoryFilter").val("");for(o=0,a={},i=["Breakfast Special","Lunch Special","Dinner Special","Happy Hour"],n=0;n<i.length;n++)a[i[n]]=n;var t=Backendless.DataQueryBuilder.create();return t.setRelated(["establishmentSpecials"]),t.setWhereClause("Suburb = '"+suburb+"'"),Backendless.Data.of("Establishment").find(t).then(function(e){document.getElementById("rpList").innerHTML="";for(var t=["Drink"],s=e.reduce((e,s)=>{const l=s.establishmentSpecials.filter(e=>t.includes(e.Type_Of_Special));return l.length>0?[...e,{...s,establishmentSpecials:l}]:e},[]),l=0;l<s.length;l++)if(console.log(s),s[l].establishmentSpecials.length>0){s[l].establishmentSpecials.sort(function(e,t){return a[e.Category]-a[t.Category]||e.Start_Time.localeCompare(t.Start_Time)}),document.getElementById("rpList").innerHTML+='<div class="establishment-wrapper"  data-id="'+s[l].objectId+'" id="viewEstablishmentPage"><img class="rpImage" src="'+s[l].Image+'"><br><b>'+s[l].Name+"</b><br>"+s[l].Cuisine_Type+"<br>"+s[l].Address+"<br><br></div>",document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\'  class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><thead><tr><th class="tbl-special-th">Special</th><th class="tbl-days-th">Days</th></tr></thead><tbody id="myTable'+s[l].objectId+'"></tbody></table></div>';for(var i=0;i<s[l].establishmentSpecials.length;i++){var n,r=document.getElementById("myTable"+s[l].objectId);n=s[l].establishmentSpecials[i].Days_Of_Week.split(", "),console.log(n);for(var c="M ",d="T ",p="W ",m="T ",b="F ",g="S ",u="S",h=0;h<n.length;h++)"Monday"==n[h]?c=c.fontcolor("#FF3399"):"Tuesday"==n[h]?d=d.fontcolor("#FF3399"):"Wednesday"==n[h]?p=p.fontcolor("#FF3399"):"Thursday"==n[h]?m=m.fontcolor("#FF3399"):"Friday"==n[h]?b=b.fontcolor("#FF3399"):"Saturday"==n[h]?g=g.fontcolor("#FF3399"):"Sunday"==n[h]&&(u=u.fontcolor("#FF3399"));addRow(r,'<div class="category">'+s[l].establishmentSpecials[i].Category.replace("Special","")+"</div>",'<div class="time-period">'+tConvert(s[l].establishmentSpecials[i].Start_Time)+" - "+tConvert(s[l].establishmentSpecials[i].End_Time)+"</div>",s[l].establishmentSpecials[i].objectId),addRowBottom(r,s[l].establishmentSpecials[i].Description,'<div class="daysAbbreviated">'+c+d+p+m+b+g+u+"</div>",s[l].establishmentSpecials[i].objectId),o++}document.getElementById("rpList").innerHTML+="<br>"}var y=document.getElementById("cusineTypeFilter");$("#cusineTypeFilter").empty();var f=0,S=e.length,v=[],I=0;for(f=0;f<S;f++){var k=!1;for(I=0;I<e[f].establishmentSpecials.length;I++)if("Food"==e[f].establishmentSpecials[I].Type_Of_Special){console.log(e[f].Name),k=!0;break}if(1==k){if(e[f].Cuisine_Type.includes(", ")){var E=e[f].Cuisine_Type;console.log(E);for(var F=E.split(", "),T=0,C=F.length;T<C;T++)v.push(F[T]);console.log(F)}else v.push(e[f].Cuisine_Type);0}}var B=v.filter(onlyUnique);B.sort();var _=1,L=0,O=B.length;for(L=0;L<O;L++)y.options[0]=new Option("Any",""),y.options[0].disabled=!0,y.options[_]=new Option(B[L],B[L]),_++;var D,j=document.querySelectorAll("#foodDrink");M.Tabs.init(j,{duration:100}),document.getElementById("tabDrink").classList.add("active"),_typeOfSpecial=["Drink"],masterEstablishments=e,console.log(e),document.getElementById("rpNumOfSpecialsFound").innerHTML="Found '"+o+"' matching Drink specials",D=e.length>0?e[0].Postcode:"No results",document.getElementById("rpDisplaySuburb").innerHTML=suburb.fontsize(6)+" Specials ".fontsize(6)+"- "+D,"block"==document.getElementById("rpGoogleMap").style.display&&(document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("rpbtnList").style.backgroundColor="#22aa1e",document.getElementById("rpBtnMap").style.backgroundColor="lightgray"),document.getElementById("cusineTypeFilter").disabled=!0,console.log("1. Populate list")}).then(()=>{var e=suburb;return axios.get("https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU",{params:{address:e,key:"AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI"}}).then(function(e){lat=e.data.results[0].geometry.location.lat,lng=e.data.results[0].geometry.location.lng,console.log("2. Get suburb coords")}).then(()=>{console.log("3. Start map markers creation");for(var e=0;e<masterEstablishments.length;e++)if(masterEstablishments[e].establishmentSpecials.length>0){console.log("4.1 Start creating a single marker");masterMarkers.push({coords:{lat:masterEstablishments[e].Location.y,lng:masterEstablishments[e].Location.x},iconImage:"images/restaurant.png",content:masterEstablishments[e].Name+"<br>"+masterEstablishments[e].Cuisine_Type+"<br>"+masterEstablishments[e].Address+"<br>",Cuisine_Type:masterEstablishments[e].Cuisine_Type,establishmentSpecials:masterEstablishments[e].establishmentSpecials}),console.log("4.2 Finish creating a single marker")}console.log("5. Finish map markers creation")}).then(()=>{console.log("6. Initialize map")})}).catch(function(e){})}var s=sessionStorage.getItem("suburbResults"),l=JSON.parse(s);document.getElementById("rpList").innerHTML="";for(var a={},i=["Breakfast Special","Lunch Special","Dinner Special","Happy Hour"],n=0;n<i.length;n++)a[i[n]]=n;for(var o=0,r=["Drink"],c=l.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>r.includes(e.Type_Of_Special));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]),n=0;n<c.length;n++)if(c[n].establishmentSpecials.length>0){c[n].establishmentSpecials.sort(function(e,t){return a[e.Category]-a[t.Category]||e.Start_Time.localeCompare(t.Start_Time)}),document.getElementById("rpList").innerHTML+='<div class="establishment-wrapper"  data-id="'+c[n].objectId+'" id="viewEstablishmentPage"><img class="rpImage" src="'+c[n].Image+'"><br><b>'+c[n].Name+"</b><br>"+c[n].Cuisine_Type+"<br>"+c[n].objectId+"<br>"+c[n].Address+"<br><br></div>",document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\' class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><thead><tr><th class="tbl-special-th">Special</th><th class="tbl-days-th">Days</th></tr></thead><tbody id="myTable'+c[n].objectId+'"></tbody></table></div>';for(var d=0;d<c[n].establishmentSpecials.length;d++){var p,m=document.getElementById("myTable"+c[n].objectId);p=c[n].establishmentSpecials[d].Days_Of_Week.split(", ");for(var b="M ",g="T ",u="W ",h="T ",y="F ",f="S ",S="S",v=0;v<p.length;v++)"Monday"==p[v]?b=b.fontcolor("#FF3399"):"Tuesday"==p[v]?g=g.fontcolor("#FF3399"):"Wednesday"==p[v]?u=u.fontcolor("#FF3399"):"Thursday"==p[v]?h=h.fontcolor("#FF3399"):"Friday"==p[v]?y=y.fontcolor("#FF3399"):"Saturday"==p[v]?f=f.fontcolor("#FF3399"):"Sunday"==p[v]&&(S=S.fontcolor("#FF3399"));addRow(m,'<div class="category">'+c[n].establishmentSpecials[d].Category.replace("Special","")+"</div>",'<div class="time-period">'+tConvert(c[n].establishmentSpecials[d].Start_Time)+" - "+tConvert(c[n].establishmentSpecials[d].End_Time)+"</div>",c[n].establishmentSpecials[d].objectId),addRowBottom(m,c[n].establishmentSpecials[d].Description,'<div class="daysAbbreviated">'+b+g+u+h+y+f+S+"</div>",c[n].establishmentSpecials[d].objectId),o++}document.getElementById("rpList").innerHTML+="<br>"}var I=document.getElementById("cusineTypeFilter");$("#cusineTypeFilter").empty();var k=0,E=l.length,F=[],T=0;for(k=0;k<E;k++){var C=!1;for(T=0;T<l[k].establishmentSpecials.length;T++)if("Food"==l[k].establishmentSpecials[T].Type_Of_Special){console.log(l[k].Name),C=!0;break}if(1==C){if(l[k].Cuisine_Type.includes(", ")){var B=l[k].Cuisine_Type;console.log(B);for(var _=B.split(", "),L=0,O=_.length;L<O;L++)F.push(_[L]);console.log(_)}else F.push(l[k].Cuisine_Type);0}}console.log(F);var D=F.filter(onlyUnique);D.sort(),console.log(D);var j=1,w=0,A=D.length;for(w=0;w<A;w++)I.options[0]=new Option("Any",""),I.options[0].disabled=!0,I.options[j]=new Option(D[w],D[w]),j++;var H;e=document.querySelectorAll("#foodDrink");M.Tabs.init(e,{duration:100}),masterEstablishments=l,H=c.length>0?c[0].Postcode:"No results",document.getElementById("rpDisplaySuburb").innerHTML=suburb.fontsize(6)+" Specials - ".fontsize(6)+H,console.log("1. Populate list"),document.getElementById("rpNumOfSpecialsFound").innerHTML="Found '"+o+"' matching Drink specials",document.getElementById("rpbtnList").style.backgroundColor="#22aa1e";e=document.querySelectorAll("select");if(M.FormSelect.init(e),console.log("State: "+state),initialSearch){var R=suburb;return axios.get("https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU",{params:{address:R,key:"AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI"}}).then(function(e){lat=e.data.results[0].geometry.location.lat,lng=e.data.results[0].geometry.location.lng,console.log("2. Get suburb coords")}).then(()=>{console.log("3. Start map markers creation");for(var e=0;e<masterEstablishments.length;e++)if(masterEstablishments[e].establishmentSpecials.length>0){console.log("4.1 Start creating a single marker");masterMarkers.push({coords:{lat:masterEstablishments[e].Location.coordinates[1],lng:masterEstablishments[e].Location.coordinates[0]},iconImage:"images/restaurant.png",content:masterEstablishments[e].Name+"<br>"+masterEstablishments[e].Cuisine_Type+"<br>"+masterEstablishments[e].Address,Cuisine_Type:masterEstablishments[e].Cuisine_Type,establishmentSpecials:masterEstablishments[e].establishmentSpecials,objectId:masterEstablishments[e].objectId}),console.log("4.2 Finish creating a single marker")}console.log("5. Finish map markers creation")}).catch(function(e){}).then(()=>{console.log("6. Initialize map")})}}function initMap(){console.log("7. Map Initialization started");var e={zoom:13,center:{lat:lat,lng:lng}};console.log("8. Start print markers"),console.log("9. End print markers");var t,s=new google.maps.Map(document.getElementById("rpGoogleMap"),e);if(console.log("Running first time"),console.log("10. Map created"),console.log("10.1 clear markers"),console.log(useFilteredMarkers),0==useFilteredMarkers)for(var l=0;l<masterMarkers.length;l++)a(masterMarkers[l]);else for(l=0;l<filteredMarkers.length;l++)a(filteredMarkers[l]);function a(e){var l=new google.maps.Marker({position:e.coords,map:s,Cuisine_Type:e.Cusine_Type,establishmentSpecials:e.establishmentSpecials,objectId:e.objectId});if(e.iconImage&&l.setIcon(e.iconImage),e.content){var a=new google.maps.InfoWindow({content:e.content});l.addListener("click",function(){t&&t.close(),a.open(s,l),t=a})}}console.log("11. Markers added")}function setMapOnAll(e){for(var t=0;t<filteredMarkers.length;t++)filteredMarkers[t].setMap(e)}function clearMarkers(){setMapOnAll(null),filteredMarkers=[]}function deleteMarkers(){for(var e=0;e<filteredMarkers.length;e++)filteredMarkers[e].setMap(null);filteredMarkers=[]}function daysOfWeekFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function timePeriodFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function specialCategoryFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function cusineTypeFilter(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",state="filtered-list",console.log("State: "+state),applyFilters()}function establishmentTypeFilter(){state="filtered-list",console.log("State: "+state),applyFilters()}function typeOfSpecialFilterDrink(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("cusineTypeFilter").disabled=!0,$("select").formSelect(),_typeOfSpecial=["Drink"],state="filtered-list",console.log("State: "+state),applyFilters()}function typeOfSpecialFilterFood(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("cusineTypeFilter").disabled=!1,$("select").formSelect(),_typeOfSpecial=["Food"],state="filtered-list",console.log("State: "+state),applyFilters()}function applyFilters(){var e=$("#daysOfWeekFilter").val(),t=$("#timePeriodStartFilter").val(),s=$("#timePeriodEndFilter").val(),l=$("#specialCategoryFilter").val(),a=$("#cusineTypeFilter").val(),i=_typeOfSpecial;console.log(i);for(var n=masterEstablishments,o=[],r=0;r<n.length;r++)for(var c=0;c<n[r].establishmentSpecials.length;c++){var d=[];if(n[r].establishmentSpecials[c].Days_Of_Week.includes(", "))for(var p=n[r].establishmentSpecials[c].Days_Of_Week.split(", "),m=0,b=p.length;m<b;m++)d.push(p[m]);else d.push(n[r].establishmentSpecials[c].Days_Of_Week);for(var g=0;g<e.length;g++)1==d.includes(e[g])&&o.push(n[r].establishmentSpecials[c].objectId)}console.log(o),e.length>=1&&o.length>=0&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>o.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var u=60*t.substring(0,2)+ +t.substring(3,5),h=60*s.substring(0,2)+ +s.substring(3,5),y=[],f=[];for(r=0;r<n.length;r++)for(c=0;c<n[r].establishmentSpecials.length;c++){var S=n[r].establishmentSpecials[c].Start_Time,v=n[r].establishmentSpecials[c].End_Time;S=60*S.substring(0,2)+ +S.substring(3,5),(v=60*v.substring(0,2)+ +v.substring(3,5))>u&&S<h&&(y.push(n[r].establishmentSpecials[c]),f.push(n[r].establishmentSpecials[c].objectId))}if(f.length>=0&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>f.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),l.length>=1&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>l.includes(e.Category));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),"Food"==_typeOfSpecial[0]){var I=[],k=[];for(r=0;r<n.length;r++){var E=[];if(n[r].Cuisine_Type.includes(", ")){var F=n[r].Cuisine_Type.split(", ");for(m=0,b=F.length;m<b;m++)E.push(F[m])}else E.push(n[r].Cuisine_Type);for(g=0;g<a.length;g++)1==E.includes(a[g])&&(k.push(n[r]),I.push(n[r].objectId))}console.log(k),console.log(a),console.log(I),a.length>=1&&(n=n.filter(e=>I.includes(e.objectId)))}i.length>=1&&(n=n.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>i.includes(e.Type_Of_Special));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var M={},T=["Breakfast Special","Lunch Special","Dinner Special","Happy Hour"];for(r=0;r<T.length;r++)M[T[r]]=r;var C=0;if("establishment-page-map"!=state){document.getElementById("rpList").innerHTML="";for(r=0;r<n.length;r++){n[r].establishmentSpecials.sort(function(e,t){return M[e.Category]-M[t.Category]||e.Start_Time.localeCompare(t.Start_Time)}),document.getElementById("rpList").innerHTML+='<div class="establishment-wrapper"  data-id="'+n[r].objectId+'" id="viewEstablishmentPage"><img class="rpImage" src="'+n[r].Image+'"><br><b>'+n[r].Name+"</b><br>"+n[r].Cuisine_Type+"<br>"+n[r].Address+"<br><br></div>",document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\' class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><thead><tr><th class="tbl-special-th">Special</th><th class="tbl-days-th">Days</th></tr></thead><tbody id="myTable'+n[r].objectId+'"></tbody></table></div>';for(c=0;c<n[r].establishmentSpecials.length;c++){var B,_=document.getElementById("myTable"+n[r].objectId);B=n[r].establishmentSpecials[c].Days_Of_Week.split(", ");for(var L="M ",O="T ",D="W ",j="T ",w="F ",A="S ",H="S",R=0;R<B.length;R++)"Monday"==B[R]?L=L.fontcolor("#FF3399"):"Tuesday"==B[R]?O=O.fontcolor("#FF3399"):"Wednesday"==B[R]?D=D.fontcolor("#FF3399"):"Thursday"==B[R]?j=j.fontcolor("#FF3399"):"Friday"==B[R]?w=w.fontcolor("#FF3399"):"Saturday"==B[R]?A=A.fontcolor("#FF3399"):"Sunday"==B[R]&&(H=H.fontcolor("#FF3399"));addRow(_,'<div class="category">'+n[r].establishmentSpecials[c].Category.replace("Special","")+"</div>",'<div class="time-period">'+tConvert(n[r].establishmentSpecials[c].Start_Time)+" - "+tConvert(n[r].establishmentSpecials[c].End_Time)+"</div>",n[r].establishmentSpecials[c].objectId),n[r].establishmentSpecials[c].Description.length>100?(console.log(n[r].establishmentSpecials[c].Description),addRowBottomCollapsible(_,n[r].establishmentSpecials[c].Description.substring(0,50),'<div class="daysAbbreviated">'+L+O+D+j+w+A+H+"</div>",n[r].establishmentSpecials[c].objectId),addRowBottomCollapsible2(_,n[r].establishmentSpecials[c].Description.substring(50,100),'<div class="daysAbbreviated">'+L+O+D+j+w+A+H+"</div>",n[r].establishmentSpecials[c].objectId)):addRowBottom(_,n[r].establishmentSpecials[c].Description,'<div class="daysAbbreviated">'+L+O+D+j+w+A+H+"</div>",n[r].establishmentSpecials[c].objectId),C++}document.getElementById("rpList").innerHTML+="<br>"}document.getElementById("rpNumOfSpecialsFound").innerHTML="Found '"+C+"' matching "+_typeOfSpecial[0]+" specials"}if("block"==document.getElementById("rpGoogleMap").style.display){if(console.log("Map displayed"),useFilteredMarkers=!0,"establishment-page-map"==state)console.log("State: Display establishment map marker"),filteredMarkers=masterMarkers.filter(e=>e.content.includes(document.getElementById("rpNumOfSpecialsFound").innerHTML));else{filteredMarkers=masterMarkers,console.log(masterEstablishments),console.log(filteredMarkers);var W=[];for(r=0;r<filteredMarkers.length;r++)for(c=0;c<filteredMarkers[r].establishmentSpecials.length;c++){var N=[];if(filteredMarkers[r].establishmentSpecials[c].Days_Of_Week.includes(", ")){var z=filteredMarkers[r].establishmentSpecials[c].Days_Of_Week.split(", ");for(m=0,b=z.length;m<b;m++)N.push(z[m])}else N.push(filteredMarkers[r].establishmentSpecials[c].Days_Of_Week);for(g=0;g<e.length;g++)1==N.includes(e[g])&&W.push(filteredMarkers[r].establishmentSpecials[c].objectId)}console.log(W),e.length>=1&&W.length>=0&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>W.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var G=60*t.substring(0,2)+ +t.substring(3,5),P=60*s.substring(0,2)+ +s.substring(3,5),U=[],q=[];for(r=0;r<filteredMarkers.length;r++)for(c=0;c<filteredMarkers[r].establishmentSpecials.length;c++){var x=filteredMarkers[r].establishmentSpecials[c].Start_Time,X=filteredMarkers[r].establishmentSpecials[c].End_Time;x=60*x.substring(0,2)+ +x.substring(3,5),(X=60*X.substring(0,2)+ +X.substring(3,5))>G&&x<P&&(U.push(filteredMarkers[r].establishmentSpecials[c]),q.push(filteredMarkers[r].establishmentSpecials[c].objectId))}q.length>=0&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>q.includes(e.objectId));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[])),l.length>=1&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>l.includes(e.Category));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]));var J=[],Q=[];for(r=0;r<filteredMarkers.length;r++){var K=[];if(filteredMarkers[r].Cuisine_Type.includes(", ")){var V=filteredMarkers[r].Cuisine_Type.split(", ");for(m=0,b=V.length;m<b;m++)K.push(V[m])}else K.push(filteredMarkers[r].Cuisine_Type);for(g=0;g<a.length;g++)1==K.includes(a[g])&&(Q.push(filteredMarkers[r]),J.push(filteredMarkers[r].objectId))}console.log(Q),console.log(a),console.log(J),a.length>=1&&(filteredMarkers=filteredMarkers.filter(e=>J.includes(e.objectId))),i.length>=1&&(filteredMarkers=filteredMarkers.reduce((e,t)=>{const s=t.establishmentSpecials.filter(e=>i.includes(e.Type_Of_Special));return s.length>0?[...e,{...t,establishmentSpecials:s}]:e},[]))}initMap()}}function btnShowList(){document.getElementById("rpGoogleMap").style.display="none",document.getElementById("rpList").style.display="block",document.getElementById("cusineTypeFilter").disabled=!1,$("select").formSelect(),"establishment-page-map"==state?(state="establishment-page",console.log("State: "+state)):"establishment-page"==state?(state="filtered-list",console.log("State: "+state),applyFilters()):(state="filtered-list")&&console.log("State: "+state),document.getElementById("rpbtnList").style.backgroundColor="#22aa1e",document.getElementById("rpBtnMap").style.backgroundColor="lightgray"}function btnShowMap(){document.getElementById("rpList").style.display="none",document.getElementById("rpGoogleMap").style.display="block","filtered-list"==state&&(state="filtered-list-map",console.log("State: "+state)),"establishment-page"==state&&(state="establishment-page-map",console.log("State: "+state)),applyFilters(),document.getElementById("rpbtnList").style.backgroundColor="lightgray",document.getElementById("rpBtnMap").style.backgroundColor="#22aa1e"}function onlyUnique(e,t,s){return s.indexOf(e)===t}function addCellTop(e,t,s){var l=document.createElement("td");l.innerHTML=t,l.colSpan=2,l.classList.add("cellTopCSS"),e.appendChild(l)}function addCell(e,t,s){var l=document.createElement("td");l.innerHTML=t,l.classList.add("cellCSS"),e.appendChild(l)}function addCellBottom(e,t,s){var l=document.createElement("td");l.innerHTML=t,l.classList.add("cellBottomCSS"),e.appendChild(l)}function addRowTop(e,t,s){var l=document.createElement("tr");l.id=s,addCellTop(l,t),e.appendChild(l)}function addRow(e,t,s,l){var a=document.createElement("tr");a.id=l,addCell(a,t),addCell(a,s),e.appendChild(a)}function addRowBottom(e,t,s,l){var a=document.createElement("tr");a.id=l,addCellBottom(a,t),addCellBottom(a,s),e.appendChild(a)}function addRowBottomCollapsible(e,t,s,l){var a=document.createElement("tr");a.id=l,a.classList.add("header"),addCellBottom(a,t),addCellBottom(a,s),e.appendChild(a)}function addRowBottomCollapsible2(e,t,s,l){var a=document.createElement("tr");a.id=l,a.classList.add("header"),addCellBottom(a,t),addCellBottom(a,s),e.appendChild(a)}function research(){initialSearch=!1,suburb=document.getElementById("rpReSearchInputDiv").value,localStorage.setItem("usersSuburb",suburb),masterEstablishments=[],masterMarkers=[],pageOnLoad()}function tConvert(e){return(e=e.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/)||[e]).length>1&&((e=e.slice(1))[5]=+e[0]<12?" AM":" PM",e[0]=+e[0]%12||12),e.join("")}function testing(){console.log(filteredMarkers),setMapOnAll(null)}function setMapOnAll(e){for(var t=0;t<filteredMarkers.length;t++)console.log(filteredMarkers[t].coords.lat),filteredMarkers.setMap(e)}document.addEventListener("DOMContentLoaded",function(){pageOnLoad()}),$(".header").click(function(){console.log("Hi"),$(this).nextUntil("tr.header").slideToggle(1e3)}),$(document).on("click",".header",function(){console.log("hi"),$(this).slideToggle(0)}),$(document).on("click","#viewEstablishmentPage",function(){var e=$(this).attr("data-id");console.log(masterEstablishments);for(var t=document.getElementById("myTable"+e),s=0,l=masterEstablishments.length;s<l;s++)if(e==masterEstablishments[s].objectId){document.getElementById("rpList").innerHTML='<div class="establishment-wrapper"><img class="rpImage" src="'+masterEstablishments[s].Image+'"><br><b>'+masterEstablishments[s].Name+"</b><br>"+masterEstablishments[s].Cuisine_Type+"<br>"+masterEstablishments[s].objectId+"<br>"+masterEstablishments[s].Address+"<br><br></div>",document.getElementById("rpList").innerHTML+='<div class="tbl-wrapper" ><table id=\'tbl\' class="striped"><colgroup><col span="1" class="tbl-special"><col span="1" class="tbl-days"></colgroup><thead><tr><th class="tbl-special-th">Special</th><th class="tbl-days-th">Days</th></tr></thead><tbody id="myTable'+s+'"></tbody></table></div>';for(var a=[],i=0,n=t.rows.length;i<n;i++)a.push(t.rows[i].id),i++;console.log("Object IDs:"),console.log(a);var o=[],r=masterEstablishments[s];console.log("Establishment"),console.log(r);var c=[],d=0,p=r.establishmentSpecials.length;console.log("Establishment's number of specials: "+p);for(d=0;d<p;d++)c.push(r.establishmentSpecials[d]);console.log("Establishment's specials: "),console.log(c);for(var m=c,b=c,g={},u=["Breakfast Special","Lunch Special","Dinner Special","Happy Hour"],h=0;h<u.length;h++)g[u[h]]=h;var y=[];(y=m.filter(e=>!a.includes(e.objectId))).sort(function(e,t){return g[e.Category]-g[t.Category]||e.Start_Time.localeCompare(t.Start_Time)}),console.log("Sorted - Other establishment specials: "),console.log(y),(o=b.filter(e=>a.includes(e.objectId))).sort(function(e,t){return g[e.Category]-g[t.Category]||e.Start_Time.localeCompare(t.Start_Time)}),console.log("Sorted - establishment specials"),console.log(o);for(var f=0,S=y.length;f<S;f++)y[f].otherSpecials=void 0;y.length>0&&(y[0].otherSpecials="yes"),console.log("otherSpecials = undefined"),console.log(y);var v=[];v=o.concat(y);console.log(v);for(var I=0;I<v.length;I++){var k,E=document.getElementById("myTable"+s);k=v[I].Days_Of_Week.split(", ");for(var F="M ",M="T ",T="W ",C="T ",B="F ",_="S ",L="S",O=0;O<k.length;O++)"Monday"==k[O]?F=F.fontcolor("#FF3399"):"Tuesday"==k[O]?M=M.fontcolor("#FF3399"):"Wednesday"==k[O]?T=T.fontcolor("#FF3399"):"Thursday"==k[O]?C=C.fontcolor("#FF3399"):"Friday"==k[O]?B=B.fontcolor("#FF3399"):"Saturday"==k[O]?_=_.fontcolor("#FF3399"):"Sunday"==k[O]&&(L=L.fontcolor("#FF3399"));0==I?(addRowTop(E,"Specials matching your search criteria",v[I].objectId),addRow(E,'<div class="category">'+v[I].Category.replace("Special","")+"</div>",'<div class="time-period">'+tConvert(v[I].Start_Time)+" - "+tConvert(v[I].End_Time)+"</div>",v[I].objectId),addRowBottom(E,v[I].Description,'<div class="daysAbbreviated">'+F+M+T+C+B+_+L+"</div>",v[I].objectId)):"yes"==v[I].otherSpecials?(console.log(v[I].Description),addRowTop(E,"Other specials on offer",v[I].objectId),addRow(E,'<div class="category">'+v[I].Category.replace("Special","")+"</div>",'<div class="time-period">'+tConvert(v[I].Start_Time)+" - "+tConvert(v[I].End_Time)+"</div>",v[I].objectId),addRowBottom(E,v[I].Description,'<div class="daysAbbreviated">'+F+M+T+C+B+_+L+"</div>",v[I].objectId)):(addRow(E,'<div class="category">'+v[I].Category.replace("Special","")+"</div>",'<div class="time-period">'+tConvert(v[I].Start_Time)+" - "+tConvert(v[I].End_Time)+"</div>",v[I].objectId),addRowBottom(E,v[I].Description,'<div class="daysAbbreviated">'+F+M+T+C+B+_+L+"</div>",v[I].objectId))}document.getElementById("rpNumOfSpecialsFound").innerHTML=masterEstablishments[s].Name}state="establishment-page",console.log("State: "+state)});