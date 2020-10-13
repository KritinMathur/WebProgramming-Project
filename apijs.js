function autoFill(){

	searchStr = document.getElementById("searchInp").value;

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q="+searchStr,
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
			"x-rapidapi-key": "5a9611cf69msh583bb24c81b90a5p13f1a3jsnaad3b6565ded"
		}
	}


	$.ajax(settings).done(function (response) {
		console.log(response);
		remTable();
		
		inf = dataToInfo(response);

		let table = document.querySelector("table");
		let data = Object.keys(inf[0]);
		generateTableHead(table, data);
		generateTable(table,inf);

	});

}

function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
   let th = document.createElement("th");
   let text = document.createTextNode('Show');
   th.appendChild(text);
   row.appendChild(th);

}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }

    let cell = row.insertCell();
    let btn = document.createElement('button');
    btn.setAttribute("id",element.symbol); 
    btn.setAttribute("onClick",'getChartData(this.id)'); 
    if (element.quoteType != 'EQUITY'){
    	btn.disabled = true;
    }
    cell.appendChild(btn);
  }
}

function remTable() { 
    $('#table tr').remove();
} 


function dataToInfo(data){
	let df = data.quotes;
	for (index = 0; index < df.length; index++) { 
	    delete df[index].index;
	    delete df[index].score;
	    delete df[index].typeDisp;
	    delete df[index].longname;
	    delete df[index].isYahooFinance;
	} 
	return df;
}


function getChartData(ID_symbol){
	var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts?symbol="+ID_symbol+"&interval=5m&range=1d",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
		"x-rapidapi-key": "5a9611cf69msh583bb24c81b90a5p13f1a3jsnaad3b6565ded"
				}
	}

	$.ajax(settings).done(function (response) {
		console.log(response);
	});
}
