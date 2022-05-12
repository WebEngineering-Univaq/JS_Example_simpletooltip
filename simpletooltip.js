/*

WEB EGINEERING COURSE - University of L'Aquila 

Thi example shows how javascript tooltips can gracefully degrade to html tooltips.
See the course homepage: http://www.di.univaq.it/gdellape/students.php

*/



var tooltip = null;
var current_tooltip_target = null;
var tooltip_show_timer = 0,tooltip_hide_timer=0;

//nasconde la div contenente il tooltip
//hides the tooltip div
function hidetooltip() {
	tooltip.style.display = "none";
	current_tooltip_target=null;
	tooltip_hide_timer=0;	
}

//nasconde il tooltip con un ritardo di 0,2 secondi
//hides the tooltip after 0,2 seconds
function delayhidetooltip() {
	return function(e) {
		if (tooltip_show_timer>0) clearTimeout(tooltip_show_timer);
		tooltip_show_timer=0;		
		if (tooltip_hide_timer>0) clearTimeout(tooltip_hide_timer);
		tooltip_hide_timer = setTimeout(function() {
			if (current_tooltip_target!=null) {
			hidetooltip();
			}
		},200);		
	};
}

//aggiorna il contenuto della div contenente il tooltip, la riposiziona e la rende visibile
//updates the tooltip div content, moves it and shows it
function showtooltip(target,x,y,html) {
	if (current_tooltip_target!=null) {
		if (tooltip_hide_timer>0) clearTimeout(tooltip_hide_timer);
		tooltip_hide_timer=0;
		hidetooltip();
	}
	tooltip.innerHTML = html;
	tooltip.style.left = x+"px";
	tooltip.style.top = y+"px";
	tooltip.style.display = "block";
	current_tooltip_target=target;
	tooltip_show_timer=0;	
}

//mostra il tooltip con un ritardo di 0,2 secondi
//shows the tooltip after 0,2 seconds
function delayshowtooltip(html) {
	return function(e) {	
		if (window.event) e = window.event;
		if (e.srcElement) e.currentTarget = e.target = e.srcElement;
		if(!e.pageX) {
			e.pageX = e.clientX + document.body.scrollLeft;
			e.pageY = e.clientY + document.body.scrollTop;
		}		
		if (tooltip_show_timer>0) clearTimeout(tooltip_show_timer);
		tooltip_show_timer = setTimeout(function() {
			if (current_tooltip_target!=e.target) {
				if (current_tooltip_target!=null) hidetooltip();
				showtooltip(e.target, e.pageX+10,e.pageY,html);
			}
		},500);	
	};
}

//imposta gli event handlers necessari a gestire l'apparizione e la scomparsa del tooltip
//sets the event handlers to show and hide the tooltip
function setupTooltip(tttarget,html) {
	tttarget.onmouseover = delayshowtooltip(html);
	tttarget.onmouseout = delayhidetooltip();
}

//cerca gli elementi con un tooltip (generato tramite title o con la tecnica 
//dei css) all'interno del contenitore specificato, li modifica per attivare
//il tooltip avanzato gestito via javascript

//looks for the elements with a tooltip (generated  through the element title 
//or the css hover technique) inside the specified container, and modifies it
// to activate the advanced javascript tooltip
function getTooltips(container) {
	var spans = container.getElementsByTagName("span");
	var i,j;
	var tipfound=false;
	for(i=0; i<spans.length; ++i) {
		if (spans.item(i).className == "withtooltip") {
			var innerspans = spans.item(i).getElementsByTagName("span");			
			for(j=0; j<innerspans.length; ++j) {
				if (innerspans.item(j).className == "tooltip") {
					setupTooltip(spans.item(i),innerspans.item(j).innerHTML);
					innerspans.item(j).parentNode.removeChild(innerspans.item(j));
					tipfound=true;
					break;
				}
			}
			if (!tipfound && spans.item(i).title) {
				setupTooltip(spans.item(i),spans.item(i).title);
				spans.item(i).title="";
				tipfound=true;
			}
		}
	}
}

//crea la div che conterrà tutti i tooltip
//ed effettua il binding di javascript ai tooltip 
//presenti all'interno del contenitore chiamato "jstest"

//creates a div to contain all the tooltips
//and binds the javascript event handler to all the
//elements with a tooltip inside the container "jstest"
function setupTooltips() {
	tooltip = document.createElement("div");
	tooltip.className="tooltip";
	document.body.appendChild(tooltip);
	getTooltips(document.getElementById("jstest"));
}

//esegue il setup dei tooltip quando il documento è completamente caricato
//setups the tooltips when the document is fully loaded
window.onload = function() {
	setupTooltips();
}