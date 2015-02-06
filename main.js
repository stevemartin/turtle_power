define(['d3.v3', 'elasticsearch.min'], function (d3, elasticsearch) {
  "use strict";

  var serverAddress = 'qa14.hq.noths.com:9200';
  var client = new elasticsearch.Client({ host: serverAddress });

  $('li').on('click', function(e){
    // alert("THINGTHINGTHING");
    // alert($(e.currentTarget).data('product-id'));
  client.search({
    index: 'orders_uk_staging_20150204105930',
    size: 0,
    body: {
      query: {
        term: { 'product_ids': $(e.currentTarget).data('product-id') }
      },
      aggs: {
        range: {
          date_histogram: {
            field: 'placed_at',
            interval: 'day'
          }
        }
      }
    }
  }).then(function(data){
    // debugger
    data = data.aggregations.range.buckets;

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
       width = 960 - margin.left - margin.right,
       height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%dT00:00:00.000Z").parse; // 2015-01-29T00:00:00.000Z

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.close); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     //console.log(;
      data.forEach(function(d) {
         // console.log(d);
        d.date = parseDate(d.key_as_string);
        console.log(d.date);
        d.close = +d.doc_count;
        // console.log(d);
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.close; })]);

      svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Price ($)");
  });
});
});
