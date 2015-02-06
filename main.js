define(['d3.v3', 'elasticsearch.min'], function (d3, elasticsearch) {
  "use strict";

  var serverAddress = 'qa14.hq.noths.com:9200';
  var ordersIndex = 'orders_uk_staging_20150204105930';
  var client = new elasticsearch.Client({ host: serverAddress });

  client.search({
    index: ordersIndex,
    size: 0,
    body: {
      query: {
        term: { 'product_ids': 245040 }
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
  }).then(function(resp){
    console.log(resp);
  });
});
