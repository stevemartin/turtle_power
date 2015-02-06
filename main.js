define(['d3.v3', 'elasticsearch.min'], function (d3, elasticsearch) {
  "use strict";
  var client = new elasticsearch.Client({
    host: 'qa14.hq.noths.com:9200',
    log: 'trace'
  });

  client.search({
    index: 'orders_uk_staging_20150204105930',
        size: 0,
        body: {
          // Begin query.
          query: {
            term: { 'product_ids': 245040 }
          },
          // Aggregate on the results
          aggs: {
            range: {
              date_histogram: {
                field: 'placed_at',
                interval: 'day'
              }
            }
          }
        }
  }).then(function(resp){
    console.log(resp);
  });

});
