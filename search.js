define(['d3.v3', 'elasticsearch.min'], function (d3, elasticsearch) {
  "use strict";
    var serverAddress = 'qa14.hq.noths.com:9200';
    var client = new elasticsearch.Client({ host: serverAddress });
    $('#gogo').on('click', function(e) {
        as($('#find_product_id').val());
    });
    $('#find_product').keypress(function(e) {
        //window.setTimeout(500)
        $('#results').empty();
        client.search({
        index: 'products_uk_staging_20150106105755',
        body: {
          query: {
            match_phrase_prefix: { "title": $(e.currentTarget).val() }
          },
          fields: ["title", "id"]
        }
        }).then(function(data){
            console.log(data.hits.hits);
            data.hits.hits.forEach(function(d){
                console.log(d.fields.title);
                console.log(d.fields.title);
                $('#results').append(function() {
                    return $("<li data-product-id='"+d.fields.id+"'>"+d.fields.title+"</li>").click(function(e){
                        as(d.fields.id);
                    });
                });
        });
        });
    });

    function as(id) {
        client.search({
        index: 'orders_uk_staging_20150204105930',
        size: 0,
        body: {
          query: {
            term: { 'product_ids': parseInt(id) }
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

    $("#graph").empty()

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
        d.date = parseDate(d.key_as_string);
        d.close = +d.doc_count;
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
    }

        // $('#find_product').typeahead({
    //      name: 'posts',
    //     remote: {
    //         url: 'http://' + serverAddress + '/test/post/_search?from=0&size=3&q=%QUERY*',
    //         filter: function(parsedResponse) {
    //             var result = [];
    //       $.each(parsedResponse.hits.hits, function(){
    //         var item = $(this)[0]._source;
    //         result.push({
    //           id: item.iD,
    //           author: item.author,
    //           value: item.name,
    //           name: item.name,
    //           content: item.content
    //         });
    //       });
    //             return result;
    //         }
    //     },
    //   cache: false,
    //   header: '<h4 class="suggestion-header">Posts</h4>',
    //     template: [
    //         '<p class="geo-name">{{name}}</p>',
    //         '<p class="geo-country">{{author}}</p>',
    //     '<p class="geo-country text-muted">{{content}}</p>'
    //     ].join(''),
    //     engine: Hogan
    // });
});
