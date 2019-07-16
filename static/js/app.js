 var PANEL = document.getElementById("sample-metadata");
 var PIE = document.getElementById("pie");
 var BUBBLE = document.getElementById("bubble");


 var sample_url = "/samples/<sample>"

 var metadata_url = "/metadata/<sample>"

//function that builds the metadata panel
 function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(data) {
      console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html('');
   
    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(data).forEach(([key, value]) => {PANEL.append("h6").text(`${key}: ${value}`)}); 
    
    
     buildGauge(data.WFREQ);
    });
}

function buildCharts(sample) {

      d3.json(`/samples/${sample}`).then(function(data) {
        console.log(data);

        const ids  = data.otu_ids;
        const labels = data.otu_labels;
        const values = data.sample_values;

    // Build Bubble Chart
     var layout = {
       margin: { t: 10 },
       height: 600,
       width: 1000,
       hovermode: 'closest',
       xaxis: { title: 'OTU ID' }
        };
    var data = [{
       x: ids,
       y: values,
       text: labels,
       mode: 'markers',
       marker: {
           size:  values,
           color: ids,
           colorscale: "Earth"
           }
             }];

    Plotly.newPlot(bubble, data, layout);
    
//  Build a Pie Chart
    var pieData = [{
      values: values.slice(0, 10),
      labels: ids.slice(0, 10),
      hovertext: labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
       }];

  var pieLayout = {
      margin: { t: 0, l: 0 }
  };

  Plotly.newPlot(pie, pieData, pieLayout);
      
  
      });
    

    
  
   

}

function init() {
  // reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
