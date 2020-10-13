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
		//console.log(response);
		drawChart(response);

	});
}

function drawChart(response){



	var obj = response;
	for (index = 0; index < obj.chart.result[0].timestamp.length; index++) { 
    	var d = new Date(obj.chart.result[0].timestamp[index]*1000);
    	obj.chart.result[0].timestamp[index] = d.getHours()+":"+d.getMinutes();
	} 

	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: obj.chart.result[0].timestamp,
        datasets: [{
            label: 'OPEN',
            backgroundColor: '#ADD8E6',
            borderColor: '#ADD8E6',
            data: obj.chart.result[0].indicators.quote[0].open ,
            fill: false
        },{
            label: 'CLOSE',
            backgroundColor: '#3c3c3c',
            borderColor: '#3c3c3c',
            data: obj.chart.result[0].indicators.quote[0].close,
            fill: false
        },{
            label: 'HIGH',
            backgroundColor: '#7CFC00',
            borderColor: '#7CFC00',
            data: obj.chart.result[0].indicators.quote[0].high,
            fill: false
        },{
            label: 'LOW',
            backgroundColor: '#ff6347',
            borderColor: '#ff6347',
            data: obj.chart.result[0].indicators.quote[0].low,
            fill: false
        }]
    },

    // Configuration options go here
    options: {
        scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                }
    }
});
}