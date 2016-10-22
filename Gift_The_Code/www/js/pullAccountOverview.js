var accountInfo = [[0,0]];
function pullAccountOverview(){
	var title;
	var amount;
	var link;
	$( ".myAccValue" ).each(function( index ) {
	  //console.log( index + ": " + $( this ).text() );
	  if (index % 2 === 0) { 
	  	console.log("Title: " + $(this).text());
	  	title = $( this ).text();
	  }
	   else { 
	   	console.log("Value: " + $(this).text()); 
	   	amount = $( this ).text();
	   	link = $(this).find("a").attr("href");
	   	accountInfo.push([title, amount, link]);
	   }
	});
	return JSON.stringify(accountInfo);
}
pullAccountOverview();

