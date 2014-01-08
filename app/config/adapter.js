// App.ApplicationAdapter = DS.JsonApiAdapter;

App.ApplicationAdapter = DS.FreshBooksApiAdapter.extend({
	host: 'http://localhost:8888'
});
